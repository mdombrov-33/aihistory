# AWS operating-cost research — deferred

Checked **2026-11-21** against official sources. **Deployment is on hold.** This is historical research, not an active implementation requirement or an accepted deployment design. Prior choices are preserved in [deferred deployment decisions](decisions.md); the active phase is [local application implementation](../technical/decisions.md). T24 selected RDS after Neon; T31 later replaced RDS with Lightsail/self-managed PostgreSQL. Dollar examples use **US East (N. Virginia), `us-east-1`**, except the explicitly labeled Ohio NAT example, with 730 hours/month and on-demand pricing before tax and credits. These examples are not Frankfurt deployment quotes or complete application costs.

## What matters for this product

**The database is not automatically the largest expense.** At very low traffic, provisioned resources and networking determine the idle bill. With substantial story creation, paid research, models, images, and narration may dominate instead. Compare the whole deployment, including staging, rather than optimizing one database line.

The $10–25/month target covers both infrastructure and generation. It is not established that an AWS deployment with independent staging, PostgreSQL, backups, SSR Next.js, workers, and paid creation fits that target. A highly available container deployment has a different cost floor from a small beta with explicit availability compromises.

## Database comparison

| Option | Bill and behavior | Planning implication |
| --- | --- | --- |
| RDS PostgreSQL, Single-AZ | Instance time, allocated storage, backup/snapshot storage, and applicable transfer; burstable T3/T4g instances can incur surplus CPU-credit charges. | Quote an exact instance class and storage configuration in the chosen region. Do not treat its compute price as its complete price. Single-AZ lacks a standby failover target. |
| RDS PostgreSQL, Multi-AZ | Adds a standby in another Availability Zone; a different deployment option has two readable standbys. | Quote the selected topology separately. Do not reuse a Single-AZ estimate for HA. |
| Aurora PostgreSQL Serverless with auto-pause | Supported engine versions can pause at zero ACUs. Compute stops billing while paused; storage and other charges remain. Persistent connections and RDS Proxy can prevent pausing. | Relevant for intermittent staging and possibly a cold-start-tolerant beta. It does not mean an always-used database costs almost nothing. |

Sources: [RDS PostgreSQL pricing](https://aws.amazon.com/rds/postgresql/pricing/), [Aurora auto-pause documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).

AWS's N. Virginia Aurora Standard example uses **$0.12/ACU-hour**. At that rate, a database remaining at 0.5 ACUs for 730 hours costs **$43.80 in compute alone**; 100 hours at 0.5 ACUs would cost $6 before storage, I/O, backups, and other services. These are arithmetic scenarios, not measured usage. The pricing page's example still describes a 0.5 minimum; the newer auto-pause documentation explicitly supports zero on eligible versions. [Aurora pricing](https://aws.amazon.com/rds/aurora/pricing/).

Auto-pause has a minimum idle interval of five minutes. Typical resume is around 15 seconds; after extended sleep it can take 30 seconds or more. Scheduled checks, connections, and real traffic affect actual savings. [Auto-pause prerequisites and behavior](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).

RDS instances can be stopped temporarily, but restart automatically after seven days and continue accruing storage/backup charges while stopped. That is not indefinite serverless suspension. [RDS stopping behavior](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html).

Both database families support pgvector, subject to engine/extension versions. A separate vector service is not inherently required by the accepted retrieval direction. [RDS extension matrix](https://docs.aws.amazon.com/AmazonRDS/latest/PostgreSQLReleaseNotes/postgresql-extensions.html), [Aurora pgvector support](https://docs.aws.amazon.com/rds/latest/auroraextendedcontent/aurora-faq-agentic-ai.html).

No current region-and-class RDS instance rate was established in this research; do not substitute a remembered rate. The later T24 RDS choice was subsequently superseded by T31; both deployment history and future repricing are deferred.

## Compute and networking must be priced together

**The course's App Runner path is no longer a fresh-account default.** AWS closed App Runner to new customers on April 30, 2026. Existing customers can continue using it, including creating resources; AWS plans no new features. Its recommended alternative, ECS Express Mode, creates Fargate, an ALB, autoscaling, and networking in the account. Those resources retain their own charges. [App Runner availability change](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html), [dated closure notice](https://aws.amazon.com/apprunner/).

For an existing eligible account, App Runner bills provisioned memory even while idle: its smallest advertised 0.5 GB configuration implies about $2.56/month idle memory per service, plus active CPU and other charges. This does not establish that this configuration can run the application. App Runner's VPC connector routes application outbound traffic through the VPC; accessing external model/research APIs then needs an internet egress path. [App Runner pricing](https://aws.amazon.com/apprunner/pricing/), [VPC connector behavior](https://docs.aws.amazon.com/apprunner/latest/dg/network-vpc.html).

Ordinary on-demand **Lambda Event Functions** charge for requests and allocated-memory execution duration, with a published monthly free allowance. They avoid an always-running application container floor, but API/CDN, logs, database, and network charges remain separate. Durable generation must use bounded steps and external-job polling/callbacks rather than one invocation for an entire story. Current AWS pricing lists multiple Lambda products with different billing. AWS's timeout configuration and general quotas pages currently differ on maximum duration (15 versus 30 minutes, with further distinctions for managed instances); verify the exact selected runtime/account limit rather than assuming one universal value. [Lambda pricing](https://aws.amazon.com/lambda/pricing/), [timeout configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html), [Lambda quotas](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html).

Lambda attached to a private RDS VPC does **not** gain internet access by selecting a public subnet. IPv4 internet access normally needs NAT or another deliberately designed egress path. Thus a low Lambda execution bill can coexist with a substantial networking bill. [VPC-connected Lambda internet access](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html).

| Illustrative component and region | 730-hour baseline | Excluded costs |
| --- | --- | --- |
| One Linux/x86 Fargate task, 0.25 vCPU + 0.5 GB, N. Virginia | About **$9.01** using AWS's per-second example rates | ALB, public IPs/NAT, database, logs, images/builds, transfer; sizing is unverified |
| One ALB, N. Virginia | **$16.43** at $0.0225/hour | LCU usage and applicable public IPv4/transfer |
| One standard zonal NAT gateway, **Ohio (`us-east-2`)** | **$32.85** at $0.045/hour | $0.045/GB processing, public IPv4, and applicable transfer |
| One billable public IPv4 address (AWS standard rate) | **$3.65** at $0.005/hour | Service resource charges |
| One interface endpoint in one AZ, N. Virginia example | **$7.30** at the documented $0.01/hour example | Data processing; multiply by endpoints and AZs |

Sources: [Fargate N. Virginia examples](https://aws.amazon.com/fargate/pricing/), [ALB pricing](https://aws.amazon.com/elasticloadbalancing/pricing/), [VPC NAT and IPv4 pricing](https://aws.amazon.com/vpc/pricing/), [PrivateLink pricing](https://aws.amazon.com/privatelink/pricing/).

A single tiny task plus ALB is already about **$25.44/month before database, networking extras, staging, or AI usage**. Private tasks with NAT add a larger baseline. These calculations show why blaming the database alone is misleading. Larger task sizes and additional worker services increase the bill.

NAT is not mandatory for every container design: Fargate public-subnet tasks with public IPs can reach the internet while reaching a database privately within the VPC. This is an architecture option requiring explicit ingress controls, not permission to expose PostgreSQL. Interface endpoints reach their supported services; they do not generally replace internet access to arbitrary external model, research, or R2 endpoints. [ECS outbound networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/networking-outbound.html), [PrivateLink scope](https://aws.amazon.com/privatelink/pricing/).

A lower-idle-cost candidate is serverless web/step compute plus Aurora Data API: AWS documents database access without attaching Lambda to the database VPC. Evaluate Drizzle, pgvector queries, transaction/payload limits, supported regions, and Mastra/Inngest integration before choosing it. Data API and Secrets Manager have separate charges. This route can avoid one reason for NAT, but does not prove the total fits $25. [Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html), [Data API pricing](https://aws.amazon.com/rds/aurora/pricing/).

## Staging, operations, and spending

A real staging environment can use the same deployment definitions and release process while running smaller or pausing when idle. Separately price its database/storage, secrets, logs, service instances, endpoints, and any load balancer. Distinct environments do not necessarily require duplicating every network resource; sharing decisions need explicit isolation and failure-boundary review. Avoid uncontrolled paid generation in staging; use fixtures by default and a bounded live-provider check when needed. These are planning recommendations, not selected topology.

A small starter can accept one application replica, a Single-AZ database, documented recovery, and some wake-up delay. HA adds redundant application/database capacity and, where selected, egress per AZ. Backups and tested restoration matter in both cases; backups do not create an HA failover target. Source for database topology: [RDS deployment options](https://aws.amazon.com/rds/postgresql/pricing/).

Budget beyond core compute: [CloudWatch ingestion/retention and queries](https://aws.amazon.com/cloudwatch/pricing/), [Secrets Manager](https://aws.amazon.com/secrets-manager/pricing/), container registry/build/CI usage, DNS/domain, CDN/API traffic, transfer, and retained snapshots. For external R2/Inngest/Neon services, retain their separate billing lines if selected; AWS hosting does not absorb them.

Track two distinct totals: infrastructure, and paid creation/research/media. Set a per-story maximum, bounded retries/concurrency, reconciliation for interrupted paid jobs, and a monthly application creation allowance. Do not infer a story allowance from hosting cost. Workflow free quotas do not pay provider bills. Application model defaults are now selected, but measured full-story usage remains unavailable; this historical research is not a live AI-cost quote.

Free offers should appear as temporary offsets, not the steady-state architecture price. AWS's current billing documentation distinguishes new-account credits ($100 initially, up to $100 earned) and a Free account plan lasting up to six months; legacy eligibility differs. Verify account age and service eligibility. The RDS pricing page's broad one-year free-tier wording is not sufficient evidence that this particular account qualifies. [AWS Billing free-tier rules](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html), [legacy/new-account transition](https://aws.amazon.com/blogs/aws/aws-free-tier-update-new-customers-can-get-started-and-explore-aws-with-up-to-200-in-credits/).
