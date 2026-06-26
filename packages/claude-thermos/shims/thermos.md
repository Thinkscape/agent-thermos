---
description: Run deep correctness/security and strict code-quality reviews of the current branch.
argument-hint: [base-ref | PR URL | scope]
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git show:*), Bash(git rev-parse:*), Bash(gh pr view:*), Bash(glab mr view:*)
---

# Thermos

Usage: `/thermos [base-ref | PR URL | scope]`

Run a double thermo review for the requested scope. If no scope is provided, review the current branch against `main`.

## Method

1. Determine the base ref, PR URL, or explicit file scope from `$ARGUMENTS`.
2. Gather `git diff <base>...HEAD`, changed-file paths, and enough file contents for reviewers to verify claims.
3. Launch both subagents in parallel:
   - `thermos:thermo-nuclear-review-subagent`
   - `thermos:thermo-nuclear-code-quality-review-subagent`
4. Pass both agents the same labeled context:
   - `### Git / diff output`
   - `### Changed file contents`
   - `### User scope / intent`
5. Synthesize with findings first, deduped across reviewers. Keep the summary brief.

If the plugin-scoped agents are unavailable, run the same two review passes with general-purpose subagents using the rubrics embedded in this command package.
