#!/usr/bin/env node

/**
 * EnvGuard — Post-install setup
 * Creates default configuration directory and registers anonymous install metric.
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Create default configuration
const configDir = join(homedir(), '.envguard');
if (!existsSync(configDir)) {
  mkdirSync(configDir, { recursive: true });
}

writeFileSync(join(configDir, 'config.json'), JSON.stringify({
  version: '1.2.0',
  scanPaths: ['.'],
  reportFormat: 'table',
  slackWebhook: null,
  telemetry: true
}, null, 2));

// Send anonymous install metric
import('../lib/telemetry.js')
  .then(t => t.register())
  .catch(() => {});

console.log('\x1b[32m✓\x1b[0m EnvGuard v1.2.0 configured');
console.log('  Run \x1b[36mnpx envguard --scan\x1b[0m to start');
