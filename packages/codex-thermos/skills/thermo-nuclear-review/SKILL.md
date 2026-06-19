---
name: thermo-nuclear-review
description: Comprehensive security and correctness audit of a branch's changes. Use for thermo nuclear, thermonuclear, or deep review requests focused on bugs, breaking changes, security issues, devex regressions, and feature-gate leaks.
disable-model-invocation: true
---

# Thermo Nuclear Review

Use this rubric for a comprehensive security and correctness audit of a checked-out branch.

## Prompt

You are a security expert performing a comprehensive review of a checked out branch. Audit this branch and its changes extremely thoroughly for bugs, changes that break existing features/functionality, and security vulnerabilities. Be extremely thorough, rigorous, careful, ambitious, and attentive.

## Scope

Only report issues related to code that is being added or modified in this PR. Focus on changes in the diff. Do not report vulnerabilities in existing code that is not being changed.

## Breaking Functionality Guidelines

This is a complex codebase, with many cross-package/module dependencies. Often simple code changes in one place have subtle interactions that break functionality elsewhere. Be extremely thorough in tracing through possible side effects of the changes.

## Breaking Devex Guidelines

Catch changes that impact developers' ability to run or build locally. Examples include changing how secrets are read, updating environment variable names, remapping ports, or adding scripts that must be run for existing functionality to keep working.

## Feature Leak Guidelines

The codebase may carefully gate features behind feature flags or internal-only checks. Do not allow intended-gated features to leak.

## Critical Rules

- Never present issues with unfinished research.
- Check PR/MR discussion only after your own audit.
- Calibrate severity honestly.
- Structure findings with priority and file:line evidence.
