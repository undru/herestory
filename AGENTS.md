# Herestory agent rules

## Purpose

This repository is a Bilt-generated Expo / React Native mobile application. GitHub
is the source of truth for code, and all work lands directly on `main`. Bilt syncs
from `main` and may push its own commits there, so always rebase onto the latest
`main` before pushing.

When processing GitHub issues, follow `WORKFLOW.md` step by step.

## Agent policy

1. Work on exactly one issue at a time. Commit directly to `main`; do not create
   branches or pull requests.
2. Stay within the issue's acceptance criteria. Do not refactor unrelated code,
   change dependencies without explaining why in the commit and issue comment,
   or invent product requirements.
3. Never push code that fails the required checks, and never skip them
   (`--no-verify`, disabling lint rules, deleting tests) just to finish.
4. Never force-push, rewrite published history, or `git reset --hard` over
   commits that are on `origin/main`. To undo shipped work, use `git revert`.
5. Never discard changes you did not make. If the working tree is dirty when a
   run starts, stop and report it.
6. Do not make destructive data changes, publish a release, modify secrets, or
   change GitHub, Pages, or Bilt settings.
7. If blocked, do not guess. Comment with the concrete blocker, label the issue
   `agent:blocked`, and continue with the next independent ready issue.

## Required checks

Run all of these before every push and fix the cause of any failure:

```sh
npm run lint
npm run lint:css
npm run format:check
npm run export:web
```

Lint warnings that already exist are acceptable; new errors are not. When the
issue changes UI or behavior and an emulator or simulator is available, also try
the affected flow with `npx expo start`, and mention in the issue comment whether
you did.

## Definition of done

An issue is done only when its acceptance criteria are met, the required checks
pass locally, the commit is on `origin/main`, **Verify app** passed for that
commit, and the issue has a comment explaining what changed, how it was tested,
and any follow-up needed.

## Project commands

```sh
npm ci
npm run lint
npm run lint:css
npm run format:check
npm run export:web
npx expo start
```

Do not run `npm run format` unless the issue explicitly requires formatting;
it rewrites files and makes the history noisy.
