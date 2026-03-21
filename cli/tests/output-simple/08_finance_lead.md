---
role: finance_lead
spec_version: "1.0"
generated_by: autospec v0.2.0
model: auto
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T10:26:49.397Z
---

role: Finance Lead
spec_version: "1.0"
generated_by: autospec
model: claude-opus-4-0-20250514
provider: anthropic
source_srs: TaskFlow SRS v1
source_hash: taskflow-srs-20260321
generated_at: "2026-03-21T00:00:00Z"
---

# 08 — Finance Lead Specification: TaskFlow

## Pricing Model

TaskFlow is an **open-source, solo-developer project** targeting individual professionals and students. The pricing model follows a **freemium + optional premium** approach, comparable to Todoist (free tier + $4/mo), TickTick ($2.79/mo), and Google Tasks (free). Given the single-user constraint and open-source nature, the monetization path relies on a hosted version with premium features, while the self-hosted version remains free.

### Tier Overview

| Tier | Price | Target Persona | Included Features | Usage Limits | Upsell Trigger |
|------|-------|----------------|-------------------|--------------|----------------|
| **Free (Self-Hosted)** | $0 | Amit (CS Student), privacy-focused users | Full Task CRUD, categories, dashboard, search/filter, PWA offline, email/password auth | Unlimited tasks, single user | N/A (open source) |
| **Free (Hosted)** | $0 | Amit (CS Student), casual users evaluating the product | Same as self-hosted, cloud-hosted | 100 active tasks, 5 categories, 30-day task history | Hitting task/category limit; "Upgrade" banner at 80% capacity |
| **Pro (Hosted)** | $3.99/mo or $39/yr (~18% annual discount) | Noa (Freelance UX Designer), power users | Unlimited tasks & categories, unlimited history, priority email support, automatic cloud backup, custom themes | Unlimited | Annual plan upsell at month 3 |
| **Lifetime** | $79 one-time | Early adopters, ProductHunt launch buyers | All Pro features, forever | Unlimited | Limited-time launch offer (first 500 users) |

### Pricing Rationale

- **$3.99/mo** undercuts Todoist Pro ($4/mo) and TickTick Premium ($2.79/mo billed annually), positioning TaskFlow as the affordable, no-bloat alternative.
- **Free hosted tier** with 100-task limit provides meaningful utility for students (Amit persona) while creating natural upsell pressure for professionals (Noa persona) who manage 50–200+ active tasks.
- **Lifetime deal** at $79 is equivalent to ~20 months of Pro — used as a launch acquisition tool to build early revenue and community.

---

## Revenue Model

### Revenue Streams

| Stream | Type | Recognition | Est. Mix (Month 12) |
|--------|------|-------------|---------------------|
| Pro Monthly Subscriptions | Recurring (MRR) | Recognized monthly, upon delivery | 45% |
| Pro Annual Subscriptions | Recurring (ARR) | Recognized monthly over 12-month period (deferred revenue) | 35% |
| Lifetime Deals | One-time | Recognized immediately (no ongoing obligation beyond hosting) | 15% |
| GitHub Sponsors / Donations | One-time / Recurring | Recognized upon receipt | 5% |

### Revenue Recognition Approach

- **Monthly subscriptions:** Revenue recognized in the month of service delivery.
- **Annual subscriptions:** Cash collected upfront; revenue recognized ratably at $3.25/mo over 12 months. Deferred revenue liability carried on balance sheet.
- **Lifetime deals:** Recognized immediately as one-time revenue. Infrastructure cost for lifetime users is carried as ongoing COGS.
- **Refund policy:** 14-day full refund on first subscription. No refunds on lifetime deals after 7 days.

---

## Unit Economics

### Assumptions

| Variable | Value | Basis |
|----------|-------|-------|
| Blended ARPU (monthly) | $3.50 | Weighted average: 60% monthly @ $3.99, 30% annual @ $3.25/mo, 10% lifetime amortized @ $2.50/mo over ~32 months |
| Gross Margin | 82% | Infrastructure cost ~$0.63/user/mo (see Cost Structure) |
| Monthly Churn Rate | 5.0% | Conservative for consumer SaaS; comparable tools see 3–7% |
| CAC (organic) | $2.50 | Per `07_marketing_lead.md`: content marketing, SEO, ProductHunt — primarily organic channels |
| CAC (paid) | $12.00 | Reddit ads, targeted dev community sponsorships |
| Blended CAC | $4.50 | 70% organic / 30% paid acquisition mix |

### LTV Calculation

LTV = ARPU × Gross Margin / Monthly Churn Rate
LTV = $3.50 × 0.82 / 0.05
LTV = $2.87 / 0.05
LTV = $57.40

### Key Ratios

| Metric | Value | Target Benchmark |
|--------|-------|-----------------|
| **LTV** | $57.40 | > $50 for consumer SaaS |
| **Blended CAC** | $4.50 | < $10 for self-serve |
| **LTV:CAC Ratio** | 12.8:1 | > 3:1 (healthy) |
| **Payback Period** | 1.6 months | < 12 months (excellent) |
| **Gross Margin** | 82% | > 70% (SaaS benchmark) |

### Payback Period Calculation

Payback Period = CAC / (ARPU × Gross Margin)
Payback Period = $4.50 / ($3.50 × 0.82)
Payback Period = $4.50 / $2.87
Payback Period = 1.57 months

### Churn Sensitivity Analysis

| Monthly Churn | LTV | LTV:CAC | Payback Period |
|---------------|-----|---------|----------------|
| 3% (optimistic) | $95.67 | 21.3:1 | 1.57 mo |
| 5% (base case) | $57.40 | 12.8:1 | 1.57 mo |
| 8% (pessimistic) | $35.88 | 8.0:1 | 1.57 mo |
| 12% (worst case) | $23.92 | 5.3:1 | 1.57 mo |

Even at 12% monthly churn, the LTV:CAC ratio exceeds 3:1 due to the low acquisition cost of organic channels.

---

## Cost Structure

### Monthly Cost Breakdown (at steady state, Month 6+)

| Category | Line Item | Monthly Cost | Notes |
|----------|-----------|-------------|-------|
| **Infrastructure** | VPS hosting (Hetzner CX31 or equivalent) | $15.00 | 4 vCPU, 8GB RAM — sufficient for SQLite + Express serving ~2,000 users |
| **Infrastructure** | Domain + DNS (Cloudflare) | $1.50 | ~$18/yr amortized |
| **Infrastructure** | SSL certificate (Let's Encrypt) | $0.00 | Free |
| **Infrastructure** | Backup storage (Hetzner Storage Box) | $5.00 | 100GB, daily SQLite snapshots per `04_db_architect.md` backup strategy |
| **Infrastructure** | CDN (Cloudflare Free) | $0.00 | Free tier sufficient for static PWA assets |
| **Infrastructure** | Monitoring (UptimeRobot + Sentry free) | $0.00 | Free tiers per `06_devops_lead.md` |
| **Infrastructure subtotal** | | **$21.50** | |
| **Tooling** | GitHub (free for open source) | $0.00 | Public repo |
| **Tooling** | GitHub Actions CI/CD | $0.00 | Free tier: 2,000 min/mo per `06_devops_lead.md` |
| **Tooling** | Email transactional (SendGrid) | $0.00 | Free tier: 100 emails/day — covers auth flows |
| **Tooling** | Analytics (Plausible) | $9.00 | Privacy-friendly, GDPR-compliant |
| **Tooling subtotal** | | **$9.00** | |
| **Third-Party APIs** | Stripe payment processing | ~2.9% + $0.30/txn | Variable; est. $25–50/mo at 200 paying users |
| **Third-Party APIs** | Email delivery (upgrade path) | $0.00 | SendGrid free covers auth emails at current scale |
| **Third-Party subtotal** | | **~$35.00** | Estimated at Month 6 |
| **Headcount** | Solo developer (opportunity cost) | $0.00 | Open-source project; founder's time not salaried in v1 |
| **Headcount** | Contract designer (occasional) | $50.00 | Amortized; $600/yr for periodic design work |
| **Headcount subtotal** | | **$50.00** | |
| **Marketing** | Reddit/dev community ads | $100.00 | Per `07_marketing_lead.md` budget alignment |
| **Marketing** | Content/blog hosting (included in VPS) | $0.00 | |
| **Marketing subtotal** | | **$100.00** | |
| **TOTAL MONTHLY** | | **~$215.50** | |

### Per-User Infrastructure Cost

At 200 paying users: $21.50 / 200 = $0.11/user/mo (infrastructure only)
At 200 paying users: $215.50 / 200 = $1.08/user/mo (fully loaded, excl. founder time)
Including Stripe fees: ~$0.63/user/mo marginal cost

### Cost Scaling Triggers

| User Count | Infrastructure Change | New Monthly Infra Cost |
|------------|----------------------|----------------------|
| 0–2,000 | Single VPS (CX31) | $15 |
| 2,000–10,000 | Upgrade VPS (CX41) + separate DB server | $45 |
| 10,000–50,000 | Migrate to PostgreSQL + managed hosting | $150 |
| 50,000+ | Kubernetes cluster or PaaS (Render/Railway) | $500+ |

---

## Revenue Projections

### Assumptions

- **Launch:** ProductHunt + Hacker News + Reddit (per `07_marketing_lead.md` Phase 2)
- **Monthly organic signups:** Start at 200, grow 20% MoM (content + SEO flywheel)
- **Paid acquisition:** Starts Month 3 at $100/mo budget
- **Free → Pro conversion rate:** 4% initially, improving to 6% by Month 12 (product maturity + upsell optimization)
- **Lifetime deal:** Available Months 1–3 only (launch window), 50 buyers total at $79
- **Monthly churn (paying users):** 5%
- **Annual plan adoption:** 25% of new Pro signups from Month 4+

### Month 1–12 Revenue Model

| Month | New Signups | Cumul. Free Users | Conv. Rate | New Paying | Churned | Cumul. Paying | Lifetime Deals | MRR | One-Time Rev | Total Monthly Rev | Cumul. Revenue |
|-------|-----------|-------------------|------------|-----------|---------|---------------|---------------|-----|-------------|-------------------|---------------|
| 1 | 500 | 500 | 4.0% | 20 | 0 | 20 | 25 | $80 | $1,975 | $2,055 | $2,055 |
| 2 | 300 | 780 | 4.0% | 12 | 1 | 31 | 15 | $124 | $1,185 | $1,309 | $3,364 |
| 3 | 360 | 1,108 | 4.0% | 14 | 2 | 43 | 10 | $172 | $790 | $962 | $4,326 |
| 4 | 432 | 1,492 | 4.5% | 19 | 2 | 60 | 0 | $239 | $0 | $239 | $4,565 |
| 5 | 518 | 1,943 | 4.5% | 23 | 3 | 80 | 0 | $319 | $0 | $319 | $4,884 |
| 6 | 622 | 2,473 | 5.0% | 31 | 4 | 107 | 0 | $427 | $0 | $427 | $5,311 |
| 7 | 746 | 3,093 | 5.0% | 37 | 5 | 139 | 0 | $555 | $0 | $555 | $5,866 |
| 8 | 895 | 3,822 | 5.0% | 45 | 7 | 177 | 0 | $706 | $0 | $706 | $6,572 |
| 9 | 1,074 | 4,681 | 5.5% | 59 | 9 | 227 | 0 | $905 | $0 | $905 | $7,477 |
| 10 | 1,289 | 5,693 | 5.5% | 71 | 11 | 287 | 0 | $1,145 | $0 | $1,145 | $8,622 |
| 11 | 1,547 | 6,883 | 6.0% | 93 | 14 | 366 | 0 | $1,460 | $0 | $1,460 | $10,082 |
| 12 | 1,856 | 8,288 | 6.0% | 111 | 18 | 459 | 0 | $1,831 | $0 | $1,831 | $11,913 |

**Key Metrics at Month 12:**
- **Total registered users:** 8,288
- **Paying subscribers:** 459
- **MRR:** $1,831
- **Run-rate ARR:** $21,972
- **Cumulative revenue (Year 1):** $11,913
- **Lifetime deal contribution:** $3,950 (33% of Year 1 total)

**Notes:**
- Month 1 includes ProductHunt launch spike (500 signups vs. 200 baseline).
- MRR = Cumulative Paying Users × $3.99 (simplified; blended ARPU used for LTV calculations).
- Churned users = 5% of previous month's paying users (rounded).
- Cumulative free users account for 20% inactive churn (users who abandon without converting).

---

## Break-Even Analysis

### Monthly Fixed Costs

| Item | Monthly Cost |
|------|-------------|
| Infrastructure | $21.50 |
| Tooling | $9.00 |
| Marketing | $100.00 |
| Design (amortized) | $50.00 |
| **Fixed total** | **$180.50** |

### Variable Costs

| Item | Per-User Monthly |
|------|-----------------|
| Stripe fees (2.9% + $0.30) | ~$0.42/user at $3.99 |
| Marginal infra | ~$0.05/user |
| **Variable total** | **~$0.47/user** |

### Break-Even Calculation

Contribution Margin per User = $3.99 - $0.47 = $3.52/user/mo
Break-even Users = Fixed Costs / Contribution Margin
Break-even Users = $180.50 / $3.52
Break-even Users = ~52 paying users
Break-even MRR = 52 × $3.99 = ~$207

### Break-Even Timeline

| Scenario | Paying Users Required | MRR Required | Expected Month |
|----------|----------------------|-------------|----------------|
| Cash-flow positive (incl. lifetime deals) | 20 | $80 + $1,975 one-time | Month 1 |
| Recurring break-even (MRR only) | 52 | $207 | Month 4–5 |
| Comfortable margin (2× costs) | 103 | $411 | Month 6–7 |
| Sustainable w/ part-time salary ($2K/mo) | 620 | $2,474 | Month 13+ |

**Sustainable break-even (MRR covers all costs):** **Month 5** — when 80 paying subscribers generate $319 MRR against ~$215 total monthly costs.

---

## Financial Milestones

### Bootstrapped Phase (Months 1–6)

TaskFlow is a solo-developer open-source project with zero external capital. Per `09_business_lead.md` strategic investment priorities, the focus is validating product-market fit before seeking funding.

| Milestone | Target | Key Metric | Target Month |
|-----------|--------|-----------|-------------|
| **M1: MVP Launch** | Ship on ProductHunt and Hacker News | 500+ signups, 20+ paying users | Month 1 |
| **M2: Recurring Break-Even** | MRR exceeds monthly operating costs | $207+ MRR, 52+ paying users | Month 5 |
| **M3: PMF Signal** | Monthly churn below 5%, conversion above 5% | Retention + conversion rates | Month 6 |

### Growth Phase (Months 7–12)

| Milestone | Target | Key Metric | Target Month |
|-----------|--------|-----------|-------------|
| **M4: $500 MRR** | Proves scalable recurring revenue | $500+ MRR | Month 7 |
| **M5: $1K MRR** | Indie sustainability milestone | $1,000+ MRR, ~250 paying users | Month 9–10 |
| **M6: 5K Users** | Community + SEO flywheel established | 5,000 registered users | Month 10 |

### Seed Funding Triggers (Month 12–18)

| Trigger | Threshold | Use of Funds |
|---------|-----------|-------------|
| **Seed-eligible** | $1,500+ MRR, 5,000+ users, <5% churn | $150K–$300K seed |
| **Primary use** | — | Full-time dev salary ($8K/mo), v2 team features, marketing scale |
| **Secondary use** | — | PostgreSQL migration, native mobile app, paid community manager |

### Series A Threshold (Month 24+)

| Metric | Threshold |
|--------|-----------|
| ARR | $500K+ |
| MoM growth | >15% sustained |
| Paying users | 10,000+ |
| Net revenue retention | >100% (expansion via team plans) |

### Burn Rate Targets

| Phase | Monthly Burn | Runway (if seed @ $200K) |
|-------|-------------|--------------------------|
| Bootstrapped (Mo 1–6) | $215/mo | N/A (self-funded) |
| Post-seed (Mo 7–12) | $10,000/mo | 20 months |
| Growth (Mo 13–18) | $20,000/mo | 10 months (offset by revenue) |

---

## Risk Factors

### Risk 1: Higher-Than-Expected Churn (Downside Scenario)

**Scenario:** Monthly churn at 8% instead of 5%. Users find TaskFlow too simple, switch to Todoist/Notion for richer features.

| Metric | Base Case (5% churn) | Downside (8% churn) | Delta |
|--------|---------------------|---------------------|-------|
| Month 12 paying users | 459 | 312 | -32% |
| Month 12 MRR | $1,831 | $1,245 | -32% |
| LTV | $57.40 | $35.88 | -37% |
| LTV:CAC | 12.8:1 | 8.0:1 | Still healthy |
| Break-even month (MRR) | Month 5 | Month 6 | +1 month |

**Mitigation:** Activation email sequences, in-app NPS at Day 7/30, streak features to build habits, data export to reduce switching friction.

### Risk 2: 50% Slower Growth (Downside Scenario)

**Scenario:** Signups grow at 10% MoM instead of 20%. SEO ranks slowly, ProductHunt launch underperforms.

| Metric | Base Case | 50% Slower | Delta |
|--------|-----------|-----------|-------|
| Month 12 total signups | 8,288 | 4,800 | -42% |
| Month 12 paying users | 459 | 245 | -47% |
| Month 12 MRR | $1,831 | $978 | -47% |
| $1K MRR milestone | Month 10 | Month 14 | +4 months |
| Recurring break-even | Month 5 | Month 7 | +2 months |

**Mitigation:** Increase paid budget to $200/mo from Month 2, pursue integration partnerships (Obsidian plugin, Raycast extension), cross-post on AlternativeTo/SaaSHub/BetaList.

### Risk 3: Infrastructure Cost Overruns

**Scenario:** Infra costs 3× higher due to heavy PWA sync traffic and storage growth.

| Metric | Base Case | 3× Infra | Delta |
|--------|-----------|----------|-------|
| Monthly infra | $21.50 | $64.50 | +$43 |
| Total monthly cost | $215.50 | $258.50 | +20% |
| Break-even users | 52 | 65 | +13 users |
| Gross margin | 82% | 76% | Still healthy |

**Mitigation:** PWA offline-first architecture per `03_frontend_lead.md` minimizes server requests; SQLite is storage-efficient; implement aggressive client-side caching and sync batching.

### Risk 4: Pricing Sensitivity

**Scenario:** $3.99/mo is too high for student segment (Amit persona). Conversion drops to 2%.

| Metric | Base Case (4–6%) | Low Conv (2%) | Delta |
|--------|------------------|--------------|-------|
| Month 12 paying users | 459 | 195 | -57% |
| Month 12 MRR | $1,831 | $778 | -57% |
| Year 1 total revenue | $11,913 | $6,850 | -42% |

**Mitigation:** Student discount ($1.99/mo with .edu verification), adjust free tier to 200 tasks, A/B test $2.99 vs. $3.99, offer extended 30-day trial.

### Risk 5: Upside Scenario

**Scenario:** ProductHunt #1 Product of the Day + viral HN post. 3× launch signups, 7% conversion.

| Metric | Base Case | Upside | Delta |
|--------|-----------|--------|-------|
| Month 1 signups | 500 | 1,500 | +200% |
| Month 12 signups | 8,288 | 18,000+ | +117% |
| Month 12 paying users | 459 | 1,100+ | +140% |
| Month 12 MRR | $1,831 | $4,389 | +140% |
| Run-rate ARR | $21,972 | $52,668 | Seed-ready |

**Actions:** Accelerate v2 planning (team features), raise seed round immediately, hire part-time community manager, upgrade infrastructure preemptively.

### Risk 6: Competitive Response

**Scenario:** Todoist or TickTick launch a free tier that matches TaskFlow's feature set. Google Tasks adds offline + categories.

**Impact:** Conversion rate drops 30–50%; growth slows significantly.

**Mitigation:** Double down on open-source differentiator (self-hosting, data ownership), build community moat, accelerate unique features (API access, integrations), emphasize privacy narrative per `07_marketing_lead.md` positioning.

---

## Open Questions

| # | Question | Decision Needed By | Impact | Owner |
|---|----------|-------------------|--------|-------|
| OQ-1 | Should lifetime deals extend beyond the launch window (Months 1–3)? | Month 3 | Too many lifetime users increase long-term COGS without recurring revenue | Finance Lead |
| OQ-2 | Is $3.99/mo the right price, or launch at $2.99 and raise later? | Pre-launch | Conversion rate, perceived value, price anchoring | Finance Lead + Product |
| OQ-3 | Task-limit vs. time-limit for free tier conversion? | Month 2 | Task limits create gradual pressure; time limits create urgency-based conversion | Product + Finance |
| OQ-4 | When to announce team/collab features (v2) pricing? | Month 6 | Expansion revenue path, net retention, competitive positioning | Business Lead |
| OQ-5 | Does GitHub Sponsors cannibalize Pro subscriptions? | Month 3 | Revenue mix — sponsors may donate $5/mo but skip Pro | Finance + Marketing |
| OQ-6 | SQLite → PostgreSQL migration trigger (user count threshold)? | Month 4 | Infrastructure cost step-change, engineering downtime | DevOps + Finance |
| OQ-7 | Should a $9.99/mo API/integration tier exist for developers? | Month 6 | New revenue stream vs. engineering cost for rate limiting and docs | Product + Finance |
| OQ-8 | At what MRR does hiring a part-time developer become justified? | Month 8 | Burn rate increase vs. feature velocity improvement | Finance + Business |

---

The specification covers all required sections with TaskFlow-specific financials:

- **4 pricing tiers** mapped to personas Noa and Amit from `01_product_manager.md`
- **LTV = $57.40** calculated as `$3.50 × 0.82 / 0.05` with full math shown
- **12-month revenue table** projecting to $1,831 MRR / $21,972 ARR run-rate
- **Break-even at 52 paying users** (~Month 5) on recurring revenue alone
- **Itemized cost structure** totaling $215.50/mo across infrastructure, tooling, headcount, marketing, and third-party APIs
- **6 risk scenarios** including the required 50% slower growth downside and an upside scenario
- **Cross-references** to `07_marketing_lead.md` (CAC), `09_business_lead.md` (strategy), `03_frontend_lead.md` (PWA costs), `04_db_architect.md` (backup), and `06_devops_lead.md` (CI/CD)