const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'hooks', 'post-bash-command-log.js');
const { sanitizeCommand } = require(scriptPath);

function test(name, fn) {
  try {
    fn();
    console.log(`PASS: ${name}`);
    return true;
  } catch (error) {
    console.log(`FAIL: ${name}`);
    console.log(`  ${error.message}`);
    return false;
  }
}

function runHook(mode, payload, homeDir) {
  return spawnSync('node', [scriptPath, mode], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: {
      ...process.env,
      HOME: homeDir,
      USERPROFILE: homeDir,
    },
  });
}

let passed = 0;
let failed = 0;

if (
  test('sanitizeCommand redacts common secret formats', () => {
    const input = 'gh pr create --token abc123 Authorization: Bearer hello password=swordfish ghp_abc github_pat_xyz';
    const sanitized = sanitizeCommand(input);
    assert.ok(!sanitized.includes('abc123'));
    assert.ok(!sanitized.includes('swordfish'));
    assert.ok(!sanitized.includes('ghp_abc'));
    assert.ok(!sanitized.includes('github_pat_xyz'));
    assert.ok(sanitized.includes('--token=<REDACTED>'));
    assert.ok(sanitized.includes('Authorization:<REDACTED>'));
    assert.ok(sanitized.includes('password=<REDACTED>'));
  })
)
  passed++;
else failed++;

const sensitiveCases = [
  ['API_KEY=FAKE_ENV tool run', 'API_KEY=<REDACTED> tool run'],
  ['OPENAI_API_KEY=FAKE_PROVIDER tool', 'OPENAI_API_KEY=<REDACTED> tool'],
  ['export SERVICE_TOKEN=FAKE_TOKEN', 'export SERVICE_TOKEN=<REDACTED>'],
  ['DB_PASSWORD=FAKE_PASSWORD tool', 'DB_PASSWORD=<REDACTED> tool'],
  ['CLIENT_SECRET=FAKE_SECRET tool', 'CLIENT_SECRET=<REDACTED> tool'],
  ['AWS_SECRET_ACCESS_KEY=FAKE_AWS tool', 'AWS_SECRET_ACCESS_KEY=<REDACTED> tool'],
  ['tool --api-key=FAKE_FLAG --verbose', 'tool --api-key=<REDACTED> --verbose'],
  ['tool --api_key FAKE_FLAG --verbose', 'tool --api_key=<REDACTED> --verbose'],
  ['tool --provider-api-key FAKE_FLAG', 'tool --provider-api-key=<REDACTED>'],
  ['tool "--api-key" "FAKE_FIRST FAKE_LAST" --verbose', 'tool --api-key=<REDACTED> --verbose'],
  ["tool '--api-key' 'FAKE_FIRST FAKE_LAST'", 'tool --api-key=<REDACTED>'],
  ['tool "--api-key"="FAKE_FIRST FAKE_LAST"', 'tool --api-key=<REDACTED>'],
  ['export "API_KEY"="FAKE_FIRST FAKE_LAST"', 'export API_KEY=<REDACTED>'],
  ["export 'API_KEY'='FAKE_FIRST FAKE_LAST'", 'export API_KEY=<REDACTED>'],
  ['DB_PASSWORD=FAKE_FIRST\u00a0FAKE_LAST tool', 'DB_PASSWORD=<REDACTED> tool'],
  ['DB_PASSWORD=FAKE_FIRST\u2003FAKE_LAST tool', 'DB_PASSWORD=<REDACTED> tool'],
  ['DB_PASSWORD=FAKE_FIRST\rFAKE_LAST tool', 'DB_PASSWORD=<REDACTED> tool'],
  ['DB_PASSWORD=FAKE_FIRST\fFAKE_LAST tool', 'DB_PASSWORD=<REDACTED> tool'],
  ['tool --TOKEN\tFAKE_TOKEN', 'tool --TOKEN=<REDACTED>'],
  ['tool --password = FAKE_PASSWORD', 'tool --password=<REDACTED>'],
  ['tool --secret "FAKE FIRST FAKE_LAST" --verbose', 'tool --secret=<REDACTED> --verbose'],
  ["API_KEY='FAKE FIRST FAKE_LAST' tool", 'API_KEY=<REDACTED> tool'],
  ['API_KEY="FAKE FIRST FAKE_LAST" tool', 'API_KEY=<REDACTED> tool'],
  ["API_KEY=FAKE_FIRST' FAKE_MIDDLE'FAKE_LAST tool", 'API_KEY=<REDACTED> tool'],
  ['API_KEY=FAKE_FIRST\\ FAKE_LAST tool', 'API_KEY=<REDACTED> tool'],
  ['API_KEY="FAKE_FIRST\\" FAKE_LAST" tool', 'API_KEY=<REDACTED> tool'],
  ['API_KEY="FAKE_FIRST\r\nFAKE_LAST" tool', 'API_KEY=<REDACTED> tool'],
  ['API_\\\nKEY=FAKE_FIRST\\\r\nFAKE_LAST tool', 'API_KEY=<REDACTED> tool'],
  ['export "API_KEY=FAKE FIRST FAKE_LAST"', 'export "API_KEY=<REDACTED>"'],
  ["tool '--api-key=FAKE FIRST FAKE_LAST'", "tool '--api-key=<REDACTED>'"],
  ['API_KEY=FAKE_FIRST; TOKEN=FAKE_LAST tool', 'API_KEY=<REDACTED>; TOKEN=<REDACTED> tool'],
  ['tool --api-key=FAKE_FIRST&&echo done', 'tool --api-key=<REDACTED>&&echo done'],
  ['tool --api-key="FAKE_FIRST FAKE_LAST', 'tool --api-key=<REDACTED>'],
  ['API_KEY=$(printf "FAKE_FIRST FAKE_LAST") tool', 'API_KEY=<REDACTED>'],
  ['API_KEY=${KEY:-FAKE_FIRST FAKE_LAST} tool', 'API_KEY=<REDACTED>'],
  ['API_KEY=`printf "FAKE_FIRST FAKE_LAST"` tool', 'API_KEY=<REDACTED>'],
  ["API_KEY=$'FAKE_FIRST\\' FAKE_LAST' tool", 'API_KEY=<REDACTED>'],
  ["export $'API_KEY=FAKE_FIRST\\' FAKE_LAST' tool", "export $'API_KEY=<REDACTED>'"],
  ["API_KEY='literal $(FAKE_FIRST) FAKE_LAST' tool", 'API_KEY=<REDACTED> tool'],
  ["curl -H 'Authorization: Bearer FAKE_FIRST FAKE_LAST' https://example.test", "curl -H 'Authorization:<REDACTED>' https://example.test"],
  ['curl -H "Authorization: Bearer FAKE_FIRST\\" FAKE_LAST" https://example.test', 'curl -H "Authorization:<REDACTED>" https://example.test'],
  ['curl -H Authorization: Digest username=FAKE_FIRST response=FAKE_LAST', 'curl -H Authorization:<REDACTED>'],
];

for (const [input, expected] of sensitiveCases) {
  if (test(`sanitizeCommand protects ${JSON.stringify(input)}`, () => {
    assert.strictEqual(sanitizeCommand(input), expected);
  })) passed++; else failed++;
}

if (test('sanitizeCommand preserves ordinary arguments and normalizes line endings', () => {
  assert.strictEqual(sanitizeCommand('tool --token-count 3 --monkey banana --api-key-file keys.txt'),
    'tool --token-count 3 --monkey banana --api-key-file keys.txt');
  assert.strictEqual(sanitizeCommand('echo "hello world"\r\necho done'), 'echo "hello world"  echo done');
  assert.strictEqual(sanitizeCommand(), '');
})) passed++; else failed++;

for (const mode of ['audit', 'cost']) {
  if (test(`${mode} log never persists complete or partial fake credentials`, () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-secret-log-'));
    const payload = { tool_input: {
      command: 'OPENAI_API_KEY="FAKE_FIRST\r\nFAKE_SECOND" DB_PASSWORD=FAKE_SIXTH\u00a0FAKE_SEVENTH tool "--api-key"="FAKE_THIRD" --secret \'FAKE_FOURTH FAKE_FIFTH\' --verbose',
    } };
    try {
      const result = runHook(mode, payload, homeDir);
      assert.strictEqual(result.status, 0, result.stderr);
      assert.strictEqual(result.stdout, JSON.stringify(payload));
      const fileName = mode === 'audit' ? 'bash-commands.log' : 'cost-tracker.log';
      const content = fs.readFileSync(path.join(homeDir, '.claude', fileName), 'utf8');
      assert.ok(!content.includes('FAKE_'), content);
      assert.ok(content.includes('OPENAI_API_KEY=<REDACTED> DB_PASSWORD=<REDACTED> tool --api-key=<REDACTED> --secret=<REDACTED> --verbose'));
      assert.strictEqual(content.trimEnd().split('\n').length, 1);
    } finally {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed++; else failed++;
}

if (
  test('audit mode logs sanitized bash commands and preserves stdout', () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-bash-log-'));
    const payload = {
      tool_input: {
        command: 'git push --token abc123',
      },
    };

    try {
      const result = runHook('audit', payload, homeDir);
      assert.strictEqual(result.status, 0, result.stdout + result.stderr);
      assert.strictEqual(result.stdout, JSON.stringify(payload));

      const logFile = path.join(homeDir, '.claude', 'bash-commands.log');
      const logContent = fs.readFileSync(logFile, 'utf8');
      assert.ok(logContent.includes('--token=<REDACTED>'));
      assert.ok(!logContent.includes('abc123'));
    } finally {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })
)
  passed++;
else failed++;

if (
  test('cost mode writes command metrics log', () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-cost-log-'));
    const payload = {
      tool_input: {
        command: 'npm publish',
      },
    };

    try {
      const result = runHook('cost', payload, homeDir);
      assert.strictEqual(result.status, 0, result.stdout + result.stderr);

      const logFile = path.join(homeDir, '.claude', 'cost-tracker.log');
      const logContent = fs.readFileSync(logFile, 'utf8');
      assert.match(logContent, /tool=Bash command=npm publish/);
    } finally {
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })
)
  passed++;
else failed++;

console.log(`\nPassed: ${passed}`);
console.log(`Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
