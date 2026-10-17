# Learning Companion
## Final-product requirements document — Version 2

**Working product name:** Learning Companion  
**Product definition:** A chat-controlled learning environment, durable learning record, planning companion, and simple progress viewer.  
**Primary teaching and control surface:** ChatGPT, enriched with connected learning activities and workspaces.  
**Scope:** The complete intended product. Optional experiences are optional for the learner, not omitted from the final product.

**Revision:** Extends the original PRD with in-chat learning surfaces, two-way interaction, specialized workspaces, tutoring-document support, external integrations, and authorized background work. Sections 27–35 specify the added requirements; earlier sections remain part of the product and have been aligned with the expanded scope.

## 1. Product vision

A learner should be able to start a new conversation, name a course or learning goal, and continue with a tutor that knows what they have studied, what they can reproduce independently, what remains uncertain, and exactly where they stopped.

The companion owns the durable learning record and shared learning objects. Chat owns the teaching interaction. The learner should not have to manage a second workflow to keep them aligned.

The product promise is: **Learn and work together in chat. Keep the learning record outside the chat. Resume anywhere without starting over.**

The product must make ChatGPT feel like a learning environment, not just a stream of explanations followed by a progress dashboard. A graph can remain available while the learner selects a vertex; a worksheet can be completed while the tutor coaches; a source passage can stay beside a question. Those interactions belong to the same lesson and learning record.

The companion is not a separate chatbot, a transcript archive presented as intelligence, or an interface that requires students to administer their own curriculum.

## 2. Intended users and outcomes

The primary user is an individual learning across multiple university courses or personal subjects with a conversational tutor. The product must also accommodate professional study and language learning without assuming that every subject is a collection of flashcards or coding exercises.

The learner should spend time learning rather than maintaining topics, copying summaries, tracking scores, or reminding the tutor of agreements. The tutor should retrieve relevant context, teach and assess, operate the shared activity, record results, revise the plan, and resume later. The companion app should make that work understandable and inspectable.

Success means reliable continuity, evidence-supported progress, useful next steps, meaningful learner action, and less wasted practice. Conversation length, screen time, widget clicks, streaks, and answer volume are not success measures by themselves.

## 3. Non-negotiable product principles

**Chat is the primary interface.** Every user-manageable learning capability must be available to the authorized tutor from chat. The learner must never be required to open an external app to mark progress, edit a topic, change a plan, or repair a record.

**The learner remains in charge.** Broad standing permission may authorize routine reading and writing. It does not authorize the tutor to grant itself access, override a refusal, or publish private material.

**Evidence comes before mastery claims.** Exposure, guided success, independent success, transfer, and delayed retention must remain distinguishable.

**One lesson across surfaces.** Chat, interactive activities, fullscreen workspaces, conversation panels, and the companion viewer must refer to the same selected activity and saved learning record, not parallel copies requiring reconciliation by the learner.

**The default experience is simple.** The app answers three questions immediately: Where am I? What should I do next? Why?

**Interaction serves learning.** A control, visualization, or mini-app must help the learner inspect, predict, construct, compare, practice, or assess something. More interface is not automatically better.

**Corrections are normal.** Learners, tutors, questions, and answer keys can all be wrong. The product must support correcting each without unfairly penalizing the learner.

**The record is portable and private.** Learning continuity must not depend on a particular conversation. A public product repository must not expose private learning records.

## 4. Product boundaries

The final product includes learner profiles, courses, sources, skill maps, learning evidence, tutoring policies and preferences, interactive activities, assessments, review schedules, study plans, exact session checkpoints, learning artifacts, sharing controls, and a simple viewer.

It does not replace institutional gradebooks, promise exam grades, require a second tutoring conversation inside the companion app, or make passive monitoring of unrelated conversations a condition of use. It does not claim to know a learner's mental state or ability from activity statistics alone.

The product extends supported ChatGPT experiences. It does not require ownership or replacement of ChatGPT's native conversation interface, unrestricted access to all chats, or permission to bypass host restrictions.

Identity verification, consent, and host-required security decisions remain learner actions when required. Apart from those boundaries, ordinary product operation must be controllable from chat.

## 5. The app experience

The app has three primary destinations: **Today, Learning, and History**. Account and privacy controls remain readily accessible without becoming another dashboard. An activity workspace belongs to its lesson; it is not a fourth management destination.

### First use

A new learner must be able to begin with a course name, a goal, a supplied document, or an existing learning record. Explain what the tutor may read and change, obtain required permissions, and show whether the connection is ready. Do not require a lengthy profile questionnaire, a completed curriculum, or a first upload before tutoring can begin. Disclose required external accounts or costs before the learner commits to them.

### Today

Show the active course or goal, exact resume point, next recommended activity, due reviews, and relevant deadlines. Display a brief explanation of the recommendation and an honest indication of missing or stale information.

A returning learner should see a useful continuation rather than a wall of overdue tasks. Other courses remain visible without displacing the active task unexpectedly. A selected activity may be opened in the supported ChatGPT learning surface without starting a separate lesson.

### Learning

Show courses, goals, sources, topics, and subskills in a readable outline. Each skill exposes its evidence, unresolved misconceptions, recent assessment results, and planned next action. A prerequisite map is available as a deeper view, not required navigation.

Course details also contain the source library, assessments, saved activities, and study sheets. Searching should work across concepts, memorable phrases, past mistakes, source titles, and prior exercises.

### History

Show meaningful learning events, assessments, corrections, plan changes, and resumable sessions. Separate learner performance from tutor mistakes and defective questions. Let the learner inspect what changed, why it changed, and which evidence supported it.

Detailed capabilities live within these views. Viewing the standalone app is optional; a learner who only uses chat retains access to the full product.

## 6. Full tutor control

The connected tutor must have complete authorized read-and-write capabilities for all user-owned product areas. A feature is incomplete if its ordinary operation is available only in an app interface, except for required identity, consent, or security actions.

| Area | Required capabilities from chat |
|---|---|
| Learner profile | Read, create, correct, remove, and scope goals, preferences, constraints, and self-assessments. |
| Courses and goals | Create, rename, reorganize, prioritize, archive, restore, duplicate, and remove. |
| Sources | Add authorized materials, inspect relevant content, annotate, associate with skills, revise status, replace, and remove. |
| Skill map | Create, split, merge, reorder, connect prerequisites, change scope, and preserve relevant evidence. |
| Practice material | Create, inspect, revise, validate, retire, and replace questions, examples, rubrics, and answer material. |
| Attempts and evidence | Record, read, assess, correct, dispute, invalidate, and remove under the learner's permissions. |
| Learning status | Revise evidence-supported status, attach uncertainty, and record learner and tutor judgments separately. |
| Plans and schedules | Create, change, pause, resume, reorder, and cancel study plans, reviews, and reminders. |
| Sessions | Start, pause, branch, resume, complete, and repair checkpoints and pending tasks. |
| Assessments | Define scope and pass rules, start and grade assessments, repair grading, and assign targeted follow-up. |
| Learning artifacts | Create, update, replace, export, and remove study sheets, practice packs, reports, and saved outputs. |
| Learning workspaces | Open, inspect, configure, annotate, change, reset, branch, save, resume, and close activities; distinguish tutor demonstrations from learner actions. |
| Tutoring documents | Import, inspect, activate, scope, revise, compare, restore, and export authorized teaching policies and playbooks. |
| Background work | Request, inspect, change, pause where possible, cancel, or retrieve authorized tasks and their outputs. |
| App preferences | Change every learner-facing option, including presentation, accessibility, notifications, and privacy where permitted. |
| Sharing and connections | Inspect status and request authorized sharing, connection changes, revocation, or removal; respect confirmation requirements. |
| Account-owned records | Export, transfer, archive, restore where supported, or delete on an authorized request. |

The tutor must be able to discover what it may do and what information is missing. A denied or unsupported operation must produce a clear limitation rather than a success claim. Routine bookkeeping should not interrupt each teaching exchange with permission requests or administration narration.

Full control means the capability to perform an authorized action, not a guarantee that a host permits silent or unattended execution. Missing cosmetic surfaces may have equivalent supported presentations; missing core read/write functionality remains a delivery blocker.

## 7. Learner profile and tutoring agreements

Record learner-stated goals, available study time, deadlines, desired depth, accessibility needs, preferred response length, pace, answer format, and relevant prior experience. Record personal details only when useful and authorized.

Separate explicit preferences from tentative tutor observations. Do not turn a preference into a permanent claim about cognitive ability or a fixed learning style.

Preferences may apply globally, to a course, or to the current session. More specific current instructions take precedence over broader defaults within applicable safety, correctness, and permission boundaries. Temporary overrides must not silently replace long-term preferences.

Required agreements include question batching, target difficulty, individual-pattern versus mixed practice, answer-only versus work-required assessments, hint tolerance, source-style labels, cumulative-bar rules, category exclusions, and presentation preferences such as text-only or a visible workspace.

The learner must be able to say “stop doing that,” “remember this,” “only for today,” “show less,” or “undo that preference” and have the correct scope updated.

## 8. Courses, goals, and source materials

Each course or goal must retain its scope, term or relevant period, intended outcomes, deadlines, assessment constraints, available materials, and active study objective. Exam scope and whole-course scope are separate.

Support authorized syllabi, study guides, past exams, answer keys, lecture notes, textbook excerpts, handwritten material, images, links, and imported learning summaries. The tutor must work from these without requiring a manually built topic checklist.

Preserve source identity, version, location references, and the distinction between instructor material, learner work, generated content, and tutor-policy documents. Unreadable pages, missing diagrams, ambiguous notation, and unavailable links remain visible limitations.

A remembered filename or mention of an older conversation does not establish access to its contents. Sources that cannot be retrieved must not be cited as if inspected.

An updated study guide may change the scope and plan without erasing historical work. Historical exams inform question style; they do not guarantee future content.

When sources disagree, distinguish the source statement, the proposed correction, supporting evidence, and unresolved questions. Course terminology and grading conventions must not be silently replaced with generic terminology. Display annotations and corrections separately from the original unless an authorized edit is explicitly requested.

## 9. Skills and prerequisites

Track progress at useful subskill granularity. “Recurrences” or “Dijkstra” alone is too broad when the learner succeeds at one form but fails at another.

Capabilities include recognition, recall, explanation, procedure execution, derivation, code production, debugging, discrimination, and transfer. Different subjects emphasize different capabilities.

Retain prerequisite relationships, relevant problem families, source references, expected response forms, and course-specific conventions. Shared foundations may connect courses without automatically granting mastery in a new context.

The tutor may reorganize the skill map. Splitting or merging a topic must not fabricate independent successes, discard valid evidence, or imply coverage of newly added material. Skipped or unassessed work remains visible.

## 10. Learning evidence

Each assessable attempt must retain enough information to understand what happened: the prompt, learner response, relevant problem state, criteria, feedback, assistance, and resulting conclusions. The response may be typed, spoken, drawn, or submitted through an interactive activity.

Record whether an answer was independent, hinted, copied from a visible explanation, self-corrected before feedback, uncertain, abandoned, or affected by a defect. Separate final-answer correctness from visible reasoning quality.

Confidence and effort may be recorded when supplied or meaningfully observable. Do not invent response times, treat message gaps as thinking time, or infer that an unrecorded event never happened.

Equivalent expressions, reasonable notation, correct verbal answers, and responses filling only requested blanks must be assessed according to the task. Clarify material ambiguity rather than confidently misgrading it.

Imported records retain origin and evidential limits. An imported “mastered” summary is not equivalent to a preserved independent assessment. Unknown hints, dates, and conditions remain unknown.

Repeated submissions or imports of the same attempt must not count as independent successes. Routine navigation, hovering, and animation playback are not performance evidence.

## 11. Mastery, readiness, and retention

Separate coverage, current learning status, and demonstrated retention. Use understandable states such as unassessed, exposed, developing, locally ready, robust, and needs review, with the active policy's meaning available.

Exam readiness is a separate judgment tied to a particular scope and required performance. Robustness demonstrated through variation must not be described as delayed retention unless a delayed check actually occurred.

No single immediate answer may permanently certify a broad topic. Show supporting evidence, recency, assistance, and unresolved weaknesses. A displayed percentage must explain what it measures rather than imply unsupported precision.

Keep learner confidence, tutor assessment, and demonstrated performance independently visible. The learner may express readiness or request review without rewriting scores. Assessment revisions retain their reasons.

A lack of recent evidence may justify review; it is not proof of forgetting. A failed delayed or transfer check revises the relevant dimension without erasing unrelated knowledge.

Keep official grades, self-reported results, practice scores, and readiness estimates distinct. Passing a bar means passing that bar, not permanent mastery, complete syllabus coverage, or a predicted exam grade.

## 12. Misconceptions and successful memory aids

Retain specific misunderstandings rather than wrong-answer totals alone. Separate conceptual errors from notation slips, arithmetic mistakes, memory lapses, question misreadings, and tutor-induced confusion. Classifications are revisable hypotheses, not permanent learner labels.

Retain explanations, contrasts, mnemonics, and representations the learner found useful, including conditions and exceptions. A shortcut for a restricted family must not become an unrestricted rule.

A recurring misconception should influence practice choice. A resolved misconception remains available for occasional retention checks without dominating every lesson.

## 13. Teaching progression and next-activity decisions

Support progression from prerequisite instruction through independent work, representative course difficulty, and a limited extension beyond it. Advancement reflects evidence and learner instructions, not a fixed number of messages.

The learner may accelerate, skip, revisit, change courses, or request an assessment. Variation must change something meaningful: representation, boundaries, direction, assumptions, distractors, or reasoning. Cosmetic substitutions are not proof of transfer.

Recommendations consider the goal, scope, prerequisites, recent errors, reviews, available time, and requested pace. Explain their purpose briefly. Unknown topic importance must not be presented as a calculated likelihood.

Support learning, coaching, practice, assessment, review, direct-answer/reference, debugging, proof review, and interview modes. Changes may be natural in conversation; do not require the learner to operate a mode dashboard.

Assessment mode protects against hints and premature feedback. Direct-answer mode supplies requested answers without mandatory interrogation or manufactured mastery evidence.

## 14. Question quality and source alignment

Each question retains target skills, difficulty, assumptions, response requirements, source relationship, and criteria. Generated adaptations must not be presented as actual historical exam questions.

Distinguish directly sourced questions, similar documented instructor styles, and broader practice adaptations. Display the learner's preferred labels outside assessments that intentionally hide them.

Prompts must be answerable. Graphs need directions and weights; heaps need indexing and active size; procedures need relevant conventions. Incomplete or contradictory prompts must not be treated as valid tests.

Support checks of expected answers, code behavior, traces, and examples. Disclose when reliable validation is unavailable.

A revealing name, title, highlight, preselected answer, or repeated exposed item can contaminate a cold assessment. Do not count such results as clean independent evidence. Retire or repair defective items without creating learner failures.

Difficulty must challenge the intended concept rather than unrelated factual recall or tedious arithmetic that the target assessment does not require.

## 15. Bars, cumulative assessments, and remediation

Before an assessment, establish scope, question count, permitted assistance, scoring rules, pass threshold, and repeated-error conditions. Keep them stable unless the learner agrees to a visible change.

Support topic and cumulative bars. Honor agreements that a passed milestone triggers a fresh cumulative check rather than an unnecessary duplicate topic test.

Cumulative tests sample meaningful skill coverage, revisit weak points, vary outcomes and ordering, and avoid hints in labels or introductions. Unlearned content must not silently become a requirement for passing a retention test.

Record item-level results and separate scoring from qualitative judgments. Explain the pass/fail result. Corrected grading must update affected totals and conclusions.

After failure, support targeted repair and the requested retest format, including a full fresh bar. Passing repairs does not rewrite the original score or automatically satisfy a separate full-bar criterion.

## 16. Review scheduling and exam planning

Maintain review needs across sessions and courses. Distinguish factual recall from procedural, explanation, discrimination, and transfer checks. Reviews must not be limited to flashcards.

Support delayed independent checks, spaced review, contrast practice, mixed review, and recovery after long breaks. Review intensity, pauses, and reminders are controllable from chat.

Plans reflect deadlines, available time, goals, documented exam scope, and remaining work. Cram mode may prioritize plausible recoverable points; long-term mode may emphasize foundations and retention. Neither promises outcomes.

Show why an activity is due and prioritized. Missing sessions must not create an unusable backlog or punitive experience. Replanning should produce a realistic continuation.

Notifications are optional, respect quiet hours, and are private by default. Describe a reminder as scheduled only after confirmed scheduling.

## 17. Exact session continuity

A checkpoint preserves the course, skill, mode, exact activity, question, sources, hints revealed, response so far, feedback already given, and next unresolved action.

For stateful exercises, preserve the graph, array, table, variable values, diagram, conventions, active boundaries, and intermediate steps. “Working on heaps” is not an adequate checkpoint.

A fresh authorized chat retrieves a compact relevant continuation with access to underlying details, not an entire mandatory transcript. Do not repeat already resolved questions unnecessarily.

Support multiple paused courses and exercise branches. Concurrent sessions must not silently overwrite each other. Distinguish deliberate return to a checkpoint from accidental regression.

“Where were we?”, “show the same graph,” “resume yesterday's question,” and “start a new version” must preserve or deliberately change the selected object as requested. Clarify ambiguity rather than silently substituting another problem.

## 18. Rich learning objects and artifacts

Save objects that prose alone handles poorly: graph traces, heap boundaries, pointer diagrams, expression trees, dynamic-programming tables, proofs, worked examples, code attempts, and language examples.

These objects support the chat lesson and remain inspectable in the app. Meaningful changes, reveals, and learner submissions must retain their role in assessment. Object presentation must not be mistaken for learner production.

Support usable handwriting, screenshots, code, mathematical notation, and optional spoken responses. Surface uncertain interpretation before it affects grading.

The tutor can generate and update memory sheets, source-based notes, mistake journals, practice sets, answer keys, plans, and summaries. “Only what is not locked in” must exclude cleared material according to the selected evidence standard.

Provide editable and readable exports, including Markdown, Word documents, printable PDFs, and compatible flashcard exports. Keep answer keys separate until reveal is authorized. Export of private source material requires appropriate authorization.

## 19. Cross-course and subject support

Support multiple subjects and assessment forms. Mathematics, programming, conceptual courses, essays, and languages must not share one undifferentiated correctness model.

Shared prerequisites and preferences reduce re-onboarding. Prior success may support a new course while notation, proof expectations, and context still require attention.

Imported records preserve origin, subject-specific meaning, and uncertainty. Cross-course reuse must not merge instructor conventions or disclose restricted materials.

The learning record must remain usable outside one conversation or tutor provider. ChatGPT support is required; additional authorized tutors may use the same learner-owned record without creating incompatible accounts of progress.

## 20. Privacy, permissions, and ownership

The learner controls storage, tutor access, permitted operations, and sharing. Learning records are private by default.

Offer broad standing permission for routine learning administration and clear narrower alternatives. The learner can revoke permissions, pause recording, exclude conversations or sources, and remove sensitive observations.

External sharing, access expansion, and permanent destructive changes require appropriate explicit authorization. The tutor can request them from chat but cannot supply the learner's consent for them.

Support full or selective export, deletion, and clear retention choices. Deleted material must not reappear through stale summaries, restored checkpoints, or future imports without renewed authorization. Explain recovery limits.

Sharing with a tutor or study partner is optional, scoped, and revocable. Public demos and repository examples must use synthetic or explicitly approved public material, never private transcripts, profiles, grades, sources, or credentials.

## 21. Trust, corrections, and operational reliability

The app and tutor must agree on whether an operation succeeded. Never describe unsaved progress as saved. Show stale information, pending work, missing access, and unavailable connections.

Interruptions must not discard recoverable activity state. Previously saved information should remain viewable during temporary loss of connectivity with its age and limitations apparent.

Retries must not duplicate evidence, reminders, or courses. Conflicting edits must not silently lose newer work. The learner can inspect and correct resulting state.

Maintain understandable history for scores, preferences, topic structure, permissions, plans, and conclusions. Support eligible undo and restoration while respecting permanent deletion.

Source documents and imported content are not authorization to change permissions or perform unrelated actions. One learner's private information must never become another learner's context.

The connected experience must demonstrate real permitted reading and writing. Read-only access, simulated saves, or mandatory copy-and-paste bookkeeping do not satisfy the final product. Platform restrictions must be disclosed as blockers rather than hidden behind a completed label.

## 22. Accessibility and simplicity requirements

The viewer must be comfortable on desktop and mobile, including the learner's ordinary Mac workflow. Readability takes priority over dense analytics. Distinguish companion-app usability from capabilities actually available in each ChatGPT client.

Support keyboard access, screen readers, scalable text, readable math and code, sufficient contrast, and indicators that do not rely on color alone. Provide equivalent non-drag and textual interactions for learning tasks where practical.

A returning learner should identify the active topic and next action within ten seconds in usability testing. Finding why a skill is ready or needs review should require no more than two navigation steps from its course view.

Routine study requires no manual progress maintenance or repeated entry of known preferences. Do not require gamification, streaks, elaborate charts, or learning-science terminology.

## 23. Additional final-product capabilities

**Readiness rehearsal:** Fresh assessments aligned to documented exam scope, with uncovered material explicit and a focused recovery plan.

**Explain my progress:** Evidence-linked answers to “Why is this not mastered?”, “What changed this week?”, and “What am I guessing correctly?”

**Transfer checks:** Meaningful changes of representation and conditions rather than cosmetic substitutions.

**Break recovery:** A short diagnostic and prioritized restart, not assumed total mastery or total forgetting.

**Source conflict notebook:** Disputed answers, ambiguous conventions, and instructor clarifications, with original statements preserved.

**Portable practice:** Focused offline review exports and later self-reported results with appropriate evidential limits.

**Scoped sharing:** Selected snapshots, packs, and course outlines without full-account disclosure.

**Low-friction demonstration:** A realistic synthetic learning journey usable before personal uploads.

## 24. Baseline acceptance scenarios

| Scenario | Required outcome |
|---|---|
| A course is introduced in chat with a study guide. | Save the course, source references, initial skill outline, and relevant preferences without manual topic entry. |
| A goal changes or a category is skipped. | Update the plan; do not mark skipped work mastered. |
| A new chat resumes a paused graph exercise. | Retrieve the same graph, weights, intermediate state, hints, and pending question. |
| A correct answer follows a displayed solution. | Record it, but not as clean independent evidence. |
| Named and renamed algorithms produce different answers. | Keep recognition with and without the name distinguishable. |
| A learner uses correct rough notation or fills only requested blanks. | Grade by meaning and the actual request. |
| A question leaks its answer or is defective. | Invalidate it for mastery assessment without manufacturing a learner failure. |
| An answer key conflicts with a valid correction. | Preserve both statements and evidence without silently penalizing the learner. |
| A bar has repeated errors in one subskill. | Identify that subskill and apply the declared pass rules. |
| A fresh full retest is requested. | Provide a full retest, not an unsolicited repair-only replacement. |
| A milestone is passed with cumulative review agreed. | Provide the appropriate fresh cumulative check. |
| A learner returns after a long break. | Preserve past success, expose current uncertainty, and offer a manageable restart. |
| A tutor corrects a grade. | Consistently update item scores, totals, conclusions, and recommendations. |
| Only unmastered material is requested in a sheet. | Exclude material cleared under the selected evidence standard. |
| One attempt is submitted twice. | Count one piece of evidence. |
| Two chats update different exercises. | Preserve both without silent overwriting. |
| A save fails. | Report actual status and retain recoverable work. |
| A learner says not to store something. | Honor the exclusion without inventing a mastery inference. |
| Export or deletion is authorized from chat. | Complete the action and report its actual outcome. |
| A feature is editable in the app. | Make its ordinary equivalent available to the authorized tutor from chat. |
| The learner never opens the standalone app. | Keep the course, evidence, checkpoint, artifacts, and plan current. |
| The learner opens only the viewer. | Explain current status and next action without requiring transcript reading. |
| A public demo or repository is published. | Include no private learner data, private source documents, or credentials. |

## 25. Product evaluation

Evaluate continuity through exact checkpoint recovery in fresh chats. Evaluate record quality through grading accuracy, evidence attribution, exposed-answer handling, and consistency after corrections.

Evaluate usefulness through delayed independent performance and meaningful transfer on selected skills, not immediate practice success alone. Do not present these observations as causal proof of educational benefit without an appropriate evaluation.

Evaluate simplicity through time to understand status, manual bookkeeping, repeated preference corrections, needless repeated questions, and the ability to challenge the record.

Evaluate control completeness through every user-manageable capability in the real chat-connected experience. A working app screen alone is insufficient. Evaluate the expanded learning-environment requirements against Section 34 as well.

## 26. Public project and delivery requirements

**Requested local project:** `/users/dani/documents/code/dani/learning-companion/`  
**Intended public GitHub repository:** `danielbuva/learning-companion`

The product and repository names remain working names. Do not overwrite an unrelated existing project or repository to obtain them.

The repository must contain the product, this PRD, concise setup and usage documentation, contribution information, owner-approved licensing information, synthetic demonstration material, and truthful remaining limitations.

The repository is public; application records and uploaded course or tutoring materials are not automatically public. In particular, a consolidated tutoring document may contain a private learner profile alongside reusable policies. Do not publish that complete attachment by default.

Delivery must be usable by the owner and understandable to another person trying it. Mock screens, disconnected controls, read-only integration, decorative-only widgets, and undocumented manual bookkeeping are not complete delivery.

Identify the real local location, public repository address, accessible user experience, verified chat read/write capabilities, supported ChatGPT surfaces and clients, acceptance checks performed, and remaining authorization or platform blockers.

## 27. ChatGPT learning-environment capability coverage

The product must support the following capability areas as observable learning outcomes. These requirements do not prescribe frameworks, protocols, storage products, or technical implementation. Native presentation options apply where the host makes them available; the substantive learning function remains required.

| Capability area | Required product outcome |
|---|---|
| Custom tools and actions | The tutor can carry out the complete Section 6 control set and operate learning activities, not merely describe actions the learner must perform elsewhere. |
| Read/write data | The tutor can retrieve and change authorized learning records, documents, and connected-service content within the selected scope. |
| Persistent memory | Policies, preferences, evidence, artifacts, plans, and checkpoints survive conversation changes and are individually inspectable and correctable. |
| Interactive chat widgets | Compact cards, buttons, structured inputs, sliders, charts, and controls enable a meaningful action or understanding that prose alone handles poorly. |
| Mini-apps in chat | A learner can complete a focused activity, such as tracing an algorithm or filling a worksheet, while tutoring continues in the conversation. |
| Fullscreen apps | Larger diagrams, tables, editors, and assessments can expand without losing activity state or conversational continuity. |
| Sidebar apps | A supported native entry point opens the learner's existing Today, Learning, and History experience rather than a separate product record. |
| Conversation panels | A selected source or active workspace can stay beside the conversation so the learner need not scroll to find it repeatedly. |
| Custom file viewers/editors | Supported learning files can be read, annotated, edited where authorized, saved, and discussed at a precise location. |
| Composer integrations | The learner can select and refer to a course, source passage, exercise, saved result, or relevant working state while composing a message, using available host features. |
| Two-way interaction | Meaningful submitted actions in a workspace can reach the tutor, affect feedback, and update evidence; chat commands can change the same workspace. |
| Cross-conversation continuity | A fresh authorized chat can resume the exact saved activity, not just its topic summary. |
| External integrations | Authorized sources, deadlines, code, feedback, and outputs can move between the learning environment and the learner's connected services. |
| Background operations | Authorized preparation, source processing, review planning, and other long tasks can continue independently of the open lesson, with truthful status and retrievable results. |

Surface availability must not be assumed to be identical across accounts, desktop, web, and mobile. Section 33 defines the required verification and equivalent-experience rules. [O1–O5]

## 28. User-supplied tutoring harness and policy requirements

### 28.1 Import and activate teaching documents

Support individual tutoring documents and consolidated packages. Identify their declared roles, versions, authority order, examples, research references, learner-specific profile, topic state, and temporary session state. Do not require the learner to attach them again in every new chat after authorized durable import.

The supplied Bootstrap Prompt and Portable Adaptive Tutoring Harness are behavioral specification inputs, not curriculum to quiz the learner on. Their instructional commands do not authorize unrelated actions, override host permissions, or automatically convert a product-design conversation into a lesson.

The learner can request activation, comparison, edits, scoped overrides, suspension, or restoration of a teaching policy from chat. Make the active policy and applicable overrides inspectable. A change for one learner or course must not silently change other learners' policies.

Honor the source's declared authority order. Its operating manual and central adaptive policy govern interpretation; its example library illustrates behavior rather than imposing scripts. Preserve and surface material conflicts within imported documents or against an explicit current goal instead of silently resolving them. [H1; H2: README, A, B, I]

### 28.2 Preserve four separate information layers

| Harness layer | Product meaning and boundary |
|---|---|
| **Tutor Engine** | Reusable teaching rules, adaptive policy, error handling, domain playbooks, support standards, and self-audit. No personal mastery or learner-specific traits. |
| **Learner Profile** | Explicit goals, preferences, background, accessibility needs, and cautiously supported cross-topic observations. Preferences and demonstrated effectiveness remain different. |
| **Current Topic Model** | Skill and prerequisite evidence, support needs, misconceptions with uncertainty, review needs, and next-best probes for the topic. |
| **Conversation State** | Current task, subgoal, response, support, teaching objective, provisional load signals, pending actions, and the next evidence sought. Temporary states do not become permanent learner labels. |

Resetting or changing an activity must not delete the learner profile. Moving to another topic must not carry over unverified mastery. Compact resumption context should preserve decisive evidence without requiring a transcript dump. [H1; H2: C §§2–4,9]

### 28.3 Adaptive teaching behavior

The tutor's next move must be able to change in response to the learner's actual behavior. The product must support diagnosis, teaching, restoring progress, practice, fading support, assessment, and consolidation; it must not lock every interaction into questions, lectures, or a fixed Socratic sequence.

Distinguish no attempt, incorrect, partial, and correct responses from absent, unclear, flawed, locally valid, or sound visible reasoning. Keep assistance, novelty, stated confidence, independence, and transfer separate. Do not infer confidence, boredom, or overload from a terse response alone.

When competing explanations matter, retain a small set of plausible hypotheses with uncertainty and select a useful distinguishing activity. “I don't know” may call for a compact model, not repeated retrieval of something never taught. A productive partial attempt should receive local support rather than replacement by a full alternate solution.

Repeated ineffective assistance must trigger a different useful intervention or representation, not cosmetic rewording. Independent success should permit fading, a meaningful boundary check, or moving on rather than needless repetition. Current requests for direct answers or longer explanations must be honored without relabeling exposure as mastery. [H2: A §§4–12; B §§1–13,16–17; E]

### 28.4 Assistance, mastery, and policy evidence

Support the harness's assistance range from an entry cue through attentional and strategic hints, constrained structure, a revealed step, a worked example, and a full solution. The H0–H6 labels may remain available in detailed evidence, but the learner must not be forced to select or understand those labels.

The ladder is adaptive, not seven mandatory stages. Track what was actually revealed, including hints embedded in visuals, labels, autocomplete, tests, and examples. A replay or reset must not erase prior exposure.

Preserve the harness's distinction between locally ready and robust, and its retrieve, explain, apply, discriminate, transfer, generate, and independence dimensions. Do not average them into a misleading single score. Knowing when a method does not apply is a legitimate target, not an optional afterthought.

The harness's evidence classifications—Strong, Moderate/context-dependent, Plausible operational inference, Weak/unsupported, and Emerging—must remain attributable to their sources. Importing a research label is not independent verification of its claims. Exact word counts, hint counts, mastery percentages, and timing defaults must not be represented as universal scientific constants. [H2: 00; B §§8,12; C §§4–8; J]

### 28.5 Auditable behavior without intrusive narration

Retain concise, decision-relevant observations, uncertainty, intervention intent, support used, and next evidence sought. These are product assessment notes, not a demand for hidden model reasoning.

The learner may ask why a particular activity was chosen or a status changed and receive an evidence-based explanation. Ordinary lessons must not print internal checklists, mode labels, or diagnostic speculation on every turn.

Self-audit must address answer leakage, overexplaining, repeated questions, unsupported diagnoses, false praise, excessive questioning, ignored instructions, and unverified technical claims. Detected tutor errors must be repairable in both the activity and learning record. [H2: H]

## 29. Shared learning workspace and conversational interaction

### 29.1 One active working context

A lesson may have one primary active workspace with a clear course, task, mode, selected source, and current step. Supporting references may be opened without replacing the primary exercise. The learner can intentionally switch or branch activities.

A stable working object should remain available across relevant messages. Do not repeatedly generate unrelated graphs or reset tables merely because the conversation continues. A view should identify whether it shows the current state, a historical checkpoint, a learner draft, or a tutor demonstration.

Use inline experiences for compact tasks, a persistent panel or floating presentation for ongoing work when supported, and fullscreen for detail. Moving among them must preserve the selected problem, view position where practical, drafts, and progress. The learner may dismiss a visual or request text-only interaction without losing the lesson. [O1; O2]

### 29.2 Two-way control with meaningful submissions

The learner can submit an answer, select an object, enter a table value, reorder steps, edit code, attach a note, or request feedback without retyping the interaction into chat. The tutor must receive enough authorized task context to respond to that action accurately.

The tutor can select, highlight, annotate, configure, and demonstrate changes through chat. Learner actions, tutor actions, imported states, and automatic demonstrations must remain distinguishable.

A scratch edit is not necessarily a submitted answer. The product must make the boundary clear and allow feedback requests on partial work. Do not initiate a tutor response after every hover, keystroke, slider movement, or decorative interaction.

When the learner says “this node,” “that line,” or “why this cell?”, resolve the currently supplied selection to the correct object and version. If selection context has not reached the tutor, obtain it or ask a targeted clarification; never pretend to see an unavailable screen.

The product must distinguish saving a change from delivering that change to the conversation. It must not claim that the tutor saw an edit or responded to an event unless that actually occurred. [O3]

### 29.3 Attention and answer protection

The active surface presents the current task and the smallest useful controls. It must not overwhelm the learner with a progress dashboard, a toolbar for every feature, or multiple competing next actions.

Presentation must match the teaching mode. In assessment mode, do not pre-highlight the correct answer, preselect the appropriate algorithm, reveal future steps, auto-complete a solution, or expose answers through accessibility labels or descriptive titles. In explanation mode, an annotated demonstration is welcome but is recorded as assistance.

Controls such as “check my step,” “give a small hint,” “explain this,” “show the solution,” or “make it harder” express current learner intent. A change of mode must not require a settings detour. Users who answer in plain text remain fully supported.

## 30. Learning activity types

The product must offer reusable activity experiences appropriate to different subjects, not one isolated visual demo. Select activities from the current learning objective and evidence. The following are final-product capabilities, while individual lessons need only the useful subset.

| Activity | What the learner and tutor must be able to do |
|---|---|
| **Practice and assessment cards** | Present a precise prompt, accept free responses or appropriate structured answers, retain optional confidence, distinguish drafts and submissions, and provide feedback at the agreed time. |
| **Graph and algorithm workspace** | Inspect and select vertices and edges; track paths, frontier, visited or settled sets, distances, backpointers, and relevant algorithm state; propose or demonstrate a next step without silently changing the graph. |
| **Arrays, heaps, trees, and pointers** | Manipulate the relevant structure, trace inserts or removals, preserve node identity, display indexing and active boundaries, and distinguish the heap from an immutable sorted suffix where relevant. |
| **Recursion and execution traces** | Inspect changing inputs, active calls, returned values, variables, and work per step; predict before reveal and separate learner predictions from observed execution. |
| **Dynamic-programming and tabular work** | Name row and column meanings, enter states or table values, indicate dependencies and evaluation order, inspect a chosen cell, and trace reconstruction where required. |
| **Mathematics and proof work** | Enter equations or structured steps, annotate hypotheses and justifications, compare representations, identify an invalid inference, and preserve drafts separate from tutor corrections. |
| **Coding and debugging work** | Write, complete, reorder, modify, and review code; compare expected and observed behavior; request tests and inspect genuine results; retain learner code separately from suggested fixes. |
| **Source study and annotation** | Read a selected page or passage, mark a diagram or line, connect a question to that selection, create personal notes, and compare original and corrected statements. |
| **Recall and flashcard practice** | Retrieve before reveal, inspect a targeted cue or explanation when requested, and record assisted versus independent retrieval without treating self-rating alone as proof. |
| **Concept exploration** | Vary meaningful parameters with appropriate controls, make predictions, compare cases, and connect the result to the governing relation instead of presenting an unexplained animation. |
| **Writing and conceptual reasoning** | Develop outlines, arguments, explanations, or comparisons against explicit criteria; preserve the learner's authorship and identify the role of tutor assistance. |
| **Language-oriented activity** | Inspect and practice phrases, comprehension, composition, and usable spoken responses; preserve language-specific evidence rather than reducing it to generic task completion. |

Each activity must support plain-language chat control, saving and resumption, feedback boundaries, and accessible alternatives. A successful code execution, animation, or simulation must not be described as learner understanding unless the learner provides relevant evidence.

Real execution or testing must be clearly distinguished from a predicted or manually reasoned trace. Execution must respect resource, safety, permission, and cost limits. Exploratory parameter changes may create a new version; they must not alter a pending exam question without an explicit change of task.

The technical activity selection draws on the harness's playbooks for algorithms, proofs, programming, debugging, and representations. The specific interactive product surfaces are requirements proposed here, not capabilities asserted by the harness itself. [H2: D]

## 31. Source viewers, editors, and composition context

Support suitable specialized views for source documents, code, tables, notes, diagrams, and saved learning activities. The learner should be able to ask about a selected passage or object without copying the full document into the conversation.

Retain page or section location, selection, annotations, and source version. Edits to learner-owned notes or working files should be saved through permitted actions; original reference documents remain unchanged unless an explicit authorized edit is requested. Distinguish what was viewed, what was annotated, and what was actually changed.

Provide host-supported entry points for referring to courses, exercises, sources, checkpoints, or working files while composing a message. The learner must be able to inspect and remove the attached context. Do not replace the native composer or silently read unsent text beyond permissions and documented host behavior.

A selected reference must carry enough identity and context for the tutor to understand it. If a client lacks a specialized composer feature, a supported selection or chat request must reach the same learning record without requiring manual reconstruction of the content. [O1]

A sidebar or direct item entry point must open the intended course, source, or activity rather than an unrelated empty app. Sharing a reference must obey existing access restrictions; possession of a reference must not imply permission to private content.

## 32. External integrations and background work

### 32.1 Connected learning resources

Support authorized connections to GitHub, relevant Google services, existing learning companions, and other sources or destinations the learner chooses. Required outcomes include bringing selected study materials and code into a course, reading permitted deadlines and feedback, comparing revised materials, and exporting authorized artifacts or updates.

Connections must expose their actual read/write capabilities, selected account and scope, freshness, and failures. Access to Learning Companion is not automatic access to another service. Existing access must not be expanded silently.

The tutor may complete supported external actions from chat, including authorized edits and exports. Publishing, submitting coursework, sending messages, changing access, or altering an unrelated repository requires specific authorization. A task that only asks to study a file must not modify it.

Disconnected or unavailable services should not block unrelated lessons using already authorized available material. Imported updates must retain provenance and be distinguishable from learner work. [O4]

### 32.2 Authorized work outside an active chat

Support long or scheduled tasks such as processing an uploaded syllabus, preparing a source-aligned practice set, validating generated questions, regenerating a requested memory sheet, comparing source revisions, and preparing due-review material.

Before work begins, its purpose, relevant course and sources, intended output, authorization, and any material resource limits must be clear. The learner can inspect status, change permitted scope, cancel, or retrieve the result from chat. Pause is available for tasks where meaningful.

Show truthful states such as requested, awaiting authorization, queued, running, completed, failed, and canceled. A draft plan is not a running task. A canceled or superseded task must not silently replace a newer study plan or active exercise.

Completed work must remain available in the companion and retrievable in a later authorized chat. Where supported and opted in, a notification or event-triggered continuation may inform the learner. Do not promise an unsolicited message or a new tutor turn in a closed conversation unless the actual supported workflow can deliver it. Background work and an actively responding ChatGPT conversation are distinct capabilities. [O5]

Preparation is not learning evidence. Creating a practice pack while the learner is absent must not update mastery, record invented answers, or claim that a lesson took place. Work must respect revoked permissions, excluded sources, quiet hours, and configured cost limits.

## 33. Supported-client behavior and completeness

The delivered product must report its tested behavior for each supported client, account configuration, and relevant permission setup. Distinguish available, awaiting authorization, unsupported on this client, temporarily unavailable, and not implemented.

The full intended experience includes interactive messages, mini-app activities, larger views, sidebar entry points, conversation panels, file experiences, composer context, and two-way conversation. Where a native surface exists for a supported configuration, the product must provide and verify it. It must not use generic fallback language to excuse leaving available requested capabilities unimplemented.

Where a host does not offer a particular surface, preserve the underlying activity, read/write actions, and continuity through another supported presentation. A missing panel may change layout; it must not require manual learning-record upkeep. If the core action cannot be performed under the available permissions, disclose the blocker.

The product must not assume that a rendered card is durable storage, that saved widget state is visible in every conversation, that one connected service confers access to another, or that an app event automatically starts an assistant response. Verify the relevant outcome rather than treating a visual response as proof. [O1–O5]

Native host controls remain recognizable. No duplicate chat composer, imitation security prompt, fabricated save confirmation, or interface that conceals what is shared with the tutor.

## 34. Expanded learning-environment acceptance scenarios

These supplement every baseline scenario in Section 24.

| Scenario | Required outcome |
|---|---|
| A tutoring package includes engine rules, examples, and a personal profile. | Separate their roles and privacy; preserve declared authority; do not publish the private profile with reusable policies. |
| A new chat starts after authorized tutoring-policy import. | Retrieve the applicable policy and learning state without asking for all documents again. |
| The learner requests a direct answer under a coaching policy. | Provide the requested answer, record exposure, and do not force a quiz. |
| The learner succeeds only after a revealed intermediate step. | Preserve the assistance level and choose appropriate future evidence instead of certifying independence. |
| The same hint fails again. | Change the useful intervention or representation rather than repeat cosmetic wording. |
| A temporary overload observation is recorded. | Keep it contextual and uncertain; do not convert it into a permanent profile trait. |
| A course-specific policy conflicts with another imported rule. | Make the conflict traceable and obtain an appropriate scope decision rather than silently replacing instructions. |
| The learner opens the active graph in a panel and then fullscreen. | Keep the graph, weights, selection, step, and draft intact. |
| The learner selects a vertex and submits a next-step answer. | Make that exact action available to the tutor for feedback and record it once. |
| The tutor demonstrates the next graph step. | Update the same object, label the tutor contribution, and do not count it as learner performance. |
| The learner says “why this cell?” after a table selection. | Use the supplied selected cell, table meaning, and current version; clarify if the selection is unavailable. |
| A correct next answer could be revealed by color, a title, or preselection. | Keep it concealed during a cold assessment, including accessible descriptions. |
| A learner explores with sliders without submitting an answer. | Preserve useful exploratory state without recording every movement as mastery evidence or triggering constant tutor turns. |
| A learner asks to replay an earlier step after seeing a solution. | Restore the earlier display while retaining the fact that the answer was exposed. |
| A learner writes a partial solution in a fullscreen workspace. | Preserve the draft and permit context-aware chat feedback without requiring retyping. |
| The learner requests actual code testing. | Distinguish real results from predictions and honor the assessment's tool rules. |
| A source passage is attached through a composer feature. | Identify the exact source and selection; allow removal of that context. |
| A specialized viewer edits learner-owned notes. | Save the authorized edits without silently modifying the original reference document. |
| A supported sidebar entry opens a saved exercise. | Resume the correct activity and record rather than open an unrelated empty state. |
| A client lacks a requested panel or composer feature. | Provide a truthful supported equivalent without losing core learning actions or claiming the missing native feature exists. |
| The client supports a required richer surface. | Demonstrate that surface; do not claim a text-only fallback completes the requirement. |
| A widget saves an action but conversation delivery fails. | Preserve the saved action, report delivery status, and do not claim the tutor received it. |
| An external source is revised. | Retain the source change and its implications without falsely attributing it to learner work. |
| A requested practice pack is prepared after the chat closes. | Expose honest job status and a retrievable result; update no learning evidence without actual learner work. |
| Background work is canceled or loses authorization. | Stop permitted future work appropriately and prevent unauthorized or stale replacement of current records. |
| The app cannot initiate a new assistant turn on the current host. | Keep the result available without promising an automatic response. |
| A learner requests text-only study. | Preserve full control, evidence tracking, and equivalent useful activities without requiring widgets. |
| A learner never opens the external companion website. | Complete a source-based lesson, interactive activity, assessment, save, and fresh-chat continuation using the supported chat experience. |

## 35. Source grounding and interpretation

### User-provided behavioral sources

**H1 — Bootstrap_Prompt(1).txt.** Establishes the document authority order; separate Tutor Engine, Learner Profile, Current Topic Model, and Conversation State; compact adaptive interventions; explicit learner control; and resumable handoffs.

**H2 — Portable_Adaptive_Tutoring_Harness_Consolidated(1).md, Version 1.0, September 2, 2026.** Referenced by its internal document headings: README; 00 Research Synthesis and Evidence Map; A Tutor Operating Manual; B Adaptive Interaction Policy; C Learner Model Specification; D Technical Teaching Playbook; E Diagnostic and Error-Handling Guide; F Session Protocol; G Example Interaction Library; H Tutor Self-Audit Checklist; I Bootstrap Prompt; J Research References; and separate learner/profile/state materials.

The behavioral requirements above preserve these sources' distinctions and boundaries. Their research classifications are source-provided, not a new independent literature review. Their example dialogues and numeric defaults are not mandatory scripts or scientific constants. Their private learner content must remain private unless explicitly authorized for publication.

### Official platform references consulted for capability boundaries

**O1 — OpenAI, Plugin Extensions:** https://developers.openai.com/plugins/build/extensions  
Documents sidebar, conversation-panel, file, composer-related, and other extension surfaces; availability differs by client and account.

**O2 — OpenAI, UI guidelines:** https://developers.openai.com/plugins/concepts/ui-guidelines  
Describes inline, fullscreen, and persistent picture-in-picture presentations and their relationship to the conversation.

**O3 — OpenAI, Add UI to your MCP server:** https://developers.openai.com/plugins/build/chatgpt-ui  
Documents interactive app actions, conversation context, message interactions, and the distinction between temporary view state and durable records.

**O4 — OpenAI, Managing app permissions in ChatGPT:** https://help.openai.com/en/articles/20001495-managing-app-permissions-in-chatgpt  
Explains that allowed actions depend on app capabilities, provider access, account settings, and workspace or safety restrictions.

**O5 — OpenAI, MCP Events; Connected apps in ChatGPT; Background mode:** https://developers.openai.com/plugins/build/mcp-events ; https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt ; https://developers.openai.com/api/docs/guides/background  
These describe distinct event, connected-app, and long-running-work capabilities. Their existence is not a guarantee of arbitrary unattended conversation continuation.

Platform references inform boundaries only. This PRD specifies product behavior, not an implementation recipe or a promise that every surface exists in every environment. The expanded workspace, feature coverage, privacy requirements, and acceptance scenarios are product judgments introduced in this revision.
