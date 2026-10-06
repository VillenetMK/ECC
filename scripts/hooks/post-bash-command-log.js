#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const MAX_STDIN = 1024 * 1024;
let raw = '';

const MODE_CONFIG = {
  audit: {
    fileName: 'bash-commands.log',
    format: command => `[${new Date().toISOString()}] ${command}`,
  },
  cost: {
    fileName: 'cost-tracker.log',
    format: command => `[${new Date().toISOString()}] tool=Bash command=${command}`,
  },
};

// Match whole credential names, including provider prefixes, without treating
// options such as --token-count or --api-key-file as credential values.
const SECRET_NAME = /(?:^|[_-])(?:api[_-]?key|token|password|secret|secret[_-]access[_-]key)$/i;

function secretValueEnd(command, start, outerQuote) {
  let quote = outerQuote;
  let index = start;

  while (index < command.length) {
    const character = command[index];
    if (character === '\\' && quote !== "'") {
      index += 2;
      continue;
    }
    if (quote === "'") {
      if (character === "'") quote = '';
    } else if (character === '`' || (character === '$' && ['(', '{', "'", '['].includes(command[index + 1]))) {
      // Expansions can contain whitespace, nested quotes and shell operators.
      // Omit the remaining command rather than risk logging part of a secret.
      return command.length;
    } else if (character === '"' || (!quote && character === "'")) {
      quote = quote ? '' : character;
    } else if (!quote && /[()]/.test(character)) {
      return command.length;
    } else if (!quote && /[ \t\n;|&<>]/.test(character)) {
      // Bash does not split words on CR, NBSP or other Unicode whitespace.
      return index;
    }
    index++;
  }

  // An unterminated quote is also unsafe to split at whitespace.
  return command.length;
}

function redactNamedSecrets(command) {
  const marker = /(?<![A-Za-z0-9_-])(["']?)(?:(Authorization:)[ \t:]*|((?:--)?[A-Za-z_][A-Za-z0-9_-]*)(\1)?(?:[ \t]*=[ \t]*|[ \t]+))/gi;
  let result = '';
  let cursor = 0;
  let match;

  while ((match = marker.exec(command)) !== null) {
    const [, outerQuote, header, name, nameCloseQuote] = match;
    if (!header && !SECRET_NAME.test(name)) continue;

    // A quoted name can end before its value: "--api-key" "secret".
    const valueQuote = nameCloseQuote ? '' : outerQuote;
    let valueStart = marker.lastIndex;
    let ambiguous = outerQuote === "'" && command[match.index - 1] === '$';
    if (header && !outerQuote) {
      const scheme = /^(?:Bearer|Basic|Token)[ \t]+/i.exec(command.slice(valueStart));
      if (scheme) valueStart += scheme[0].length;
      else if (/^[^"' \t\n]+[ \t]/.test(command.slice(valueStart))) ambiguous = true;
    }
    const end = ambiguous ? command.length : secretValueEnd(command, valueStart, valueQuote);
    const label = header ? 'Authorization:' : `${name}=`;
    result += command.slice(cursor, match.index) + valueQuote + label + '<REDACTED>' + valueQuote;
    cursor = end;
    marker.lastIndex = end;
  }

  return result + command.slice(cursor);
}

function sanitizeCommand(command) {
  // Join shell continuations first; retain real newlines until quoted values
  // have been removed so multiline credentials cannot escape the redaction.
  const joinedCommand = String(command || '').replace(/\\\r?\n/g, '');
  return redactNamedSecrets(joinedCommand)
    .replace(/[\r\n]/g, ' ')
    .replace(/\bAKIA[A-Z0-9]{16}\b/g, '<REDACTED>')
    .replace(/\bASIA[A-Z0-9]{16}\b/g, '<REDACTED>')
    .replace(/\bghp_[A-Za-z0-9_]+\b/g, '<REDACTED>')
    .replace(/\bgho_[A-Za-z0-9_]+\b/g, '<REDACTED>')
    .replace(/\bghs_[A-Za-z0-9_]+\b/g, '<REDACTED>')
    .replace(/\bgithub_pat_[A-Za-z0-9_]+\b/g, '<REDACTED>');
}

function appendLine(filePath, line) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${line}\n`, 'utf8');
}

function run(rawInput, mode = 'audit') {
  const config = MODE_CONFIG[mode];

  try {
    if (config) {
      const input = String(rawInput || '').trim() ? JSON.parse(String(rawInput)) : {};
      const command = sanitizeCommand(input.tool_input?.command || '?');
      appendLine(path.join(os.homedir(), '.claude', config.fileName), config.format(command));
    }
  } catch {
    // Logging must never block the calling hook.
  }

  return typeof rawInput === 'string' ? rawInput : JSON.stringify(rawInput);
}

function main() {
  const mode = process.argv[2];

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (raw.length < MAX_STDIN) {
      const remaining = MAX_STDIN - raw.length;
      raw += chunk.substring(0, remaining);
    }
  });

  process.stdin.on('end', () => {
    process.stdout.write(run(raw, mode));
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  run,
  sanitizeCommand,
};
