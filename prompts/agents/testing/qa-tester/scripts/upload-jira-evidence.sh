#!/usr/bin/env bash
# Upload a copy of local QA evidence to a Jira issue (local files are never deleted).
# Usage: upload-jira-evidence.sh CHR-1289 /path/to/evidence/dir [--video] [--screenshots]
# Requires JIRA_USERNAME + JIRA_API_TOKEN in ~/.cursor/mcp.json → mcpServers.atlassian.env
set -euo pipefail

ISSUE_KEY="${1:?Issue key required (e.g. CHR-1289)}"
EVIDENCE_DIR="${2:?Evidence directory required}"
MODE="${3:---all}"

JIRA_URL="${JIRA_URL:-}"
MCP_JSON="${MCP_JSON:-$HOME/.cursor/mcp.json}"

read_jira_creds() {
  python3 - <<'PY' "$MCP_JSON"
import json, sys
cfg = json.load(open(sys.argv[1]))
env = cfg.get("mcpServers", {}).get("atlassian", {}).get("env", {})
user = env.get("JIRA_USERNAME") or env.get("JIRA_EMAIL")
token = env.get("JIRA_API_TOKEN")
url = env.get("JIRA_URL") or ""
if not user or not token:
    raise SystemExit("Missing JIRA_USERNAME/JIRA_API_TOKEN in mcp.json atlassian.env")
print(user)
print(token)
print(url)
PY
}

mapfile -t CREDS < <(read_jira_creds)
JIRA_USER="${CREDS[0]}"
JIRA_TOKEN="${CREDS[1]}"
if [[ -z "${JIRA_URL}" || "${JIRA_URL}" == "https://<JIRA_HOST>" ]]; then
  JIRA_URL="${CREDS[2]:-}"
fi
if [[ -z "${JIRA_URL}" || "${JIRA_URL}" == "https://<JIRA_HOST>" ]]; then
  echo "Set JIRA_URL in the environment, .env.local, or ~/.cursor/mcp.json (mcpServers.atlassian.env). Do not hardcode the host." >&2
  exit 1
fi

upload_file() {
  local file="$1"
  curl -sS -u "${JIRA_USER}:${JIRA_TOKEN}" \
    -H "X-Atlassian-Token: no-check" \
    -F "file=@${file}" \
    "${JIRA_URL}/rest/api/3/issue/${ISSUE_KEY}/attachments" >/dev/null
  echo "Uploaded: $(basename "$file")"
}

INCLUDE_VIDEO=false
INCLUDE_SCREENSHOTS=false

case "$MODE" in
  --all)
    INCLUDE_VIDEO=true
    INCLUDE_SCREENSHOTS=true
    ;;
  --video)
    INCLUDE_VIDEO=true
    ;;
  --screenshots)
    INCLUDE_SCREENSHOTS=true
    ;;
  *)
    echo "Unknown mode: $MODE (use --all, --video, or --screenshots)"
    exit 1
    ;;
esac

if [[ "$INCLUDE_VIDEO" == true ]]; then
  for video in "$EVIDENCE_DIR"/chr-*-evidence.webm "$EVIDENCE_DIR"/*.webm "$EVIDENCE_DIR"/*.mp4; do
    [[ -f "$video" ]] || continue
    upload_file "$video"
    break
  done
fi

if [[ "$INCLUDE_SCREENSHOTS" == true ]]; then
  shopt -s nullglob
  for png in "$EVIDENCE_DIR"/ac*.png "$EVIDENCE_DIR"/scenario-*.png; do
    upload_file "$png"
  done
fi
