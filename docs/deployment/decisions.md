# Deferred deployment decisions

Deployment is on hold at the user's request. This file preserves prior choices for later revalidation, not current local prerequisites or authorization to provision resources. Active application choices are in the [technical index](../technical/decisions.md).

## Budget

The initial ceiling discussed was **$10–25/month total**, including infrastructure and paid research/media/generation. No increase or paid-plan upgrade is preauthorized. Earlier allocation at the $25 end:

| Item | Planning allowance |
| --- | --- |
| 2 GB Lightsail Linux/IPv4 host | $12/month advertised at selection |
| Limited disposable stage, storage/delivery, backups, registry/logs | $3 |
| Paid search/text/images/narration | $5 |
| Tax/fees/uncertainty reserve | $5 |

This is not a measured bill, a creation allowance, or proof of fit. Domain cost, regional terms, capacity, and actual full-story cost need accounting. Do not promise the whole arrangement at $10 or rely on temporary credits. Reprice before deployment.

## Prior selected topology

- Frankfurt `eu-central-1` for regional resources; global CloudFront delivery.
- One 2 GB Lightsail Linux VM with public IPv4, Docker Compose, Caddy HTTPS/reverse proxy, separate Next.js/Mastra/PostgreSQL-pgvector containers. Build images in CI, not on the small host; measure resource fit.
- PostgreSQL stays private to the application network. Self-manage host/database patching and accept the shared-host failure boundary and lack of HA.
- Separate AWS Organization management/billing, staging, and production accounts, with scoped non-root identities. Inspect the existing account structure; an IAM identity is not a separate account.
- Disposable stage VM in the stage account, same artifacts, independent credentials/data/volumes. Destroy it afterward; stopped Lightsail instances still bill. Bound lifetime and release unneeded static IPs.
- Private S3 for media/backups, CloudFront Origin Access Control. Private media needs authorized short-lived signed delivery; URL/cookie choice, expiry, and revocation window remain open.
- Managed Inngest Free was the capped-beta choice. At selection: 50,000 executions/month, five concurrent steps; runs/steps count. Recheck terms and measured usage; no paid upgrade is authorized.
- SES shared, usage-priced sending for verification/reset mail, with verified identity and production-access request if sandboxed. Stage uses safe recipients.

Railway was rejected; Fargate was proposed but not accepted. Neon and then RDS were superseded by the self-managed Lightsail database; R2 was superseded by S3/CloudFront. Do not resurrect those alternatives from historical research as current requirements. The lean topology omitted ECS, ALB, NAT gateway, Redis, separate vector service, dedicated generation host, and paid Inngest.

## Infrastructure and releases

- Terraform shared modules with separate environment/state, encrypted/versioned S3 state and native lockfile; review plans.
- GitHub Actions with environment-scoped AWS OIDC credentials. PR checks, isolated stage integration/browser checks, then promotion of the same images through an explicit production release action.
- Dedicated reviewed migration step after staging tests; verify backup health. Use backward-compatible add/migrate/remove changes, retaining old structures until old code/jobs no longer need them. Never migrate independently on every container startup.
- Retain the previous application images. Check startup, database connection, and a small user journey; roll back only when schema and active workflow versions remain compatible. Otherwise pause new creations and forward-fix.
- Do not automatically reverse migrations or restore an old backup over newer user data. Accept a brief single-host restart window.
- Exact artifacts/registry, repository-plan-specific release gates, migration locking/timeouts/backfills, and stage teardown automation remain unresolved.

## Backups and recovery

- pgBackRest with S3 repository: weekly full, daily incremental, and WAL archiving. Target seven days of recoverable history while preserving required base/WAL chains.
- Alert on backup/archive failure. Target at most 15 minutes of database data loss when archiving is healthy and service restoration within four hours after response starts—not a 24/7 incident-response promise.
- Demonstrate targets before launch; improve the process or explicitly revise missed objectives.
- Restore before launch and monthly into isolated temporary compute in the production account, within budget. Check database integrity, accounts, stories, and referenced media; disable email and paid generation. Record time, then destroy restored copies/compute.
- Keep production restore data out of ordinary stage. Reconcile workflows and uncertain provider charges before reopening generation after real recovery.
- Exact archive cadence, credentials/encryption, retention configuration, and restore automation remain unresolved.

## Runtime identity, secrets, and monitoring

- Parameter Store Standard SecureString separated by environment for provider/auth/signing secrets, loaded only by required server services. Keep secret values out of Git, images, browser bundles, logs, and Terraform state. KMS usage may bill; recheck terms.
- Dedicated scoped runtime IAM identity per environment, limited to required parameter paths, S3 prefixes, and SES sending. Protect the access key, rotate every 90 days, revoke on compromise. This was the pilot long-lived-key tradeoff; CI keeps OIDC. Do not assume EC2-style instance profiles on Lightsail; verify current support when resumed.
- Lightsail email alarms for status failures/sustained CPU and recovery notices, plus guest checks for RAM, free filesystem space, app/database, and backups. Included host metrics do not prove website availability. External endpoint monitoring and thresholds remain open within budget.
- Application log/trace policy remains in [security and cost](../technical/security-and-cost.md#diagnostics).

## Supporting research — historical

- [Production/staging assessment](production-readiness.md): earlier rationale, source links, and alternatives. References to T31 describe the former numbered workshop record and the topology preserved above.
- [AWS cost research](aws-cost-research.md): historical component comparisons, not a Frankfurt quote or a current action list.

## Primary references

[Lightsail pricing](https://aws.amazon.com/lightsail/pricing/), [FAQ](https://aws.amazon.com/lightsail/faq/), [Terraform state](https://developer.hashicorp.com/terraform/language/backend/s3), [GitHub OIDC](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws), [pgBackRest](https://pgbackrest.org/user-guide.html), [private media](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html), [Parameter Store pricing](https://aws.amazon.com/systems-manager/pricing/), [Lightsail IAM](https://docs.aws.amazon.com/lightsail/latest/userguide/security_iam_service-with-iam.html), [SES](https://aws.amazon.com/ses/pricing/), [Inngest pricing](https://www.inngest.com/pricing/).
