# Learning Companion

A private, chat-controlled learning record and shared workspace. ChatGPT teaches and operates the tools; the companion has three destinations: **Today, Learning, History**.

This repository contains an implemented product with persistent storage and MCP tools, not a separate chatbot. Read [verification](docs/verification.md) before treating a client surface or acceptance scenario as verified. The full intended outcomes are in [PRD.md](PRD.md).

## Use

Open [the private app](https://learning-companion.copperplume66.chatgpt.site), sign in with ChatGPT, and choose a synthetic lesson or introduce a course. In **Account & privacy**, or the native permission form where supported, authorize routine tutor updates and optionally bounded preparation. The tutor cannot grant itself those permissions.

Open [the provisioned plugin](https://chatgpt.com/plugins/plugin_asdk_app_sites_8a72aebe3f5c8191862ff1bd770e422b). Connect it from **Plugins → Personal → Created by you**. In a fresh chat, ask: “Read Learning Companion’s capabilities and resume my saved session.” Use the learning tools to create sources, configure activities, submit actual learner responses, correct grades, change plans, and retrieve exact checkpoints. A standalone website is optional after initial identity/consent setup.

The same account, activity ID, and version identify the working object in every surface. Scratch changes and submissions are separate. The UI reports durable saves independently from host message delivery.

## Development

Requires Node 22.13+ and npm. No AI API key is required: ChatGPT supplies tutoring; deterministic validators never pretend to semantically grade proofs or essays.

```sh
npm ci
npm run db:generate # only after a schema change; do not regenerate applied migrations
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_equal_photon.sql
npm run dev -- --port 5180
npm run check
npm test
```

Apply each local migration once. The local preview sign-in is a synthetic identity and is absent from production. Hosted identity and OAuth are supplied by Sites dispatch. Do not expose the development server publicly or trust user-provided identity headers outside that gateway.

Publishing uses the Sites plugin’s source helper and exact pushed build archive. `.openai/hosting.json` declares D1, R2, and MCP. The public GitHub repository contains source code; runtime databases and private attachments are separate.

## Architecture and limits

- Tutor Engine: private imported policy sections, declared authority, examples, evidence labels, and traced scope decisions.
- Learner Profile: explicit preferences and cautiously supported observations; no topic mastery or temporary overload labels.
- Topic Model: derived skill evidence across retrieve, explain, apply, discriminate, transfer, generate, and independence. Retention is separate.
- Conversation State: versioned activities, selections, drafts, hints, exact checkpoints, and unresolved actions.

D1 atomically replaces each owner’s aggregate with optimistic concurrency checks. Conflicting edits fail clearly; independent edits are reapplied against current state. Retry receipts prevent duplicate writes. Permanent deletion scrubs related records and cached results, retaining non-content tombstones to prevent automatic restoration. Account aggregates currently have a 2 MB bound and individual text records a 300 KB bound.

Fourteen reusable workspace families cover graphs, arrays/heaps, trees, pointers, recursion, tables, proofs, code, source study, recall, concept exploration, writing, language composition, and practice cards. The JavaScript runner uses an isolated browser worker, blocks network access, and terminates after one second; it is not a server-verified grader or a general Python runtime.

Background preparation is a bounded Worker task (25 seconds, no external spend), with durable status/output and revocation checks. It uses inspected source text to prepare prompts and notes; it does not invent validated answer keys or learning evidence. Arbitrary unattended ChatGPT turns, push notifications, and recurring reminders are not claimed.

## Privacy and licensing

Private tutoring inputs live only in ignored `.private/` locally or authorized private runtime records. Never commit profiles, transcripts, grades, credentials, raw testing receipts, or complete private attachments. Run `python3 scripts/audit-public.py` before every commit and review staged content manually.

No open-source license for newly authored project code has been selected by the owner. See [LICENSE](LICENSE). Third-party dependencies and retained starter files keep their respective licenses. Public visibility is not a license grant.
