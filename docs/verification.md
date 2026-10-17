# Verification and remaining requirements

## Evidence levels

Domain/protocol tests exercise durable state semantics and MCP responses. Browser checks exercise actual controls and local D1 persistence. A real connected ChatGPT tool call, rendered host surface, or delivered message requires its own evidence. They are not interchangeable.

The test suite names every baseline scenario B01–B23 and expanded scenario E01–E28 in PRD order. Several tests establish only the underlying contract; they do **not** certify the full user outcome, live teaching quality, usability timing, or native presentation. Full acceptance remains open until those end-to-end checks pass.

## Current checks

- Production build and TypeScript checks: passed during implementation.
- 68 domain/protocol tests: passed, including corrections, assistance, checkpoint data, retry keys, concurrency, private policy separation, background outputs, and permission refusal.
- Local D1 browser journey: course/source/outline creation, graph selection, actual weighted-distance transition, submission persistence, and session checkpoint exercised.
- Isolated JavaScript execution: browser initially caught an escaping defect; repaired runner returned actual output `8`. Prediction-output exposure is now recorded separately.
- Signed-in production viewer: owner sign-in and durable record read verified.
- Real ChatGPT test with the exact selected plugin: blocked at tool discovery. Worker evidence identified a `server/discover` response using a legacy shape; MCP 2026-07-28 response repair is implemented and awaiting a published retest. An earlier unscoped prompt selected a different existing app; that read-only result is excluded from this product’s verification. No private record contents are included here.

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

The available Sites tool catalog does not expose `list_plugin_eligibility`; no external connector IDs, visitor grants, or write permissions have been invented. GitHub/Google learning-resource integration is therefore **not implemented as a direct hosted connector**. A tutor-broker workflow is implemented (`ingest_external`, exports, and `external_receipt`) for separately connected service tools; it preserves inspected content and provider receipts without pretending that a receipt performs an external action. Provider synchronization and actual authorized external writes remain unverified.

Text/Markdown/CSV/JSON imports, original image/PDF/audio storage in private R2, image-point/page annotations, audio capture/playback controls, and OOXML Word export are implemented. Original-file tool reads and media/Word end-to-end verification remain open. Automatic OCR, PDF text extraction, pronunciation assessment, rich non-text formats, and a general Python/runtime sandbox remain requirements. Browser printing supplies a printable PDF route; it is not a dedicated PDF authoring service.

Source-aligned preparation is deterministic extraction, not automatic generation/validation of arbitrary course-level assessments. Fresh full retests, cumulative checks, plan changes, and evidence-linked sheets are tutor-operated through tools; autonomous pedagogical quality requires real-chat evaluation. Scheduled notifications and ongoing jobs beyond the bounded runtime need a separately verified scheduler. No closed conversation is promised an automatic assistant turn.

Sharing requests create explicitly approved scoped records with revocation, but a public/shared snapshot delivery channel is not yet provided. No private content is published by those requests. Account transfer, robust large-library storage, robust abuse/rate limiting, and a multi-user operational security review remain requirements.
