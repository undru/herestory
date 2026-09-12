---
tracker: github-issues
trigger: manual
branch: main
ready_label: 'agent:ready'
in_progress_label: 'agent:in-progress'
blocked_label: 'agent:blocked'
max_concurrent_tasks: 1
max_tasks_per_run: 10
preview_url: 'https://undru.github.io/herestory/'
---

# Agent issue workflow

A run is started manually (in Claude Code: `/work-issues`). It works through the
`agent:ready` queue one issue at a time and commits each finished issue directly
to `main`. Follow `AGENTS.md` for every rule referenced here.

## 1. Start of run

1. `git status` must show a clean working tree on `main`. If it does not, stop
   the run and report the uncommitted files. Never stash, reset, or discard them.
2. `git pull --rebase origin main`, then `npm ci` if `package-lock.json` changed.
3. Leftovers: any open issue still labelled `agent:in-progress` belongs to a run
   that did not finish. Comment that the previous run stopped, swap the label to
   `agent:blocked`, and leave it for the owner.

## 2. Pick the next issue

```sh
gh issue list --state open --label agent:ready --json number,title,body,createdAt
```

Order by the **Priority** field in the issue body (`P0` first; missing = `P2`),
then oldest first. Skip an issue whose **Depends on** field names an issue that
is still open. If nothing is left, end the run.

## 3. Work the issue

1. Read the issue and its comments. If the outcome, acceptance criteria, or
   verification are too vague to test, block it (section 5).
2. Claim it: remove `agent:ready`, add `agent:in-progress`.
3. Implement only that issue's acceptance criteria.
4. Run the required checks from `AGENTS.md`. Fix failures and rerun until all
   pass. After three honest attempts that still fail, revert your working-tree
   changes for this issue only and block it.
5. Review `git diff`: no unrelated edits, debug code, or missing error/empty
   states.

## 4. Ship to main

1. Commit with `<type>: <summary> (#<issue>)` and a body line
   `Closes #<issue>`.
2. `git pull --rebase origin main`. If upstream brought changes, rerun the
   required checks. If the rebase conflicts and the resolution is not obvious,
   `git rebase --abort`, reset nothing, and block the issue.
3. `git push origin main`.
4. Wait for CI on the pushed commit:
   ```sh
   gh run list --workflow "Verify app" --commit "$(git rev-parse HEAD)" --json databaseId
   gh run watch <id> --exit-status
   ```
5. If **Verify app** fails on `main`, fix forward with another commit for the
   same issue. If it still fails after two fix attempts, `git revert` the issue's
   commits, push, block the issue, and end the run.
6. When it passes, comment on the issue: what changed, how it was verified
   (checks run, anything tested manually), the commit SHA, and the preview URL.
   Remove `agent:in-progress`. Close the issue if the commit did not close it.

Then return to section 2, until the queue is empty or `max_tasks_per_run` issues
have been shipped.

## 5. Blocking an issue

Block when an issue is ambiguous, depends on unfinished work, needs credentials
or a product/design decision, would change production data, or cannot pass
validation. Do not guess. Comment with the specific question or failure, set the
label to `agent:blocked` (removing `agent:ready` / `agent:in-progress`), discard
only your own uncommitted changes for that issue, and move on to the next issue.

## 6. End of run

Print a short summary: issues shipped (with commit SHAs), issues blocked (with
the reason), and whether the last **Verify app** and **Deploy web preview** runs
on `main` passed.
