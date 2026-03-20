# SPEC: Finance Lead

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** Finance Team

---

## 1. Financial Overview

### Company Information

| Attribute | Value |
|-----------|-------|
| Company Name | {{COMPANY_NAME}} |
| Entity Type | {{ENTITY_TYPE}} |
| Tax ID | {{TAX_ID}} |
| Fiscal Year End | {{FISCAL_YEAR_END}} |
| Currency | {{PRIMARY_CURRENCY}} |

### Financial Summary

| Metric | Current | Target | Period |
|--------|---------|--------|--------|
| MRR | {{MRR}} | {{TARGET_MRR}} | Monthly |
| ARR | {{ARR}} | {{TARGET_ARR}} | Annual |
| Burn Rate | {{BURN_RATE}} | {{TARGET_BURN}} | Monthly |
| Runway | {{RUNWAY_MONTHS}} months | 18+ months | - |
| Gross Margin | {{GROSS_MARGIN}}% | {{TARGET_MARGIN}}% | - |

---

## 2. Revenue Model

### Pricing Structure

| Tier | Monthly | Annual | Features |
|------|---------|--------|----------|
| Free | $0 | $0 | {{FREE_FEATURES}} |
| {{TIER_1}} | ${{PRICE_1}}/mo | ${{ANNUAL_1}}/yr | {{TIER_1_FEATURES}} |
| {{TIER_2}} | ${{PRICE_2}}/mo | ${{ANNUAL_2}}/yr | {{TIER_2_FEATURES}} |
| {{TIER_3}} | Custom | Custom | {{TIER_3_FEATURES}} |

### Revenue Streams

| Stream | Description | % of Revenue |
|--------|-------------|--------------|
| Subscriptions | Recurring SaaS revenue | {{PERCENT}}% |
| Usage fees | Pay-per-use charges | {{PERCENT}}% |
| Professional services | Implementation, consulting | {{PERCENT}}% |
| Support add-ons | Premium support tiers | {{PERCENT}}% |

### Revenue Recognition

```
Method: {{REVENUE_RECOGNITION_METHOD}}
(e.g., Ratably over subscription period)

Policy:
- Monthly subscriptions: Recognized monthly
- Annual subscriptions: Recognized ratably over 12 months
- Professional services: Recognized upon delivery
- Refunds: Deferred revenue reversed
```

---

## 3. Unit Economics

### Key Metrics

| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| Customer Acquisition Cost (CAC) | ${{CAC}} | <${{CAC_BENCHMARK}} | {{STATUS}} |
| Lifetime Value (LTV) | ${{LTV}} | >3x CAC | {{STATUS}} |
| LTV/CAC Ratio | {{RATIO}} | >3.0 | {{STATUS}} |
| Payback Period | {{MONTHS}} months | <12 months | {{STATUS}} |
| Monthly Churn | {{CHURN}}% | <5% | {{STATUS}} |
| Net Revenue Retention | {{NRR}}% | >100% | {{STATUS}} |

### CAC Calculation

```
CAC = (Sales & Marketing Spend) / (New Customers Acquired)

Current Period:
- Marketing Spend: ${{MARKETING_SPEND}}
- Sales Spend: ${{SALES_SPEND}}
- New Customers: {{NEW_CUSTOMERS}}
- CAC: ${{CAC}}
```

### LTV Calculation

```
LTV = (ARPU × Gross Margin) / Monthly Churn Rate

Current:
- ARPU: ${{ARPU}}
- Gross Margin: {{GROSS_MARGIN}}%
- Monthly Churn: {{CHURN}}%
- LTV: ${{LTV}}
```

---

## 4. Budget & Forecast

### Annual Budget

| Category | Q1 | Q2 | Q3 | Q4 | Annual |
|----------|----|----|----|----|--------|
| **Revenue** | ${{Q1_REV}} | ${{Q2_REV}} | ${{Q3_REV}} | ${{Q4_REV}} | ${{ANNUAL_REV}} |
| **COGS** | ${{Q1_COGS}} | ${{Q2_COGS}} | ${{Q3_COGS}} | ${{Q4_COGS}} | ${{ANNUAL_COGS}} |
| **Gross Profit** | ${{Q1_GP}} | ${{Q2_GP}} | ${{Q3_GP}} | ${{Q4_GP}} | ${{ANNUAL_GP}} |
| **Operating Expenses** | | | | | |
| Engineering | ${{Q1_ENG}} | ${{Q2_ENG}} | ${{Q3_ENG}} | ${{Q4_ENG}} | ${{ANNUAL_ENG}} |
| Sales & Marketing | ${{Q1_SM}} | ${{Q2_SM}} | ${{Q3_SM}} | ${{Q4_SM}} | ${{ANNUAL_SM}} |
| G&A | ${{Q1_GA}} | ${{Q2_GA}} | ${{Q3_GA}} | ${{Q4_GA}} | ${{ANNUAL_GA}} |
| **Total OpEx** | ${{Q1_OPEX}} | ${{Q2_OPEX}} | ${{Q3_OPEX}} | ${{Q4_OPEX}} | ${{ANNUAL_OPEX}} |
| **Net Income** | ${{Q1_NI}} | ${{Q2_NI}} | ${{Q3_NI}} | ${{Q4_NI}} | ${{ANNUAL_NI}} |

### Monthly Burn Rate

```
Fixed Costs:
- Salaries & Benefits: ${{SALARIES}}
- Office & Equipment: ${{OFFICE}}
- Software & Tools: ${{SOFTWARE}}
- Insurance & Legal: ${{INSURANCE}}
- Total Fixed: ${{TOTAL_FIXED}}

Variable Costs:
- Cloud Infrastructure: ${{CLOUD}}
- Payment Processing: ${{PAYMENTS}}
- Marketing: ${{MARKETING}}
- Total Variable: ${{TOTAL_VARIABLE}}

Monthly Burn: ${{MONTHLY_BURN}}
```

---

## 5. Cost Structure

### Cost of Goods Sold (COGS)

| Item | Monthly Cost | % of Revenue |
|------|--------------|--------------|
| Cloud Infrastructure | ${{CLOUD_COST}} | {{PERCENT}}% |
| Third-party APIs | ${{API_COST}} | {{PERCENT}}% |
| Payment Processing | ${{PAYMENT_COST}} | {{PERCENT}}% |
| Customer Support | ${{SUPPORT_COST}} | {{PERCENT}}% |
| **Total COGS** | ${{TOTAL_COGS}} | {{COGS_PERCENT}}% |

### Operating Expenses

| Department | Monthly | % of Total |
|------------|---------|------------|
| Engineering | ${{ENG_SPEND}} | {{PERCENT}}% |
| Product | ${{PRODUCT_SPEND}} | {{PERCENT}}% |
| Sales | ${{SALES_SPEND}} | {{PERCENT}}% |
| Marketing | ${{MARKETING_SPEND}} | {{PERCENT}}% |
| Customer Success | ${{CS_SPEND}} | {{PERCENT}}% |
| G&A | ${{GA_SPEND}} | {{PERCENT}}% |
| **Total OpEx** | ${{TOTAL_OPEX}} | 100% |

### Headcount Budget

| Department | Current | EOY Target | Cost/Head |
|------------|---------|------------|-----------|
| Engineering | {{COUNT}} | {{TARGET}} | ${{COST}} |
| Product | {{COUNT}} | {{TARGET}} | ${{COST}} |
| Sales | {{COUNT}} | {{TARGET}} | ${{COST}} |
| Marketing | {{COUNT}} | {{TARGET}} | ${{COST}} |
| Support | {{COUNT}} | {{TARGET}} | ${{COST}} |
| G&A | {{COUNT}} | {{TARGET}} | ${{COST}} |
| **Total** | {{TOTAL_HC}} | {{TARGET_HC}} | - |

---

## 6. Funding & Capitalization

### Funding History

| Round | Date | Amount | Valuation | Lead Investor |
|-------|------|--------|-----------|---------------|
| Seed | {{DATE}} | ${{AMOUNT}} | ${{VAL}} | {{INVESTOR}} |
| Series A | {{DATE}} | ${{AMOUNT}} | ${{VAL}} | {{INVESTOR}} |
| Series B | {{DATE}} | ${{AMOUNT}} | ${{VAL}} | {{INVESTOR}} |

### Cap Table Summary

| Shareholder | Shares | % Ownership |
|-------------|--------|-------------|
| Founders | {{SHARES}} | {{PERCENT}}% |
| Employees (Options) | {{SHARES}} | {{PERCENT}}% |
| Seed Investors | {{SHARES}} | {{PERCENT}}% |
| Series A | {{SHARES}} | {{PERCENT}}% |
| Option Pool (Unallocated) | {{SHARES}} | {{PERCENT}}% |
| **Total** | {{TOTAL_SHARES}} | 100% |

### Cash Position

| Metric | Value |
|--------|-------|
| Current Cash | ${{CASH}} |
| Monthly Burn | ${{BURN}} |
| Runway | {{MONTHS}} months |
| Next Raise Target | ${{RAISE_TARGET}} |
| Target Close Date | {{DATE}} |

---

## 7. Payment & Billing

### Payment Processors

| Processor | Purpose | Fee Structure |
|-----------|---------|---------------|
| {{PROCESSOR_1}} | Subscriptions | {{FEES}} |
| {{PROCESSOR_2}} | Invoicing | {{FEES}} |

### Billing Cycles

| Plan Type | Billing | Payment Terms |
|-----------|---------|---------------|
| Monthly | Monthly | Due on subscription date |
| Annual | Annual (upfront) | Due on invoice |
| Enterprise | Quarterly/Annual | Net {{TERMS}} |

### Payment Methods Accepted

- [ ] Credit/Debit Cards (Visa, MC, Amex)
- [ ] ACH / Bank Transfer
- [ ] Wire Transfer
- [ ] PayPal
- [ ] Invoice (Enterprise only)

---

## 8. Financial Policies

### Expense Policy

| Category | Approval Required | Limit |
|----------|-------------------|-------|
| Software subscriptions | Manager | <${{LIMIT}}/mo |
| Travel | Manager | <${{LIMIT}}/trip |
| Equipment | Manager | <${{LIMIT}} |
| Contractors | Finance + Manager | Any |
| Large purchases | CEO | >${{LIMIT}} |

### Reimbursement

```
Process:
1. Submit receipt via {{EXPENSE_TOOL}}
2. Manager approval within 5 business days
3. Reimbursement processed bi-weekly
4. Paid via direct deposit
```

### Accounts Receivable

| Age | Action |
|-----|--------|
| Current | Standard payment reminder |
| 30 days | First collection notice |
| 60 days | Second notice, service review |
| 90 days | Final notice, service suspension |
| 120+ days | Collections / Write-off review |

### Accounts Payable

| Payment Type | Terms | Payment Day |
|--------------|-------|-------------|
| Payroll | Bi-weekly | {{PAY_DAY}} |
| Contractors | Net 30 | 15th of month |
| Vendors | Net 30 | End of month |
| Utilities | Upon receipt | Autopay |

---

## 9. Tax & Compliance

### Tax Obligations

| Tax Type | Jurisdiction | Frequency | Due Date |
|----------|--------------|-----------|----------|
| Income Tax | {{JURISDICTION}} | Quarterly | {{DUE}} |
| Sales Tax | {{STATES}} | Monthly | {{DUE}} |
| Payroll Tax | {{JURISDICTION}} | Bi-weekly | {{DUE}} |
| VAT (if applicable) | {{COUNTRIES}} | Quarterly | {{DUE}} |

### Sales Tax / VAT

```
Nexus States: {{NEXUS_STATES}}
Tax Rate Range: {{MIN_RATE}}% - {{MAX_RATE}}%
Exemptions: {{EXEMPTIONS}}
Provider: {{TAX_PROVIDER}}
```

### Compliance Requirements

- [ ] Annual audit (if required)
- [ ] 409A valuation (for equity grants)
- [ ] SOC 2 compliance (if applicable)
- [ ] PCI DSS (if handling card data)
- [ ] GAAP/IFRS compliance

---

## 10. Financial Reporting

### Monthly Reports

| Report | Audience | Delivery Date |
|--------|----------|---------------|
| P&L | Leadership | 5th of month |
| Cash Flow | Leadership | 5th of month |
| MRR Report | All Hands | 5th of month |
| Department Budgets | Managers | 10th of month |

### Board Reports

| Report | Frequency | Contents |
|--------|-----------|----------|
| Financial Package | Quarterly | P&L, Balance Sheet, Cash Flow |
| KPI Dashboard | Monthly | Revenue, Churn, CAC, LTV |
| Forecast Update | Quarterly | 12-month rolling forecast |
| Cap Table | As needed | Current ownership |

### Key Performance Indicators (KPIs)

```
Financial KPIs (Monthly):
- MRR / ARR
- Net Revenue Retention
- Gross Margin
- Burn Multiple
- CAC Payback Period

Operational KPIs:
- Revenue per Employee
- Sales Efficiency
- Magic Number
```

---

## 11. Risk Management

### Financial Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Revenue concentration | {{LIKELIHOOD}} | {{IMPACT}} | Diversify customer base |
| Currency exposure | {{LIKELIHOOD}} | {{IMPACT}} | Hedging, multi-currency |
| Churn spike | {{LIKELIHOOD}} | {{IMPACT}} | Retention programs |
| Funding gap | {{LIKELIHOOD}} | {{IMPACT}} | Runway monitoring, early raise |

### Insurance Coverage

| Type | Coverage | Provider |
|------|----------|----------|
| General Liability | ${{AMOUNT}} | {{PROVIDER}} |
| D&O Insurance | ${{AMOUNT}} | {{PROVIDER}} |
| Cyber Liability | ${{AMOUNT}} | {{PROVIDER}} |
| E&O Insurance | ${{AMOUNT}} | {{PROVIDER}} |

### Contingency Planning

```
Scenario: Revenue shortfall (20% below forecast)
Actions:
1. Freeze non-critical hiring
2. Reduce discretionary spend
3. Extend runway to 18+ months
4. Accelerate fundraising timeline
```

---

## 12. Tools & Systems

### Financial Technology Stack

| Function | Tool | Owner |
|----------|------|-------|
| Accounting | {{ACCOUNTING_TOOL}} | Finance |
| Billing/Subscriptions | {{BILLING_TOOL}} | Finance |
| Expense Management | {{EXPENSE_TOOL}} | Finance |
| Payroll | {{PAYROLL_TOOL}} | HR/Finance |
| Banking | {{BANK}} | Finance |
| Analytics | {{ANALYTICS_TOOL}} | Finance |

### Integration Map

```
{{BILLING_TOOL}} → {{ACCOUNTING_TOOL}}
       ↓
Payment Processor → Bank Account
       ↓
{{ANALYTICS_TOOL}} → Reporting Dashboard
```

---

*This spec is maintained by the Finance team. Last updated: {{DATE}}*
