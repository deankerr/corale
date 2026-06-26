# corale

Multi-modal AI content platform — chat, images, audio, and text under one interface, with an early take on **LLM artifacts**: rendering the HTML and SVG that models produce, sandboxed, directly in the conversation.

> Status: parked, and frozen mid-way through a UI transition (see below). It works, but it is not actively developed. Commits after March 2025 are dependency/CVE maintenance only.

## What it does

Conversations are threaded, and any message can trigger a generation run: text and speech through LLM/TTS providers, images through fal.ai. Outputs are tracked, organised into collections, and produced via reusable **patterns** that parameterise a run.

The most interesting part is the artifact rendering. When a model returns a fenced HTML, SVG, or Mermaid code block, the UI can open it as a live artifact instead of printing the source:

- **HTML** renders in a sandboxed iframe (`sandbox="allow-scripts"`, `referrerPolicy="no-referrer"`, a CSP, and script/style relocation into the body). Errors thrown inside the frame are caught there and surfaced back to the host via `postMessage`. See [`HTMLRenderer.tsx`](apps/web/components/artifacts/HTMLRenderer.tsx).
- **SVG** and **Mermaid** render through their own dispatched renderers, all wrapped in an error boundary. See [`ArtifactRenderer.tsx`](apps/web/components/artifacts/ArtifactRenderer.tsx).
- Extraction is automatic: any code block in a response gets a "save as artifact" affordance, and the HTML `<title>` is pulled out for naming. See [`Pre.tsx`](apps/web/components/markdown/Pre.tsx).

The artifact work began in November 2024, roughly five months after Anthropic popularised Artifacts — early for a self-hosted renderer.

## Architecture

A Turborepo monorepo. Next.js frontend on Vercel; [Convex](https://convex.dev) for the backend, database, file storage, and scheduling.

| Workspace | Role |
|---|---|
| `apps/web` | Next.js frontend — chat, artifacts, image gallery, patterns, collections. Radix UI + Tailwind CSS, Jotai for artifact state |
| `apps/backend` | Convex backend — per-entity schema modules (`convex/entities/`), provider integrations (fal.ai, LLM/TTS) |
| `packages/shared` | Shared types, parsing utilities (the HTML/SVG/code parsing the renderers rely on), constants |
| `packages/ui` | Radix-based component library |
| `packages/config-*` | Shared ESLint / TypeScript config |

The backend is Convex-native throughout — mutations, queries, actions, and crons — with entities defined via `convex-ents` (edges, indexes, scheduled deletion). Images are stored in Convex file storage with blur placeholders and separate metadata.

## The dual-UI state

The app is frozen part-way through a migration between two UIs, which is why two route groups coexist in `apps/web/app`:

- `(main)` — the original shell: chats, drawings, patterns, admin, audio, prompts, generations, collections.
- `(preview)` — the new direction, where artifacts became a headline feature and "drawings" were being renamed to "artifacts".

Both still run. Picking this up again would mean committing to `(preview)` and removing `(main)`.

## Stack

TypeScript throughout. Next.js, React, Tailwind CSS, Radix UI, Jotai. Convex for backend and database. Tooling is pnpm + Turborepo.

## Development

```bash
pnpm install
pnpm dev        # turbo dev across web + backend
```

Other tasks: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (all run through Turborepo). Requires Convex and provider credentials to be configured.
