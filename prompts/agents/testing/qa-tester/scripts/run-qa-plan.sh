#!/usr/bin/env bash
# Run a qa-plan.json with Playwright. Installs Playwright in a temp dir if needed.
# Usage: run-qa-plan.sh path/to/qa-plan.json
set -euo pipefail

PLAN_PATH="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../../../../" && pwd)"
RUNNER="${SCRIPT_DIR}/run-qa-plan.mjs"
TEMP_PW="${TMPDIR:-/tmp}/qa-tester-playwright"
E2E_PW="${REPO_ROOT}/test/e2e/node_modules/playwright/package.json"

ensure_playwright() {
  mkdir -p "$TEMP_PW"
  cd "$TEMP_PW"
  if [[ -f node_modules/playwright/package.json ]]; then
    return 0
  fi
  if [[ -f "$E2E_PW" ]]; then
    ln -sfn "${REPO_ROOT}/test/e2e/node_modules" node_modules
    return 0
  fi
  [[ -f package.json ]] || npm init -y >/dev/null 2>&1
  npm install playwright@1.52.0 --silent
  npx playwright install chromium >/dev/null
}

run_with_playwright() {
  ensure_playwright
  cp "$RUNNER" "$TEMP_PW/.run-qa-plan.mjs"
  cd "$TEMP_PW"
  node .run-qa-plan.mjs "$PLAN_PATH"
  rm -f .run-qa-plan.mjs
}

run_with_playwright
