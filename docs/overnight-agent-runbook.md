# Overnight agent runbook

## How it works

You file issues during the day and start one agent run before bed. The agent
takes `agent:ready` issues one at a time, implements each, and commits it
directly to `main`. Every commit is gated twice:

1. The agent runs lint, CSS lint, the format check, and the web export locally
   before pushing.
2. **Verify app** runs the same checks on `main`. **Deploy web preview** starts
   only after Verify app passes, and publishes <https://undru.github.io/herestory/>.

If Verify app fails on `main`, the agent fixes it or reverts its own commit.
The agent never force-pushes, merges PRs, changes settings or secrets, or
discards work it did not make.

## One-time setup (done)

- Labels: `agent:ready`, `agent:in-progress`, `agent:blocked`.
- The repository is public and GitHub Pages publishes from GitHub Actions.
- `CLAUDE.md` loads `AGENTS.md` for Claude Code, `.claude/commands/work-issues.md`
  provides the `/work-issues` command, and `.claude/settings.json` allows the
  commands a run needs so it does not stop for permission prompts.

## Writing an issue

1. Use the **Agent task** template. Keep each issue small enough for one commit.
2. Fill in the desired outcome, acceptance criteria, priority, and verification.
   Use **Depends on** when the issue needs another issue to be finished first.
3. Add the `agent:ready` label only once the issue is complete. The agent skips
   issues without it.

## Starting a run

From the repository root, with a clean working tree on `main`:

```sh
claude --permission-mode acceptEdits "/work-issues"
```

To work on one issue only: `claude --permission-mode acceptEdits "/work-issues 12"`.
Keep the machine awake while it runs (for example `caffeinate -i` on macOS).

For another coding agent, point it at this repository and use this prompt:

```text
Read AGENTS.md and WORKFLOW.md, then follow WORKFLOW.md exactly: process the
GitHub issues labelled agent:ready one at a time in priority order, commit each
finished issue directly to main, push, wait for the Verify app workflow to pass,
and comment on the issue. Block unclear issues instead of guessing. Never
force-push, change settings or secrets, or discard changes you did not make.
```

## In the morning

1. Read the run summary, then check closed issues for the agent's comments and
   `git log` for what landed.
2. Open <https://undru.github.io/herestory/> once **Deploy web preview** has
   passed.
3. Answer the questions on `agent:blocked` issues. Relabel them `agent:ready`
   when they can be retried.
4. If a shipped change is wrong, reopen the issue with what is wrong and label it
   `agent:ready`, or ask for a `git revert` of the commit.

## Bilt sync rule

Bilt reads and writes `main`. Avoid editing a feature in Bilt while the agent is
working on an issue that touches it; the agent rebases before every push and
blocks the issue if the conflict is not obvious to resolve.
