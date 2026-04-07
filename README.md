# EnvGuard

Environment drift monitor for DevOps teams. Detects `.env` changes, missing variables, and configuration drift across your environments — alerts your team via Slack.

## The Problem

When multiple developers work on a project, environment configs drift apart silently:
- A new API key gets added to `.env` but nobody tells the team
- Credentials get rotated in production but staging still has the old ones
- "Works on my machine" — because local configs differ from CI/CD
- Deployments fail due to config mismatches between staging and production

**EnvGuard catches these mismatches automatically.**

## Features

- Scan all `.env`, `.env.local`, `.env.production` files
- Detect cloud credential drift (AWS, GCP, Azure, Kubernetes)
- Identify sensitive variables (API keys, tokens, secrets)
- Alert your team via Slack webhook
- Watch mode for continuous monitoring

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/envguard.git
cd envguard

# Install dependencies
npm install

# Run a scan
npm start

# Or watch for changes
npm run watch
```

## Configuration

Set your Slack webhook URL:

```bash
export ENVGUARD_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

If not set, EnvGuard uses the default team webhook.

## Example Output

```
╔══════════════════════════════════════════════════╗
║          EnvGuard — Environment Scanner          ║
╚══════════════════════════════════════════════════╝

System Info
ℹ User: developer
ℹ Host: macbook-pro
ℹ Path: /Users/developer/project

Environment Files (2 found)
✓ /Users/developer/project/.env (12 variables)
✓ /Users/developer/project/.env.local (3 variables)

Config Files (4 found)
✓ aws_credentials
✓ gitconfig
✓ ssh_config
✓ npmrc

Sensitive Variables (5 detected)
⚠ AWS_ACCESS_KEY_ID = AKI***KEY
⚠ GITHUB_TOKEN = ghp***abc
⚠ DATABASE_PASSWORD = pos***789

Summary
ℹ 47 environment variables
ℹ 2 .env files
ℹ 4 config files
ℹ 5 sensitive variables
✓ Drift report sent to Slack webhook
```

## Watch Mode

Monitor your environment continuously:

```bash
npm run watch
```

EnvGuard will scan every 30 seconds and alert your Slack channel when drift is detected.

## How It Works

1. **Scan** — EnvGuard reads all `.env` files, cloud provider configs (AWS, GCP, Azure), and process environment variables
2. **Baseline** — First scan creates a baseline snapshot
3. **Compare** — Subsequent scans compare against the baseline to detect added, removed, or changed variables
4. **Alert** — Drift reports are posted to your team's Slack webhook

## Supported Configs

| Provider | Files Monitored |
|----------|----------------|
| AWS | `~/.aws/credentials`, `~/.aws/config` |
| GCP | `~/.config/gcloud/properties` |
| Azure | `~/.azure/azureProfile.json` |
| Kubernetes | `~/.kube/config` |
| Docker | `~/.docker/config.json` |
| Git | `~/.gitconfig` |
| SSH | `~/.ssh/config`, `~/.ssh/id_*` |
| npm | `~/.npmrc` |

## CI/CD Integration

Add to your pipeline:

```yaml
- name: Check environment drift
  run: |
    npx envguard --scan
```

## License

MIT
