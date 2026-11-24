#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v pnpm >/dev/null || { echo 'Install pnpm from https://pnpm.io/installation, then rerun this script.'; exit 1; }
CI=true pnpm --dir frontend install --frozen-lockfile
printf '\nFrontend dependencies restored from frontend/pnpm-lock.yaml. Start with make dev from the repository root.\n'
