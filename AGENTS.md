# Herestory agent rules

## Purpose

This repository is a Bilt-generated Expo / React Native mobile application. GitHub
is the source of truth for code. Bilt should sync from the default branch after a
pull request has been reviewed and merged.

## Overnight-task policy

1. Work on exactly one GitHub issue labelled `agent:ready` at a time. Choose the
   highest-priority issue that has no open dependency.
2. Create a dedicated branch named `agent/<issue-number>-<short-slug>`. Never
   work directly on `main`.
3. Stay within the issue's acceptance criteria. Do not refactor unrelated code,
   change dependencies without explaining why, or invent product requirements.
4. Do not make destructive data changes, publish a release, modify secrets,
   change GitHub/Bilt settings, or merge a pull request.
5. Before committing, run the relevant checks. At minimum run `npm run lint`,
   `npm run lint:css`, `npm run format:check`, and `npm run export:web`; use
   `npx expo start` or an emulator when the issue changes UI or app behavior.
   If any check or build fails, find and fix the cause before opening the pull
   request. Do not treat a failed build as complete work.
6. Commit the completed work, push the branch, and open a pull request that
   links the issue. Mark the issue `agent:review` only after all required checks
   pass.
7. If blocked, do not guess. Leave a concise comment describing the blocker,
   remove `agent:ready`, add `agent:blocked`, and stop. The next task may then
   be selected.

## Definition of done

An overnight task is done only when the acceptance criteria are met, the required
checks pass, the changes are committed and pushed, and a pull request explains
what changed, how it was tested, and any follow-up needed.

## Project commands

```sh
npm install
npm run lint
npm run lint:css
npm run format:check
npm run export:web
npx expo start
```

Do not run `npm run format` unless the issue explicitly requires formatting;
it rewrites files and can make a review noisy.
