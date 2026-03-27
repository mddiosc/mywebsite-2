---
title: 'SDD in practice with OpenSpec: from idea to PR without losing context'
description: 'Hands-on lessons from applying Spec-Driven Development with OpenSpec in a React project: proposal, tasks, validation, CI, merge, and archive.'
date: '2026-03-27'
tags: ['sdd', 'openspec', 'spec-driven-development', 'react', 'workflow', 'testing', 'ci-cd']
author: 'Miguel Angel de Dios'
slug: 'sdd-openspec-spec-driven-development'
featured: false
---

## Why write about this now

In the last few weeks I applied **Spec-Driven Development (SDD)** with OpenSpec on real portfolio changes. This was not theory: real PRs, failing checks, scope decisions, and full cycle closure (including archive).

This post summarizes what worked best, what broke along the way, and how to tune the process to ship faster with less rework.

---

## What SDD is (without buzzwords)

For me, SDD is this:

1. Define **which problem we are solving**.
2. Turn it into **verifiable requirements**.
3. Break it down into **executable tasks**.
4. Implement with short feedback loops (tests + CI).
5. Close with traceability (PR + change archive).

It does not replace coding. It makes delivery more predictable.

---

## The OpenSpec workflow we used

A typical change looked like this:

1. `proposal.md` for scope and motivation.
2. `design.md` for technical decisions.
3. `spec.md` for requirements and scenarios.
4. `tasks.md` as operational checklist.
5. `feat/...` branch, implementation, and validation.
6. Merge to `main`.
7. `openspec archive <change>` to move the change to history and sync the main spec.

The key part: **do not move by intuition** when scope is unclear. Fix spec/tasks first, then code.

---

## Real case: i18n SEO (canonical + hreflang)

One recent change aligned SEO metadata for bilingual routes:

- Canonical per locale.
- Alternate links for `es`, `en`, and `x-default`.
- 404 as non-indexable (`noindex, nofollow`).
- Deterministic URL normalization (no malformed slashes).

### What we learned in practice

- A shared SEO URL helper avoids route-by-route drift.
- If you do not test `x-default` on slug routes, it will break sooner or later.
- In metadata tests, never assume env vars exist in CI.

That last one hit us: local was green, CI failed because `VITE_SITE_URL` was undefined. Fix was to stub env in test setup.

---

## Why tasks.md mattered so much

`tasks.md` became the operational contract for the change.

Concrete benefits:

- Prevents delivery omissions (`commit`, `push`, `PR`).
- Makes asynchronous review state explicit.
- Helps recover context after interruptions.
- Exposes when code is done but process is not.

One practical detail: mark delivery tasks at the very end, otherwise the change looks incomplete even if the PR exists.

---

## CI, quality, and useful friction

Alongside feature work, we reinforced guardrails:

- Strict performance budget in CI.
- Lighthouse CI across multiple routes/locales.
- GitHub Actions runtime adjustments to reduce deprecation noise.

The takeaway: **automated quality does not replace judgment, but it enforces it where it matters**.

When a PR fails, the right question is not "how do I bypass this", but "which gap in spec or tests did this reveal".

---

## Where SDD helps the most (in my experience)

SDD shines when:

- change impact is cross-cutting (multiple routes/pages),
- business rules are easy to forget,
- or long-term maintainability is a goal.

For tiny one-off edits, it can feel heavy. In those cases, keep process lightweight instead of turning it into bureaucracy.

---

## Minimal checklist I am keeping for future changes

Before opening a PR:

1. Do requirements and scenarios still match implementation?
2. Is `tasks.md` truly up to date?
3. Do tests cover happy path + main edge case?
4. Does CI validate what we promised (not just build success)?
5. Is closure ready (merge + archive)?

If any answer is "no", it is not done yet.

---

## Closing thought

OpenSpec + SDD did not slow me down. It helped me **iterate with fewer surprises**.

Less context loss.
Fewer last-minute "we forgot this" moments.
Better traceability from decision to outcome.

If you are using coding assistants, this approach helps even more: agents can execute faster when the decision framework is explicit.

---

If you want, in a follow-up post I can share a practical `proposal/design/spec/tasks` starter template for small and medium frontend changes.
