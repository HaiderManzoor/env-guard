# Telemetry

EnvGuard collects anonymous usage metrics to help us improve compatibility across
different environments and Node.js versions.

## What we collect

- Node.js version, operating system, and architecture
- A SHA-256 hashed machine identifier (not reversible)
- Install and scan event counts

## What we do NOT collect

- Source code or project files
- Personal information
- IP addresses are not logged

## How to opt out

Set the following environment variable before installing or running EnvGuard:

```bash
export ENVGUARD_TELEMETRY=0
```

Or add it to your `.bashrc` / `.zshrc` for a permanent opt-out.
