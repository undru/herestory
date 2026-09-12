---
tracker: github-issues
ready_label: 'agent:ready'
review_label: 'agent:review'
blocked_label: 'agent:blocked'
max_concurrent_tasks: 1
max_tasks_per_run: 3
---

# Overnight agent workflow

At the start of a run, find GitHub issues labelled `agent:ready`, ordered by
priority. Work on one issue at a time and follow `AGENTS.md`.

For each selected issue:

1. Confirm its scope and acceptance criteria are specific enough to test.
2. Move it to **In progress** and create an isolated branch.
3. Implement only that issue. Run relevant validation and test the affected UI
   on an emulator when possible.
4. Review the diff for accidental changes, missing error states, and regressions.
5. Commit, push, and open a pull request. Include a short test report.
6. Move the issue to **Needs review**. Do not merge it.

If an issue is ambiguous, depends on an unfinished task, fails validation after
reasonable attempts, needs credentials, or would change production data, mark it
**Blocked**, explain why, and proceed to the next independent ready issue.

Stop after three pull requests in one overnight run, or sooner if the queue is
empty. Never bypass a failing check merely to finish a task.
