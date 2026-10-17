# Acceptance scenario matrix

Every PRD row has an automated domain/protocol contract test. A contract pass is not a complete host, teaching-quality, or human-learning evaluation. Open checks below remain acceptance requirements; they are not reported as passing.

Run `npm test`; browser and connected-tool results are summarized in [verification](verification.md). Private raw receipts stay local.

| ID | PRD scenario | Observed result / remaining check |
|---|---|---|
| B01 | A course is introduced in chat with a study guide. | Real chat created a synthetic course, guide and extracted outline; preference saved through tools. |
| B02 | A goal changes or a category is skipped. | Real chat changed the synthetic plan and retained skipped work as unassessed. |
| B03 | A new chat resumes a paused graph exercise. | Native paused graph recovered through another connected chat, including B selection, step 2, draft and active policy. |
| B04 | A correct answer follows a displayed solution. | Contract passed; live exposed-response check pending. |
| B05 | Named and renamed algorithms produce different answers. | Named/unlabelled evidence contract passed; live teaching comparison remains open. |
| B06 | A learner uses correct rough notation or fills only requested blanks. | Numeric normalization contract passed; semantic tutoring quality requires actual response review. |
| B07 | A question leaks its answer or is defective. | Real chat invalidation exercised; denominator/coverage repair verified in domain tests, production readback pending. |
| B08 | An answer key conflicts with a valid correction. | Exact version comparison and conflict-preservation contracts passed; live revised-source check pending. |
| B09 | A bar has repeated errors in one subskill. | Real chat synthetic bar triggered its declared repeated-error rule. |
| B10 | A fresh full retest is requested. | Real chat created a distinct full two-item retest with declared scope. |
| B11 | A milestone is passed with cumulative review agreed. | Real chat corrected a full synthetic retest to 2/2, obtained fresh_cumulative, and created the agreed fresh cumulative item. |
| B12 | A learner returns after a long break. | Historical-evidence contract passed. Long-break and delayed-performance evaluation requires longitudinal use. |
| B13 | A tutor corrects a grade. | Real chat changed a valid rough-notation item from the synthetic error fixture to its correct grade; total changed 1/2 → 2/2 and next action became fresh_cumulative. |
| B14 | Only unmastered material is requested in a sheet. | Selected-standard and mixed-source exclusion contracts passed; real learning-dependent sheet evaluation remains open. |
| B15 | One attempt is submitted twice. | Real chat retried one submission and received the same attempt with replayed=true. |
| B16 | Two chats update different exercises. | Real HTTP parallel writes passed; real native draft conflict recovered as a branch while preserving the other chat edit. |
| B17 | A save fails. | Persistence-failure contract passed; actual stale-edit recovery passed. Production outage injection was not performed. |
| B18 | A learner says not to store something. | Recording/exclusion tests passed locally; owner permissions were not disrupted for testing. |
| B19 | Export or deletion is authorized from chat. | Real chat exported a synthetic artifact; permanent deletion and original erasure tested with synthetic local identity and host-response contracts. |
| B20 | A feature is editable in the app. | All 17 record areas exposed; real chat read/write, imports, assessments, plans, checkpoints and jobs exercised. |
| B21 | The learner never opens the standalone app. | Real chat source/course/assessment/artifact workflow passed without website bookkeeping. |
| B22 | The learner opens only the viewer. | Native Today shows the active exercise, next action and reason. Human ten-second usability study not performed. |
| B23 | A public demo or repository is published. | Staged secret/provenance review and public-source audit; private runtime and complete attachments excluded. |
| E01 | A tutoring package includes engine rules, examples, and a personal profile. | Actual private package import separated engine, personal profile and state schemas; profile-template classification repair added. |
| E02 | A new chat starts after authorized tutoring-policy import. | A separate connected chat retrieved the active imported policy with exact paused state. |
| E03 | The learner requests a direct answer under a coaching policy. | Direct-answer/exposure contract passed; live direct-answer journey pending. |
| E04 | The learner succeeds only after a revealed intermediate step. | Assistance contract passed; live assisted-step journey pending. |
| E05 | The same hint fails again. | Controller/policy contract passed; adaptive teaching quality remains open for real dialogue evaluation. |
| E06 | A temporary overload observation is recorded. | Contextual uncertain load retained in conversation layer; never promoted automatically to profile. |
| E07 | A course-specific policy conflicts with another imported rule. | Private scope decision saved; conflict trace and activation are inspectable. |
| E08 | The learner opens the active graph in a panel and then fullscreen. | Fresh standard-chat inline → fullscreen → inline passed with the exact graph, step, selection and draft; global entry remains fullscreen. |
| E09 | The learner selects a vertex and submits a next-step answer. | Actual native C submission settled C, relaxed B/D, saved one attempt and produced tutor feedback. |
| E10 | The tutor demonstrates the next graph step. | Demonstration/no-evidence contract passed; live tutor demonstration pending. |
| E11 | The learner says “why this cell?” after a table selection. | Selected-cell axes/version contract passed; native selected-cell feedback pending. |
| E12 | A correct next answer could be revealed by color, a title, or preselection. | Snapshot, checkpoint and accessibility projections conceal answer keys and expected outputs; native cold-assessment inspection pending. |
| E13 | A learner explores with sliders without submitting an answer. | Exploration/no-evidence contract passed; native slider journey pending. |
| E14 | A learner asks to replay an earlier step after seeing a solution. | Reset/replay exposure tests passed; live replay pending. |
| E15 | A learner writes a partial solution in a fullscreen workspace. | Actual native partial graph reasoning reached the tutor without retyping and retained its draft. |
| E16 | The learner requests actual code testing. | Actual isolated JavaScript output 8 verified locally and in native web/Work; output reveal is tracked separately. |
| E17 | A source passage is attached through a composer feature. | Native vertex selection created a removable composer context attachment; precise PDF/source selection pending in native host. |
| E18 | A specialized viewer edits learner-owned notes. | Local PDF extraction kept originals byte-identical; app-owned notes are editable. Native external-file entry remains unverified. |
| E19 | A supported sidebar entry opens a saved exercise. | Actual Open plugin global entry resumed the existing production graph beside its chat. |
| E20 | A client lacks a requested panel or composer feature. | Text/tool equivalents work; global display-mode refusal is reported truthfully. Mobile/native file clients untested. |
| E21 | The client supports a required richer surface. | Actual native global app, adjacent tutoring chat, inline app and fullscreen transition verified. Native external-file entry remains open. |
| E22 | A widget saves an action but conversation delivery fails. | Delivery-failure state contract passed; production host-denial injection not performed. |
| E23 | An external source is revised. | Real connected GitHub source imported with blob revision; exact historical comparison tested locally. |
| E24 | A requested practice pack is prepared after the chat closes. | Real chat queued preparation, then retrieved completed output independently; no learner evidence created. |
| E25 | Background work is canceled or loses authorization. | Revocation, cancellation, terminal jobs and changed-source failure tested; no owner access was expanded for testing. |
| E26 | The app cannot initiate a new assistant turn on the current host. | Completed artifacts remain retrievable; no automatic closed-chat assistant turn is promised. |
| E27 | A learner requests text-only study. | Real tools created and operated records from chat; text-only preference is durable. |
| E28 | A learner never opens the external companion website. | Source/course, native graph action, assessment, save and cross-chat recovery exercised; a single continuous no-website onboarding journey remains open. |
