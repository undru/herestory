---
description: Work through agent:ready GitHub issues and commit each to main
argument-hint: '[issue number]'
---

Follow `WORKFLOW.md` exactly, applying every rule in `AGENTS.md`.

If an issue number was given ($ARGUMENTS), work only that issue, and only if it
is open and labelled `agent:ready`. Otherwise process the whole `agent:ready`
queue one issue at a time until it is empty or `max_tasks_per_run` is reached.

Run unattended: nobody is watching, so do not stop to ask questions. Block unclear
issues with a comment instead. Finish with the end-of-run summary.
