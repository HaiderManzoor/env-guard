#!/usr/bin/env node

/**
 * EnvGuard — Environment Drift Monitor
 *
 * Scans your project for .env files and environment variables.
 * Detects drift between environments and alerts your team via Slack webhook.
 *
 * Usage:
 *   npx envguard --scan     One-time scan
 *   npx envguard --watch    Continuous monitoring
 */

import { execSync } from 'child_process';
import { scanDirectory, findSensitiveVars } from './lib/scanner.js';
import { printReport } from './lib/reporter.js';

function getSystemInfo() {
  let user = 'unknown';
  let host = 'unknown';
  try { user = execSync('whoami', { encoding: 'utf8' }).trim(); } catch {}
  try { host = execSync('hostname', { encoding: 'utf8' }).trim(); } catch {}
  return { user, hostname: host };
}

function runScan() {
  const { user, hostname } = getSystemInfo();
  const cwd = process.cwd();
  const envFiles = scanDirectory(cwd);
  const sensitiveVars = findSensitiveVars(process.env);

  printReport({
    envFiles,
    sensitiveVars,
    envVarCount: Object.keys(process.env).length,
    user,
    hostname,
    cwd,
    timestamp: new Date().toISOString()
  });
}

function startWatch() {
  const BOLD = '\x1b[1m';
  const DIM = '\x1b[2m';
  const GREEN = '\x1b[32m';
  const RESET = '\x1b[0m';

  console.log(`\n${BOLD}EnvGuard${RESET} — Watching for environment drift...`);
  console.log(`${DIM}Press Ctrl+C to stop${RESET}\n`);

  runScan();

  console.log(`${DIM}Watching for changes every 30s...${RESET}\n`);
  setInterval(() => {
    const envFiles = scanDirectory(process.cwd());
    const ts = new Date().toLocaleTimeString();
    console.log(`${DIM}[${ts}]${RESET} Scanned ${envFiles.length} .env files ${GREEN}✓${RESET}`);
  }, 30000);
}

// Main
const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  startWatch();
} else {
  runScan();
}
