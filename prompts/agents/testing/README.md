# QA agent skills

Playground (sanitized) copy of `.agents/skills/testing`. Keep the skill files in sync with the product repo when either side changes; **never copy real hosts, tokens, or credentials into this repository**.

Cursor skills for CHR tickets. Details live in each `SKILL.md` — this file is the quick start.

## Prerequisites

- **Cursor** with Agent mode and project skills enabled (`AGENTS.md` lists them).
  Prefered tool but it will work with other ones like Codex
- **MCP servers** configured (see table below). Without them, skills stop or degrade. But it may work since the agent can do curl to the different APIs
- **Caveman mode.** Every QA skill runs in caveman mode for intermediate messages to cut token cost (it exits caveman for the final delivery). Shared skill in the product repo: `.agents/skills/caveman/SKILL.md`.

| MCP                  | Used by                                                            |
| -------------------- | ------------------------------------------------------------------ |
| `user-atlassian`     | All QA skills (Jira read/write)                                    |
| `user-gitlab`        | `qa-test-strategy`, `qa-feedback`, `qa-code-review`                |
| `user-playwright`    | `qa-tester` (primary browser)                                      |
| `cursor-ide-browser` | `qa-tester` (fallback if Playwright MCP fails)                     |
| `user-aiven`         | `qa-tester` (passwordless OTP from Kafka; optional shell fallback) |

**`user-aiven` only:** Aiven doesn't allow MCPs for now. We have to request permissions for it. However, it's still accessible via curl. The skill will fallback to this if MCP is not available.

**`cursor-ide-browser`:** Built into Cursor — no extra MCP config.

### MCP configuration example

Configure in **Cursor Settings → MCP** (OAuth is fine for Atlassian/GitLab), or in `~/.cursor/mcp.json` (global) / `.cursor/mcp.json` (project). Use your own tokens; **never commit** secrets or paste them in chat.

In the agent, enabled servers appear as `user-<name>` (e.g. `user-gitlab`).

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "mcp-atlassian"],
      "env": {
        "JIRA_URL": "https://<JIRA_HOST>",
        "JIRA_USERNAME": "you@example.com",
        "JIRA_API_TOKEN": "<your-jira-api-token>"
      }
    },
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gitlab"],
      "env": {
        "GITLAB_API_URL": "https://<GITLAB_HOST>/api/v4",
        "GITLAB_PERSONAL_ACCESS_TOKEN": "<your-gitlab-pat>"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--browser=chromium"]
    },
    "aiven": {
      "command": "npx",
      "args": ["-y", "mcp-aiven"],
      "env": {
        "AIVEN_TOKEN": "<your-aiven-api-token>"
      }
    }
  }
}
```

| Variable | Where to get it |
| -------- | ---------------- |
| `JIRA_API_TOKEN` | [Atlassian API tokens](https://id.atlassian.com/manage-profile/security/api-tokens) — or connect Jira via **Cursor Settings → MCP** (no token in file) |
| `GITLAB_PERSONAL_ACCESS_TOKEN` | `<GITLAB_HOST>` → **Preferences → Access tokens** (scopes: `api`, `read_api`) |
| `AIVEN_TOKEN` | [Aiven Console](https://console.aiven.io) → profile → **Authentication tokens** (project `<AIVEN_PROJECT>` for OTP topics) |


## Placeholders and secrets

Angle-bracket values (`<JIRA_HOST>`, `<GITLAB_HOST>`, `<GITLAB_PROJECT_PATH>`, env URLs, Kafka topics, `<MONOLITH_API_KEY>`, Aiven ids) are **not** real company data. Copy the real mapping from a **private internal doc** or a **local untracked** file (`~/.cursor/mcp.json`, `.env.local`). Never commit real hosts, tokens, API keys, or credentials.

At runtime, resolve hosts, project path, topics, and API keys from that local config or environment variables. Do not hardcode company values again. Never echo tokens, never commit `mcp.json` secrets, never print OTP or `access_token`.

After editing, restart Cursor or reload MCP servers. If a server is disconnected, fix it before `qa-feedback` / `qa-tester`. If Aiven MCP is blocked by org policy, `qa-tester` falls back to the same `AIVEN_TOKEN` via `curl` — see [qa-tester/reference.md](qa-tester/reference.md).

## Skills

| Skill                                           | Invoke (examples)                            | Output                                                                                       |
| ----------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`qa-test-strategy`](qa-test-strategy/SKILL.md) | `execute qa-strategy skill on , Jira URL     | Updates **Testing Strategy** panel on ticket **description**                                 |
| [`qa-feedback`](qa-feedback/SKILL.md)           | `qa feedback CHR-1234`, Jira URL             | **Jira comment** — Quick feedback of a ticket checking ACs, test gaps, pipeline (no browser) |
| [`qa-code-review`](qa-code-review/SKILL.md)     | `code review <GitLab MR URL>`                | Feedback in the chat with comments for code made by QAs (E2E, accessibility, pact tests)     |
| [`qa-tester`](qa-tester/SKILL.md)               | `qa tester CHR-1234 on staging,qa,localhost` | Manual run + screenshots (evidences); **Jira comment** if all ACs pass                       |

## Typical order

1. **qa-test-strategy** — plan UT / IT / E2E / QA Manual checklist on the ticket.
2. Dev + MR.
3. **qa-feedback** — early review of implementation and specs.
4. **qa-code-review** — review test changes in the MR.
5. **qa-tester** — sign-off on deployed env (after URL is ready).

`qa-feedback` and `qa-tester` are different: feedback = code/specs; tester = live app.

## Flags (optional)

Pass in the **same chat message** as the ticket (not CLI / `pnpm`). The agent reads them once and does not ask again.

### `qa-test-strategy`

| Flag               | Effect                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `--mr=<iid>`       | GitLab MR number when Jira has no MR link — used to scan the diff                                   |
| `--no-jira-update` | Draft + preview in chat only; does **not** update the ticket description                            |
| `--apply`          | Writes the Testing Strategy to Jira after the preview, without waiting for `ok` / `yes` / `go ahead` |
| `--no-e2e`         | Forces **E2E → Not applicable.** (unless already fully covered)                                     |
| `--no-a11y`        | Forces **Accessibility → Not applicable.** (unless already fully covered)                           |

Examples: `QA test strategy CHR-1289 --no-jira-update` · `testing strategy CHR-2911 --mr=4500 --apply` · `test plan CHR-1234 --no-e2e --no-a11y`

### `qa-tester`

| Flag | Effect |
|------|--------|
| `--no-jira-video` | Upload screenshots to Jira; skip the evidence video |
| `--no-jira-evidence` | Keep evidence local only; do not upload to Jira |

Examples: `qa tester CHR-1289 on staging` · `qa test CHR-1289 --no-jira-video`

## Evidence

`qa-tester` writes a generic `qa-plan.json`, runs [run-qa-plan.sh](qa-tester/scripts/run-qa-plan.sh) (video + screenshots in one pass), falls back to browser MCP for exploratory or failed scenarios, then uploads evidence to Jira by default.
