# Gemini CLI Instructions

This repository uses a **skill-driven execution model** powered by the instructions in [AGENTS.md](AGENTS.md). 

## Core Mandate
- Refer to [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) for detailed engineering workflows and best practices.
- If a task matches a skill in the `skills/` directory, you **MUST** follow its instructions.
- Prioritize high-quality engineering: write specs before code, use TDD when appropriate, and perform security hardening.

## Available Skills
The following skills are available in the `skills/` directory:
- `spec-driven-development`: Use for defining new features.
- `planning-and-task-breakdown`: Use for breaking down complex tasks.
- `incremental-implementation`: Use for building features in small, verifiable steps.
- `test-driven-development`: Use for verifying logic with tests first.
- `debugging-and-error-recovery`: Use for systematic bug fixing.
- `code-review-and-quality`: Use for ensuring high code standards.
- ...and many others.

Refer to the individual `SKILL.md` files in `skills/<skill-name>/` for specific instructions.
