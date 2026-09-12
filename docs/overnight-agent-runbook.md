# Overnight agent runbook

## Safety model

The agent may create a branch, commit, push, and open a pull request. It may not
merge, release, change Bilt settings, change secrets, or make production-data
changes. You review and merge pull requests in the morning.

This gives Bilt a stable branch to sync: only merged changes reach `main`.

## One-time GitHub setup

1. In the repository, create these labels:
   - `agent:ready` — safe and fully specified work the agent can pick up.
   - `agent:review` — a pull request is ready for your review.
   - `agent:blocked` — an agent needs a decision or missing access.
2. Create a GitHub Project with columns: **Backlog**, **Ready**, **In progress**,
   **Needs review**, **Blocked**, and **Done**.
3. Use the **Agent task** issue template for every task intended for the agent.
   Do not add `agent:ready` until its acceptance criteria and verification steps
   are complete.
4. Protect `main`: require pull requests and the **Verify app** status check;
   do not allow direct pushes. If you use Bilt two-way sync, verify that Bilt
   writes through pull requests or to a non-protected integration branch.
5. In **Settings → Pages**, choose **GitHub Actions** as the publishing source.
   After the first successful deployment, the shareable web preview will be
   `https://undru.github.io/herestory/`.

## Nightly routine

1. Add at most three independent, well-defined issues with `agent:ready`.
2. Start your Codex automation or orchestration runner with this repository as
   its workspace and `WORKFLOW.md` as its task policy.
3. Keep it to one concurrent task. The runner should select a ready issue, then
   follow `AGENTS.md`.
4. In the morning, review each pull request, run the app if needed, and merge
   only the changes you approve. GitHub then verifies, builds, and deploys the
   web preview automatically. The **Deploy web preview** workflow shows the
   deployed URL; share that link after it succeeds.
5. If **Verify app** or **Deploy web preview** fails, do not share the preview.
   Reopen or create an `agent:ready` bug issue with the workflow error, then let
   the agent fix it in a new pull request.

## Prompt for an agent automation

```text
Read AGENTS.md and WORKFLOW.md. Process up to three independent GitHub issues
labelled agent:ready, one at a time, in priority order. For each, create a branch,
implement only its acceptance criteria, run the required validation including
`npm run export:web`, review your diff, commit, push, and open a PR. Fix any
build failure before opening a PR. Do not merge, deploy, alter secrets, change
Bilt/GitHub settings, or continue past an ambiguous or blocked task. Mark blocked
tasks clearly and then proceed only to an independent ready task.
```

## Bilt sync rule

Use GitHub's default branch as the code Bilt sees. Do local or agent work in
branches and merge it only after review. Avoid editing the same feature in Bilt
while an agent has an open PR for it; otherwise the merge can conflict.
