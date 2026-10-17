# Verification and remaining requirements

## Evidence levels

Domain/protocol tests exercise durable state semantics and MCP responses. Browser checks exercise actual controls and local D1 persistence. A real connected ChatGPT tool call, rendered host surface, or delivered message requires its own evidence. They are not interchangeable.

The test suite names every baseline scenario B01–B23 and expanded scenario E01–E28 in PRD order. Several tests establish only the underlying contract; they do **not** certify the full user outcome, live teaching quality, usability timing, or native presentation. Full acceptance remains open until those end-to-end checks pass.

## Current checks

- Production build and TypeScript checks: passed during implementation.
- 98 domain/protocol tests: passed, including corrections, assistance, checkpoint data, retry keys, concurrency, private policy separation, background outputs, and permission refusal.
- Local D1 browser journey: course/source/outline creation, graph selection, actual weighted-distance transition, submission persistence, and session checkpoint exercised.
- Isolated JavaScript execution: browser initially caught an escaping defect; repaired runner returned actual output `8`. Prediction-output exposure is now recorded separately.
- Signed-in production viewer: owner sign-in and durable record read verified.
- Real ChatGPT tests with the exact selected plugin initially found no model-visible tools. Worker evidence identified and confirmed repair of a `server/discover` response using a legacy shape. The published repair now receives successful `server/discover`, `tools/list`, and UI-resource reads.
- Native global entry point: **verified in ChatGPT web/Work**. Open plugin renders the actual Today/Learning/History app beside its composer and reads the same production graph as the website. Vertex selection reached a removable composer context attachment. View, selection, and reasoning survived native host context updates after the restoration repair.
- Actual ChatGPT read/write: the paired tutor called discovery/resume, patched the synthetic graph title, and read back version 3 with distances A=0, B=3, C=1, D=6, E=∞. The signed-in production viewer independently confirmed that edit. A native partial-work message produced context-specific invariant feedback; a submitted selection settled C and updated distances in the same graph. Actual native code execution returned `8` and recorded output exposure as H6. The private tutoring policy was activated at the requested scope.
- Actual local HTTP smoke: MCP discovery/read/write, parallel exercise writes, retry deduplication, conflicts with preserved RPC IDs, background output, image upload/readback, chat-tool media upload/readback, Word export, and missing-identity refusal passed. An earlier unscoped prompt selected a different existing app; that read-only result is excluded from this product’s verification. No private record contents are included here.

## Supported-client status

| Surface | Implementation | Verification |
|---|---|---|
| Desktop browser viewer | Today/Learning/History, source reader, workspaces, privacy | Local browser exercised; further matrix checks pending |
| Mobile browser viewer | Responsive layouts and keyboard/text alternatives | Not yet exercised on physical mobile |
| MCP read/write, text-only lessons | Generic owned-record control plus evidence/checkpoint/job actions | Actual local HTTP passed; native app tool reads passed; real ChatGPT model read/write passed; cross-chat paused-state recovery passed between web/Work and this connected Codex chat |
| In-chat mini-app | Self-contained MCP Apps UI and two-way messages | Real native app rendering and removable selection context passed; native submission, delivery, and tutor feedback passed |
| Fullscreen | `ui/request-display-mode`, same server activity | Native global entry and fresh standard-chat inline → fullscreen → inline passed with selection and draft intact |
| Sidebar/panel | Global/thread entrypoint declarations | Open-plugin global entry and adjacent chat verified; thread-panel entry pending |
| Custom file editor | `.lcnotes`, `.lcactivity`, host read/write/ETag | Native file-entry test pending; app-owned notes supported |
| Composer references | Mention search, resource reads, removable selected context | Native vertex and exact PDF-passage context/removal passed |
| iOS/Android ChatGPT | Capability detection, data-tool equivalent | Not tested; no native-support claim |

## Genuine platform/integration boundaries and product gaps

The available Sites tool catalog does not expose `list_plugin_eligibility`; no external connector IDs, visitor grants, or write permissions have been invented. GitHub/Google learning-resource integration is therefore **not implemented as a direct hosted connector**. A tutor-broker workflow is implemented (`ingest_external`, exports, and `external_receipt`) for separately connected service tools; it preserves inspected content and provider receipts without pretending that a receipt performs an external action. A real connected GitHub read imported the public project demo with its blob revision. A synthetic study pack was exported from chat into this public project. Direct hosted provider synchronization and other provider writes remain unverified.

Text/Markdown/CSV/JSON imports, original image/PDF/audio storage in private R2, image-point/page annotations, audio capture/playback controls, and OOXML Word export are implemented. Original-file API and MCP image readback passed locally; the OOXML ZIP CRCs and Unicode document text also passed independent archive parsing. Native web/Work PDF rendering, both-page extraction, byte-identical original readback, and exact passage attachment/removal passed. This Codex client explicitly omits audio model input; no pronunciation assessment is claimed here. Original audio storage passed; native playback and native file-entry workflows remain open. The native browser chooser did not produce an automatable file event; original PDF upload through the real chat tool and its native viewer passed. The PDF viewer now renders pages, selects exact embedded spans/regions, and saves bounded study-text extraction without changing original bytes. Both pages and byte identity passed locally. Automatic OCR, rich non-text formats, and a general Python/runtime sandbox remain requirements. Audio-based pronunciation feedback requires actual inspection by the connected tutor; it is never inferred from text. Browser printing supplies a printable PDF route; it is not a dedicated PDF authoring service.

Source-aligned preparation is deterministic extraction, not automatic generation/validation of arbitrary course-level assessments. Fresh full retests, cumulative checks, plan changes, and evidence-linked sheets are tutor-operated through tools; autonomous pedagogical quality requires real-chat evaluation. The real chat tools completed source-aligned preparation and retrieved its durable output with no learner evidence. Source revisions and question structure can also be checked, with semantic validation explicitly left to the tutor. Scheduled notifications and ongoing jobs beyond the bounded runtime need a separately verified scheduler. No closed conversation is promised an automatic assistant turn.

Sharing requests require an explicit destination/audience and purpose, then direct learner confirmation. They prepare a scoped snapshot for an authorized export/connected-provider delivery and support revocation; they never silently publish private content or confer access through the owner-private Site. The synthetic GitHub export workflow is verified; arbitrary public bearer-link hosting is not provided. Portable JSON history import/export is implemented with collision protection, namespacing, no access transfer, and imported-evidence limits; binary originals must be transferred separately. Robust large-library storage, robust abuse/rate limiting, and a multi-user operational security review remain requirements.

See [the scenario matrix](acceptance.md) for every PRD acceptance row and the remaining end-to-end checks.

A fresh standard ChatGPT chat invoked discovery/resume/workspace, recovered the same saved graph and active policy without attachments, and rendered the real app inline. Inline → fullscreen → inline preserved B selection, step 2, distances, and reasoning. This account had custom-app CSP enforcement off; no account security setting was changed. The deployed native document enforces its own restrictive CSP. Its initialization, original PDF viewer and actual code output 8 passed under that policy.

Exact long text is deduplicated internally across policy versions and retry receipts without changing decoded records, history, or access. Existing plain JSON rows remain readable. This avoids consuming the storage budget with repeated copies of the imported private manual. Original-file references are immutable; deleting one duplicate retains originals still referenced by another owned source.

Assessment feedback timing is enforced in the learner projection: item grades, totals, grade-history notes, and new skill conclusions remain concealed until the declared boundary. The tutor can inspect saved work for grading. Draft recovery is keyed by activity and source, so switching workspaces does not overwrite another unsaved draft.
