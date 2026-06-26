---
name: thermos
description: Launch both thermo-nuclear review passes, then synthesize findings. Use for $thermos, thermos, double thermo review, or combined bug/security and code-quality branch audits.
disable-model-invocation: true
---

# Thermos

Explicit invocation: `$thermos [base-ref | PR URL | scope]`

Run the two thermo review passes as parallel subagents when the host supports it, then synthesize their results.

## Workflow

1. Determine the review scope from the user request, PR, current branch, or relevant changed files.
2. Gather the diff and any file/context excerpts needed for reviewers to evaluate the change without guessing.
3. Launch both review passes against the same scoped context:
   - `thermo-nuclear-review-subagent` for bugs, breakages, security, devex regressions, feature-flag leaks, and other branch-audit risks. Use `references/thermo-nuclear-review.md` as its rubric.
   - `thermo-nuclear-code-quality-review-subagent` for maintainability, structure, file-size growth, spaghetti, abstractions, and codebase-health risks. Use `references/thermo-nuclear-code-quality-review.md` as its rubric.
4. Pass each reviewer the same scoped diff/file context and ask it to return prioritized findings with file references and evidence.
5. After both finish, synthesize the results with findings first, deduplicated across reviewers. Weight overlapping findings more heavily, resolve disagreements with your own judgment, and keep summaries brief.

If individual background summaries are already visible to the user, do not restate them wholesale. Surface the unified verdict, the highest-signal findings, and any remaining uncertainty.

## Codex Notes

Use Codex subagents or multi-agent tools when available. If the current Codex surface does not expose subagents, run the two passes sequentially in the main thread and keep the outputs clearly separated before synthesis.
