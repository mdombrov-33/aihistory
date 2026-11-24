# Deferred deployment

Read only when deployment resumes. Local development does not depend on AWS. The target design needs current pricing, capacity and operational verification before provisioning.

## Budget

Total operating budget is $10–25/month including infrastructure and paid research/media/generation. No increased spend or paid-plan upgrade is preauthorized. Reprice regional compute, disposable staging, storage/delivery, backups, mail, registry/logs, tax and generation together. A planning budget is not a measured bill or a per-learner creation allowance.

## Target topology

- Frankfurt regional resources with CloudFront delivery.
- A small Lightsail Linux host running Compose/Caddy, separate Next.js/Mastra/PostgreSQL-pgvector containers and a private database network. Build images in CI; measure memory/CPU/disk fit before launch. This accepts a single-host failure boundary and maintenance responsibility.
- Separate organization management/billing, staging and production accounts with scoped non-root identities. Inspect actual account structure before configuring it.
- Disposable isolated staging using the same artifacts with separate credentials/data/volumes. Bound its lifetime and destroy it after use; stopped instances still cost money.
- Private S3 media/backups, CloudFront Origin Access Control and authorized short-lived delivery for private assets.
- Managed Inngest within a verified free-tier capacity; recheck limits and consumption. No automatic paid upgrade.
- SES verification/reset mail with verified identity and production access as needed; safe stage recipients.

## Releases and recovery

Terraform uses shared modules, separate state/environments and encrypted/versioned S3 state with locking. CI uses environment-scoped AWS OIDC credentials. Check PRs, test stage, then explicitly promote the same images.

Run a dedicated reviewed migration step, with backward-compatible changes and verified backup health. Retain prior app images; roll back only when schema/workflow versions permit it. Recovery never overwrites newer production data with an old backup as a routine deployment action.

Use pgBackRest/S3 with weekly full, daily incremental and WAL archiving, preserving required chains for a seven-day recovery window. Target at most 15 minutes of database loss with healthy archiving and restoration within four hours after response starts; demonstrate those targets before launch. Restore before launch and monthly into isolated temporary compute, with mail and paid generation disabled. Check integrity and referenced assets, then destroy restored copies. Reconcile active jobs and uncertain charges before reopening generation.

## Identity and monitoring

Use environment-scoped Parameter Store SecureString secrets, loaded only by required services. Keep values out of Git, browser bundles, images, logs and Terraform state. Dedicated runtime IAM identities need narrow S3/parameter/SES access; protect/rotate keys and verify current Lightsail identity support. CI retains OIDC.

Monitor endpoint availability, host resources, app/database health and backup/archive failure. Host metrics alone do not establish site availability. Apply the [application diagnostics policy](../technical/security-and-cost.md#diagnostics).

## Before deployment

Resolve actual regional prices/resource fit, registry/artifacts, release permissions, migration locks/timeouts, signed-delivery expiry/revocation, backup encryption/credentials, restore/stage teardown automation and monitoring thresholds. Deployment remains separate from [local implementation](../implementation-plan.md).

## Primary references

[Lightsail pricing](https://aws.amazon.com/lightsail/pricing/), [Terraform state](https://developer.hashicorp.com/terraform/language/backend/s3), [GitHub OIDC](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws), [pgBackRest](https://pgbackrest.org/user-guide.html), [private delivery](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html), [Parameter Store](https://aws.amazon.com/systems-manager/pricing/), [Lightsail IAM](https://docs.aws.amazon.com/lightsail/latest/userguide/security_iam_service-with-iam.html), [SES](https://aws.amazon.com/ses/pricing/), [Inngest](https://www.inngest.com/pricing/).
