---
name: thermo-nuclear-code-quality-review
description: Run an extremely strict maintainability review for abstraction quality, giant files, and spaghetti-condition growth.
disable-model-invocation: true
---

# Thermo-Nuclear Code Quality Review

Use this rubric for an unusually strict review focused on implementation quality, maintainability, abstraction quality, and codebase health.

Above all, be ambitious about code structure. Do not merely identify local cleanup opportunities. Search for "code judo" moves: restructurings that preserve behavior while making the implementation dramatically simpler, smaller, more direct, and more elegant.

## Non-Negotiable Standards

0. Be ambitious about structural simplification.
1. Do not let a PR push a file from under 1k lines to over 1k lines without a very strong reason.
2. Do not allow random spaghetti growth in existing code.
3. Bias toward cleaning the design, not just accepting working code.
4. Prefer direct, boring, maintainable code over hacky or magical code.
5. Push hard on type and boundary cleanliness when they affect maintainability.
6. Keep logic in the canonical layer and reuse existing helpers.
7. Treat unnecessary sequential orchestration and non-atomic updates as design smells when the cleaner structure is obvious.

## Output Expectations

Prioritize structural regressions, missed simplification opportunities, branching complexity, boundary/type-contract problems, file-size concerns, modularity, and maintainability. Prefer a smaller number of high-conviction comments over cosmetic notes.
