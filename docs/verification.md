# Verification and remaining requirements

## Evidence levels

Domain/protocol tests exercise durable state semantics and MCP responses. Browser checks exercise actual controls and local D1 persistence. A real connected ChatGPT tool call, rendered host surface, or delivered message requires its own evidence. They are not interchangeable.

The test suite names every baseline scenario B01–B23 and expanded scenario E01–E28 in PRD order. Several tests establish only the underlying contract; they do **not** certify the full user outcome, live teaching quality, usability timing, or native presentation. Full acceptance remains open until those end-to-end checks pass.

## Current checks

- Production build and TypeScript checks: passed during implementation.
- 56 domain/protocol tests: passed, including corrections, assistance, checkpoint data, retry keys, concurrency, private policy separation, background outputs, and permission refusal.
- Local D1 browser journey: course/source/outline creation, graph selection, actual weighted-distance transition, submission persistence, and session checkpoint exercised.
- Code execution browser check identified an escaping defect; repair and repeat pending.
- Real provisioned plugin tool calls and richer host surfaces: awaiting deployment/connection verification.

## Supported-client status

| Surface | Implementation | Verification |
|---|---|---|
| Desktop browser viewer | Today/Learning/History, source reader, workspaces, privacy | Local browser exercised; further matrix checks pending |
| Mobile browser viewer | Responsive layouts and keyboard/text alternatives | Not yet exercised on physical mobile |
| MCP read/write, text-only lessons | Complete generic owned-record control plus evidence/checkpoint/job actions | Protocol tests; actual connected call pending |
| In-chat mini-app | Self-contained MCP Apps UI and two-way messages | Actual host rendering/delivery pending |
| Fullscreen | `ui/request-display-mode`, same server activity | Host test pending |
| Sidebar/panel | Global/thread entrypoint declarations | Host test pending |
| Custom file editor | `.lcnotes`, `.lcactivity`, host read/write/ETag | Host test pending |
| Composer references | Mention search, resource reads, removable selected context | Host test pending |
| iOS/Android ChatGPT | Capability detection, data-tool equivalent | Not tested; no native-support claim |

## Genuine platform/integration boundaries and product gaps

The available Sites tool catalog does not expose `list_plugin_eligibility`; no external connector IDs, visitor grants, or write permissions have been invented. GitHub/Google learning-resource integration is therefore **not implemented as a direct hosted connector**. A separately authorized connected tutor can import inspected content and provenance through data tools, but that does not verify provider synchronization or external writes. These PRD outcomes remain open.

Only text/Markdown/CSV/JSON source uploads and structured text activities are currently implemented. Original PDF/image/handwriting ingestion, audio recording/playback, robust OCR, native Word export, and rich file formats remain requirements. Browser printing supplies a printable PDF route; it is not a dedicated PDF authoring service.

Source-aligned preparation is deterministic extraction, not automatic generation/validation of arbitrary course-level assessments. Fresh full retests, cumulative checks, plan changes, and evidence-linked sheets are tutor-operated through tools; autonomous pedagogical quality requires real-chat evaluation. Scheduled notifications and ongoing jobs beyond the bounded runtime need a separately verified scheduler. No closed conversation is promised an automatic assistant turn.

Sharing requests create explicitly approved scoped records with revocation, but a public/shared snapshot delivery channel is not yet provided. No private content is published by those requests. Account transfer, robust large-library storage, robust abuse/rate limiting, and a multi-user operational security review remain requirements.
