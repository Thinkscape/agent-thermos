---
name: thermos
description: Guidance for running the Thermos double review workflow in Claude Code.
disable-model-invocation: true
---

# Thermos

Prefer `/thermos:run` for the plugin command. If the optional standalone shim is installed, `/thermos` runs the same workflow.

Run the deep correctness/security pass and the strict code-quality pass over the same diff context, then synthesize prioritized, deduped findings.
