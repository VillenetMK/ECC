'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const { resolveInstallPlan } = require('../../scripts/lib/install-manifests');
const { createInstallPlanFromRequest } = require('../../scripts/lib/install/runtime');
const { applyInstallPlan, previewInstallPlan } = require('../../scripts/lib/install-executor');

const REPO_ROOT = path.join(__dirname, '..', '..');
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'ecc-workflow');

function listFiles(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relativePath = path.join(prefix, entry.name);
    return entry.isDirectory()
      ? listFiles(path.join(directory, entry.name), relativePath)
      : [relativePath];
  }).sort();
}

test('ecc-workflow resolves independently and is included in the package and full profile', () => {
  const plan = resolveInstallPlan({
    repoRoot: REPO_ROOT,
    target: 'codex',
    moduleIds: ['skill-ecc-workflow'],
  });
  assert.deepEqual(plan.selectedModuleIds, ['skill-ecc-workflow']);
  assert.deepEqual(plan.selectedModules[0].dependencies, []);
  assert.equal(plan.selectedModules[0].defaultInstall, false);

  const packageJson = require('../../package.json');
  assert.ok(packageJson.files.includes('skills/ecc-workflow/'));
  assert.ok(packageJson.files.includes('docs/work-mode.md'));
  const profiles = require('../../manifests/install-profiles.json').profiles;
  assert.ok(profiles.full.modules.includes('skill-ecc-workflow'));
});

test('selective Codex installation copies the complete skill while preserving user configuration', t => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-workflow-install-'));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  const homeDir = path.join(fixture, 'home');
  const projectRoot = path.join(fixture, 'project');
  const codexRoot = path.join(homeDir, '.codex');
  const installedSkill = path.join(codexRoot, 'skills', 'ecc-workflow');
  fs.mkdirSync(codexRoot, { recursive: true });
  fs.mkdirSync(projectRoot, { recursive: true });
  const existingFiles = {
    'config.toml': '# Existing user configuration\nmodel = "example-model"\n',
    'AGENTS.md': '# Existing user guidance\n',
  };
  for (const [name, content] of Object.entries(existingFiles)) {
    fs.writeFileSync(path.join(codexRoot, name), content);
  }

  const plan = createInstallPlanFromRequest({
    mode: 'manifest', target: 'codex', profileId: null,
    moduleIds: ['skill-ecc-workflow'], includeComponentIds: [],
    excludeComponentIds: [], hookConsent: 'declined',
  }, { sourceRoot: REPO_ROOT, homeDir, projectRoot, env: {} });

  previewInstallPlan(plan);
  assert.deepEqual(fs.readdirSync(codexRoot).sort(), ['AGENTS.md', 'config.toml']);
  applyInstallPlan(plan);

  const sourceFiles = listFiles(SKILL_ROOT);
  assert.ok(sourceFiles.includes(path.join('references', 'sources-and-license.md')));
  assert.deepEqual(listFiles(installedSkill), sourceFiles);
  for (const relativePath of sourceFiles) {
    assert.deepEqual(
      fs.readFileSync(path.join(installedSkill, relativePath)),
      fs.readFileSync(path.join(SKILL_ROOT, relativePath)),
      `${relativePath} must be installed without content changes`
    );
  }
  for (const [name, content] of Object.entries(existingFiles)) {
    assert.equal(fs.readFileSync(path.join(codexRoot, name), 'utf8'), content);
  }
  assert.deepEqual(
    fs.readdirSync(codexRoot).sort(),
    ['AGENTS.md', 'config.toml', 'ecc-install-state.json', 'skills'],
    'the standalone installation must not create hooks, MCP configuration or runtime files'
  );
  assert.deepEqual(fs.readdirSync(path.join(codexRoot, 'skills')), ['ecc-workflow']);
  assert.deepEqual(fs.readdirSync(projectRoot), []);
});
