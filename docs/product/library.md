# Public library and community

## Discovery and story pages

Product direction below extends the working prepared frontend. Current local search, detail/player/source routes, device activity and explicit service previews are listed in [status](../status.md); public community services are not connected.

The public library is a discoverable collection, not merely a generation cache. Search and useful subject, question and duration filters help learners find experiences; time/place filters apply where the subject calls for them. Planned level/prerequisite facets require content-contract support; provide Latest and Highest rated views. Ratings and likes can aid discovery but never certify factual accuracy. Avoid dependence on manual curation of every item.

Offer existing stories before creating a new one. Match the learning question, scope and assumed knowledge. A shared topic or era alone does not make an item a good match. Make it clear when a result is an existing story versus a suggestion that needs a new creation.

Each public story has a stable information page. Its content direction includes a cinematic banner, accurate title and scope, chapter headings, approximate length, rating and comments, sources, related stories, and a report action. Mobile order begins with banner and concise premise, followed by Start/Resume; supporting sections follow below. The current frontend uses “story” and `/stories/[slug]`; final naming remains open.

Related stories and topic suggestions can appear in search, on story pages, and after chapters. Explain why a suggestion is related, keep in-player suggestions unobtrusive, and never expose private prompts. Recommendations can include deeper angles, earlier context, or another perspective, not only near-duplicates.

## Public sharing and quality signals

Personal creations are private by default. Sharing by link and submitting a story for public discovery are separate explicit actions. Public submission direction: require a complete story, accurate title/scope, sources, and automatic checks for broken sections, missing information, duplicates, and abusive material. No owner-operated curator queue or minimum rating is assumed.

Signed-in learners can leave written comments, rate, and like. Ratings use 1–5 stars across a few categories; candidate categories are Story & presentation, Interactivity, and Clarity & learning. Exact labels remain open. Likes mean appreciation and remain separate from ratings. Show sample counts; do not hide a story solely for low ratings.

Allow one rating and one removable like per account per public version. Comment authors can edit or delete their comments. Use automatic filtering and user reports; the product owner does not manually pre-approve every comment. Initial moderation is defined in [security and cost](../technical/security-and-cost.md#moderation-and-rate-limits); thresholds and report-handling details remain open.

Show publication date and material update history. Explain factual corrections or major scope changes; routine visual polish need not create a prominent notice. Keep versions identifiable and let learners choose whether to move to a corrected version.

## Accounts, progress, and bookmarks

Public browsing and playback do not require an account. An account supports cross-device progress and bookmarks, personal creations, ratings, and comments. Same-device progress should be available where practical without sign-in. Resume identifies the saved chapter/beat and waits for deliberate action before narration restarts.

Learners can place multiple bookmarks inside each story and return to exact moments. A separate Save action already keeps whole stories on the device. My space currently groups Your stories (visited and saved), Bookmarks and Your questions, with pagination. Account synchronization, personal trails and their final organization remain future work. Completion is marked at the closing recap, independently of whether sources are opened. Stories remain revisitable.

The detail page and player should make it intuitive whether a story is new, in progress, or finished. Do not make source-page visits the hidden completion rule. The current frontend distinguishes new, in-progress and finished stories; labels remain provisional. The [implementation handoff](../implementation-plan.md#current-frontend-handoff) records the remaining completion-trigger mismatch.

## Reporting and sensitive material

Provide distinct report reasons for factual/source concerns, broken content/interactions, and inappropriate public material. Anchor reports to the affected chapter or comment, confirm receipt, and keep the learner in place. Do not imply a correction is accepted before it has been checked. Detection and handling should not depend on a personal moderation queue for every submission.

When a story includes distressing material, show a concise context note on its detail page. Let learners proceed directly; offer text/lower-intensity presentation where practical. See [`experience.md`](experience.md) for the full content and visual direction.
