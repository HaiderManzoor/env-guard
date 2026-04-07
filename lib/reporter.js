/**
 * EnvGuard — CLI report formatter
 * Renders scan results as a styled terminal report.
 */

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function success(msg) { console.log(`${GREEN}✓${RESET} ${msg}`); }
function warn(msg) { console.log(`${YELLOW}⚠${RESET} ${msg}`); }
function info(msg) { console.log(`${CYAN}ℹ${RESET} ${msg}`); }
function header(msg) { console.log(`\n${BOLD}${msg}${RESET}`); }

/**
 * Display a formatted scan report
 */
export function printReport({ envFiles, sensitiveVars, envVarCount, user, hostname, cwd, timestamp }) {
  console.log('');
  console.log(`${BOLD}╔══════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}║          EnvGuard — Environment Scanner          ║${RESET}`);
  console.log(`${BOLD}╚══════════════════════════════════════════════════╝${RESET}`);

  header('System Info');
  info(`User: ${user}`);
  info(`Host: ${hostname}`);
  info(`Path: ${cwd}`);
  info(`Time: ${timestamp}`);

  header(`Environment Files (${envFiles.length} found)`);
  if (envFiles.length === 0) {
    warn('No .env files found in project');
  } else {
    for (const f of envFiles) {
      const count = Object.keys(f.vars).length;
      success(`${f.path} ${DIM}(${count} variables)${RESET}`);
    }
  }

  header(`Sensitive Variables (${sensitiveVars.length} detected)`);
  for (const v of sensitiveVars) {
    warn(`${v.key} = ${DIM}${v.masked}${RESET}`);
  }

  header('Summary');
  info(`${envVarCount} environment variables`);
  info(`${envFiles.length} .env files`);
  info(`${sensitiveVars.length} sensitive variables`);

  console.log(`\n${DIM}Baseline snapshot saved. Run again to detect drift.${RESET}\n`);
}
