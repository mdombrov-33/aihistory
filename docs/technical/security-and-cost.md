# Security and cost controls

Use for identity, authorization, untrusted content, moderation, request limits, and paid operations. Product access/offer requirements are in [account and offer](../product/account-and-offer.md); configuration details still open are listed in [technical questions](open-questions.md).

These are planned production guards. The current frontend has local guest state and explicit auth/service previews; it has no verified accounts, paid jobs, allowance ledger or public-write backend. [Status](../status.md) owns that boundary.

## Identity and access

- Better Auth inside Next.js with Drizzle/PostgreSQL accounts/sessions; Google sign-in plus email/password, verification, and password reset. Use library mechanisms rather than custom auth cryptography.
- Verify account identity, allowance, and budget server-side before new story creation or live follow-up answers. Question allowances are separate from creation slots; exact free/Premium quantities remain open.
- Public playback, sources, prepared explanations, and interactions remain account-free. Guests retain local progress/bookmarks; signed-in benefits follow product requirements.
- Apply one ownership/sharing policy across pages, APIs, jobs, search/recommendations, caches, and media—including local files. An ID alone does not grant private access.
- Link sharing uses a revocable token; public listing is a separate action. Exact token/session configuration remains open; hosted signed delivery is deferred.
- Provider credentials stay in backend integrations, outside browser bundles, model context, tracked files, images, and routine logs. Local secret configuration must not require AWS.

## Research boundary and source handling

- Expose narrow public-source search/read tools and evidence scoped to the current job. Research tools do not include shell execution, account/billing changes, or publication.
- Application code enforces tool/parameter permissions and time/call/retry/spending limits. Models cannot expand those limits or authorize themselves.
- Treat fetched pages, snippets, documents, and tool responses as untrusted evidence. Their instructions do not gain authority over the workflow.
- Keep the initial Tavily integration restricted to public HTTP(S) source inputs; our input checks do not establish the provider's internal fetch behavior.
- Any future direct fetcher must validate resolved public destinations/redirects, block local/private/link-local/metadata addresses, and bound time/response size. Render source material as escaped text/controlled formatting, not executable source HTML.

## Moderation and rate limits

- Initially screen comments before publication and stories before listing with OpenAI `omni-moderation-latest` for text/images. Recheck current API terms/rate limits before live use.
- Use context-sensitive policy: educational discussion of war/atrocities is not rejected merely for mentioning violence. Ambiguous flags may receive a bounded contextual check; unresolved submissions get reasons and a revision path rather than routine owner pre-approval.
- Abuse screening does not check historical truth or citation support. Thresholds, failure handling, and report processing remain open.
- Use atomic PostgreSQL counters with operation-specific limits for auth emails, creation, live questions, comments, ratings, reports, and embedding-backed search. Use account identity and additional trusted-IP controls for guest endpoints.
- Return structured limited responses with retry time. Choose finite thresholds and test normal usage, including polling; request limits, allowances, and monetary caps are separate safeguards.

## Spending and allowances

- Each creation submission has a unique request ID scoped to its identity, enforced in PostgreSQL. Double submission, refresh, and connection retry return the existing job. The same ID with different inputs must not silently mutate it.
- Before a paid operation, transactionally reserve a conservative bounded estimate against story and monthly generation budgets. Parallel jobs cannot allocate the same balance; retries require budget too.
- Reconcile against actual usage. Keep uncertain charges reserved after timeouts until checked. Application caps do not guarantee provider invoice totals or cap infrastructure bills; never interpret an uncertain call as free.
- Reserve a user's creation slot at job start; consume only after complete delivery checks. Release failed/incomplete jobs only once definitively stopped; retrying the same job does not consume another slot.
- Incurred provider cost remains in the monetary ledger even if a user slot is released. Bound failure retries. Cancellation/refund treatment and exact monetary/question limits remain open before enabling the affected live behavior.
- Matching public stories are discovered through authorized retrieval. Private requests remain separate; cross-user similarity does not grant access or justify silently sharing private work.
- The earlier total operating budget remains a constraint in [deferred deployment](../deployment/decisions.md#budget); this document does not authorize paid resources or unlimited local API use.

## Diagnostics

Use JSON operational logs with request/job IDs, stage, error code, timing, and usage. Exclude passwords, keys, cookies, and full private prompts. Cap size and retain at most seven days initially; this is a maximum, not guaranteed history under volume caps. Keep evidence/content/spending retention independent of log cleanup. Detailed private traces need their own restricted storage/retention policy before live use.

## Primary references

[Better Auth](https://better-auth.com/docs/introduction), [Drizzle adapter](https://better-auth.com/docs/adapters/drizzle), [moderation](https://developers.openai.com/api/docs/guides/moderation), [OWASP agent security](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html), [prompt injection](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html), [SSRF prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).
