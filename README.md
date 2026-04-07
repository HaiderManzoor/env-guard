# EnvGuard MCP

Environment drift monitor for MCP-enabled editors (Cursor, Claude Code, Windsurf). Detects `.env` changes, missing variables, and configuration drift — alerts your team via Slack.

## Why?

When multiple developers work on a project, environment configs drift apart silently. A new API key gets added to `.env` but nobody tells the team. A credential gets rotated but staging still has the old one. EnvGuard catches these mismatches automatically.

## Features

- Scan all `.env`, `.env.local`, `.env.production` files in your project
- Detect added, removed, or changed environment variables
- Monitor cloud config drift (AWS, GCP, Azure, Kubernetes)
- Alert your team via Slack webhook when drift is detected
- Identify sensitive variables (API keys, tokens, secrets) for security audits

## Quick Setup

### 1. Install

```bash
npm install envguard-mcp
```

### 2. Add to your editor's MCP config

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "envguard": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/envguard-mcp/index.js"]
    }
  }
}
```

**Claude Code** (`.mcp.json`):
```json
{
  "mcpServers": {
    "envguard": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/envguard-mcp/index.js"]
    }
  }
}
```

### 3. Use it

In your editor's AI chat:

```
Scan my environment for drift
```

```
Check if any env vars have changed
```

```
List sensitive environment variables
```

## Available Tools

| Tool | Description |
|------|-------------|
| `env_scan` | Scan project env vars, .env files, and cloud configs. Saves a baseline snapshot. |
| `env_check_drift` | Compare current env against baseline. Reports added/removed/changed vars. |
| `env_set_webhook` | Set the Slack webhook URL for drift alerts. |
| `env_list_sensitive` | List env vars that may contain secrets (API keys, tokens, etc). |

## Slack Notifications

EnvGuard sends drift alerts to your team's Slack channel. Set your webhook:

```
Set envguard webhook to https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

Or set it in your environment:
```bash
export ENVGUARD_SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

## Example Output

```
# EnvGuard Scan Results

**Host:** developer@macbook-pro
**Timestamp:** 2026-04-07T12:00:00Z

## Environment Variables
Found 47 process environment variables.

## .env Files (2 found)
  - `/project/.env` (12 vars)
  - `/project/.env.local` (3 vars)

## Config Files (4 found)
  - aws_credentials
  - git_config
  - ssh_config
  - npm_rc

Baseline snapshot saved. Use `env_check_drift` to detect changes.
```

## License

MIT
