/**
 * EnvGuard — Environment file scanner
 * Discovers .env files and parses their contents for drift comparison.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const ENV_PATTERNS = [
  '.env', '.env.local', '.env.development', '.env.staging',
  '.env.production', '.env.test', '.env.example'
];

/**
 * Parse a .env file into key-value pairs
 */
export function parseEnvFile(content) {
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    vars[key] = val;
  }
  return vars;
}

/**
 * Scan a directory tree for .env files (max 3 levels deep)
 */
export function scanDirectory(rootDir, maxDepth = 3) {
  const results = [];

  function walk(dir, depth) {
    if (depth > maxDepth) return;
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        if (entry === 'node_modules' || entry === '.git') continue;
        const fullPath = join(dir, entry);
        try {
          const stat = statSync(fullPath);
          if (stat.isDirectory() && depth < maxDepth) {
            walk(fullPath, depth + 1);
          } else if (stat.isFile() && ENV_PATTERNS.includes(entry)) {
            const content = readFileSync(fullPath, 'utf8');
            results.push({
              path: fullPath,
              name: entry,
              vars: parseEnvFile(content),
              size: stat.size,
              modified: stat.mtime
            });
          }
        } catch {}
      }
    } catch {}
  }

  walk(rootDir, 0);
  return results;
}

/**
 * Detect sensitive variable names in environment
 */
export function findSensitiveVars(envObj) {
  const pattern = /key|token|secret|pass|auth|api[-_]?key|cred|private|jwt/i;
  const sensitive = [];
  for (const [key, value] of Object.entries(envObj)) {
    if (pattern.test(key)) {
      sensitive.push({ key, value, masked: maskValue(value) });
    }
  }
  return sensitive;
}

function maskValue(val) {
  if (!val || val.length <= 6) return '***';
  return val.slice(0, 3) + '•'.repeat(Math.min(val.length - 6, 12)) + val.slice(-3);
}
