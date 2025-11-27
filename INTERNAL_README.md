# How to Use This Repository

This repository is designed as a personal AI Prompt Engineering workspace. It contains reusable prompt templates, examples, and structured instructions to accelerate QA, development tasks, documentation writing, and automation workflows.

---

## 📂 Repository Structure

```
prompts/
  qa/         → Prompts for Gherkin, E2E, Jira, API testing
  dev/        → Prompts for coding, refactoring, PR review
  data/       → Prompts for JSON diff, logs, parsing, repairs
  general/    → System prompts, reasoning patterns, templates

examples/
  results-service/ → Real-world examples using prompts

agent-instructions/
  jira-agent/      → Instructions for Jira ticket automation

README.md          → Public-facing description
INTERNAL_README.md → This document
```

---

## 🚀 Purpose of This Repository

This repo aims to:

- Centralize your high-quality prompts.
- Provide consistency across all AI-assisted tasks.
- Allow reuse of the same prompt templates across models (GPT, Claude, Llama).
- Document real examples for debugging, testing, and automation.
- Serve as a portfolio of your AI-driven QA and engineering practices.

---

## 🧠 How to Use the Prompts

### 1. **Do NOT modify the prompt templates**
The files inside `prompts/` are **static templates**.  
They are *not* meant to store actual Acceptance Criteria, JSON, logs, or Jira content.

### 2. **Copy and paste into your AI assistant**
When you need to use a prompt:

1. Open the template file (e.g., `prompts/qa/generate-gherkin-from-ac.md`)
2. Copy the entire prompt
3. Paste it into ChatGPT, Claude, Minerva, or Pepe
4. Under the prompt, paste your real input (AC, JSON, logs, Jira request, etc.)
5. Run it and collect the output

Nothing in the repo changes during usage.

---

## 📝 Adding New Prompts

When you want to add a new prompt:

1. Create a new `.md` file inside the appropriate folder (qa, dev, data, general)
2. Use clear naming, e.g.:
   - `generate-mongo-query.md`
   - `refactor-cypress-test.md`
   - `audit-results-json.md`
3. Make sure the file contains:
   - Purpose
   - Instructions
   - Input format
   - Output format
   - Optional example

Avoid adding real data inside these files.

---

## 📘 Adding Examples

If you want to store real inputs/outputs, place them in:

```
examples/<topic>/
```

Each example should follow:

```
# Input
<your real AC / JSON / request>

# Output (AI Generated)
<generated test cases or explanations>

# Notes
<comments, model used, improvements>
```

This keeps templates and real data separated and clean.

---

## 🤖 Agent Instructions

If you build AI agents (like your Jira ticket generator):

Store their system instructions inside:

```
agent-instructions/<agent-name>/
```

Each folder may contain:

- `system.md` → The system instructions
- `examples.md` → Examples of how the agent behaves
- `notes.md` → Improvements, limitations, future ideas

This ensures you can version, document, and upgrade agents safely.

---

## 🧹 Maintenance Guidelines

- Keep templates minimal and clean
- No real secrets, tokens, or internal URLs
- No output copied into the template folder
- Use English for all files (for consistency and sharability)
- Update README files when adding new large features

---

## 🎯 Final Advice

Think of this repository as:  
**Your personal AI toolkit.**

You’re building a library of:

- Prompts  
- Patterns  
- Agents  
- Examples  

All reusable, structured, and ready for future automation.

This repo will grow with your skills — treat it as a long-term asset.
