# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Founders at idea stage: non-technical or semi-technical people with a rough SaaS idea who need an architecture and tech stack they can understand and hand to a developer. They arrive with a one-line idea, not a spec, and may not know the vocabulary (CDN, queue, auth provider).

## Product Purpose

Turns a one-line SaaS idea plus a short requirements questionnaire into an architecture diagram (typed components with connections), a tech stack with a reason per choice, and a plain-language explanation of how the pieces work together. Success is a founder leaving with something they can explain to a developer or investor.

## Positioning

Fully client-side with a bring-your-own OpenRouter API key: no account, no server, the key lives in browser memory only. The product is architecture plus tech stack, not code generation.

## Operating Context

Single linear flow: API key, idea, six requirements questions (any can be delegated to the AI via "Let AI decide"), then one results screen with an interactive, draggable diagram, per-component descriptions, tech stack grouped by category, a workflow explanation, and architecture stats. Generation makes three to four sequential model calls (workflow, tech stack, explanation, batched component descriptions) through OpenRouter, default model `openai/gpt-4o-mini`; failures fall back to templated content.

## Capabilities and Constraints

- Stack is fixed: React 18, TypeScript, Vite, Tailwind, Radix/shadcn primitives, lucide-react. Existing codebase; no framework change.
- Component types the model may emit: frontend, backend, database, api, auth, payment, storage, cache, cdn, notification, analytics, monitoring.
- Requirements questions: audience, core features, authentication, payments, scale, integrations.
- Code generation is out of scope. The landing claim and the unwired `CodeGeneration.tsx` are to be removed.
- Scope of this redesign (confirmed): full visual redesign of every screen and component, plus removal of fake or placeholder content (random node statuses, "Validated/Ready" pills, canned summary prose, debug counters) and dead code. Data flow and AI prompts stay as they are.
- Undecided: whether the API key should persist across reloads (currently memory-only).

## Brand Commitments

Name: SaaS Architect Genesis (the landing screen heading currently reads "SaaS Architect"). No logo or voice commitments beyond the favicon in `public/`.

## Evidence on Hand

No testimonials, customers, usage numbers or demo link exist ("Live Demo: Coming Soon" in README). Future work must not fabricate any.

## Product Principles

- Honest output: show only what the model produced or the user entered; never invented status, validation or readiness.
- Plain language first: a founder should understand every label without knowing the jargon; technical terms get a short gloss.
- The diagram and the reasons are the product; everything else supports reading them.
- Trust through restraint: the user pastes a paid API key, so the key step must feel clear and safe, not decorative.

## Accessibility & Inclusion

No product-specific requirement established. Baseline: keyboard-operable controls (the diagram is currently mouse-only) and readable contrast.
