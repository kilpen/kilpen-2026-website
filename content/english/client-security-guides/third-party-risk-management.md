---
title: "Third-Party & Vendor Risk Management"
meta_title: "Vendor Risk Management for Small Organizations & Nonprofits | KilPen Client Security Guides"
description: "A practical, low-budget guide to managing third-party and vendor risk — how to inventory vendors, assess the ones that matter, set minimum security expectations, and lock down the account access that causes most real breaches."
date: 2026-06-18T00:00:00Z
categories: ["Security Guides"]
author: "Chris"
tags: ["third-party-risk", "vendor-risk", "tprm", "nonprofit", "saas", "supply-chain", "security"]
draft: false
---

**Applies to:** Any small organization, nonprofit, or team that relies on outside vendors and SaaS tools — accounting software, a CRM or donor database, email and file storage, a payment processor, contractors, and the dozens of apps connected to them.  
**Audience:** Organizations with little or no dedicated IT/security staff and a limited budget, who still need to take reasonable, defensible care of the data their vendors touch — including donor, client, member, and financial data.

---

Every tool and contractor you rely on is a door into your organization. When a vendor is breached, your data can be exposed even if *you* did everything right — that's **third-party risk**. In 2025 there were a record number of publicly disclosed third-party breaches, and most of them cascaded: attackers compromised one widely-used app and reached hundreds of its customers through it.

You don't need an enterprise risk program to handle this well. You need to do a small number of high-leverage things consistently. This guide is built around that.

> **The 80/20 — read this even if you read nothing else.** Most of your third-party risk is controlled by **what you let into your accounts and who can still get in** — not by reading vendor audit reports. So: **turn on MFA everywhere, prune who and what can log into your accounts (employees, ex-vendors, and connected "Sign in with Google/Microsoft" apps), and never put sensitive data into a free tool.** That beats every vendor questionnaire you could send. Do the identity work first (Section 3); do vendor diligence only for the handful of vendors that touch your most sensitive data.

> **Don't let thoroughness become the failure mode.** The most common way this work fails in a small organization isn't doing it wrong — it's never finishing because it felt too big. This guide has a deliberate **stopping point** (Section 8). Aim to do the whole thing once, for the vendors that matter, then maintain it lightly.

---

## 1. Build a Vendor Inventory (Don't Start From a Blank Page)

You can't manage risk from vendors you've forgotten you have. The goal is one simple list — a spreadsheet is perfect. But don't try to remember every vendor; **pull the list from where the money and the logins already are**, which is far more honest than memory and also surfaces tools you didn't know staff signed up for ("shadow IT").

**Two sources auto-generate most of your inventory in under an hour:**

- **Your money trail** — accounting records, bank and credit-card statements, and your expense tool. Every recurring SaaS charge is a vendor. This catches the paid tools.
- **Your identity provider's connected-apps list** — in Google Workspace or Microsoft 365, the list of third-party apps connected to your accounts (Section 3). This catches the *free* tools and integrations that never show up on a bill.

**Capture these columns for each vendor:**

| Column | Why it matters |
|---|---|
| Vendor & service | What they are and what they do for you |
| Data it touches | The single most important column (see Section 2) |
| Relationship owner | The one person responsible for it internally |
| Login / integration method | Individual logins? A shared password? "Sign in with Google"? An API connection? |
| Contract / renewal date | Your natural trigger to re-review (Section 8) |

> **You will be surprised by your own list.** Most small organizations discover free tools holding real data, accounts tied to a former employee's personal email, and "temporary" integrations nobody turned off. Finding these is half the value of the exercise.

> **A spreadsheet is enough to start — but it can grow up.** A vendor list is really the beginning of a broader inventory of *everything your IT depends on*. KilPen uses a software tool called **iTop** to build a **Configuration Management Database (CMDB)** as part of formal **IT Service Management (ITSM)** — a central, living record of your vendors, systems, and how they connect, rather than a spreadsheet that drifts out of date. Inquire with your service provider whether this option is right for you.

---

## 2. Sort Vendors Into Two Buckets — Not Five Tiers

Enterprise programs sort vendors into many risk tiers. For a small team that's a trap: the act of debating "medium" vs. "low" stalls the whole project, and the lower tiers turn into spreadsheet columns nobody ever fills in. Use **one binary question** a normal person can answer:

> **Could this vendor's compromise expose our "crown jewels"?**
> That means: **donor / client / member personal data, money movement, or our email and identity (the accounts used to log into everything else).** Also include any vendor with **admin access into another critical system.**

- **Yes → the crown-jewel bucket.** These get real attention (Sections 4–6). Expect only **5–10 vendors** here.
- **No → logged and done.** A graphic designer with no access to your systems, a stock-photo subscription — inventory them and move on.

That's the whole model. The point of tiering is to spend your limited hours where a breach would actually hurt, and to give yourself explicit permission to *not* scrutinize the rest.

---

## 3. Harden Identity & Access First (Highest Leverage, Free)

This is the most important section in the guide. Most real-world small-org breaches don't come from a vendor failing an audit — they come from **an account that should have been locked down or shut off**: a shared login, a former employee or contractor who still has access, or a malicious app you granted permission to and forgot. All of the following is free and uses tools you already have.

### Turn On MFA Everywhere

Enable **multi-factor authentication** on every crown-jewel account, and enforce it organization-wide where the platform allows. Prefer an authenticator app or a hardware key over SMS. This single control stops the large majority of account-takeover attacks. (See our account-security guidance for details.)

### Kill Shared Logins and Personal-Email Accounts

Shared passwords can't be tracked, can't be revoked cleanly, and survive staff departures. Give people **individual accounts**, and use **single sign-on (SSO)** — "Sign in with Google/Microsoft" — wherever a vendor supports it, so that disabling one central account cuts off everything at once.

### Review and Prune Connected Apps (Your Free Fourth-Party Inventory)

When you click "Sign in with Google" or "Connect to Microsoft," you grant that app a token that can read your data — sometimes broadly. This is exactly how 2025's biggest supply-chain breaches spread: attackers stole the tokens of a trusted connected app and used them to reach its customers' data. **The good news: you can see and revoke every one of these grants yourself.**

- **Google Workspace:** Admin console → **Security → API controls → App access control** (and *Manage Third-Party App Access*). Review every connected app; remove what you don't recognize or no longer use.
- **Microsoft 365 / Entra:** **Enterprise applications** → review and revoke third-party app consents.

> **Set the door to "locked by default."** In Google Workspace, set third-party API access to **block unconfigured/unverified apps**, so a new app requires admin approval before it can connect. In Microsoft 365, restrict user consent so staff can't grant access to apps on their own. This one setting prevents an entire class of token-theft supply-chain attack — and it costs nothing.

### Remove Ex-Employee and Ex-Vendor Access

This is the offboarding control that small organizations skip most often — and retained access by a *former* vendor or employee has caused real, severe breaches. When a person leaves or a vendor relationship ends, **disable their accounts, revoke their API tokens and app connections, and confirm any shared credentials they knew are rotated.** Make it a step in your offboarding checklist, not an afterthought (Section 7).

---

## 4. Do Light Diligence — Only on the Crown-Jewel Bucket

For the 5–10 vendors that touch your most sensitive data, answer three things. Don't turn this into a research project.

**1. Does it support MFA and (ideally) SSO?** If a vendor holding sensitive data can't offer MFA, that is itself a serious mark against it.

**2. Read its trust center or SOC 2 report — but only for four things.** Many vendors publish a "trust center" or "security" page, or will send a **SOC 2 report** on request. A SOC 2 you can't interpret is a participation trophy, so don't try to read all 90 pages. Check only:

- Is it **Type II** (controls tested over time), not Type I (a single-day snapshot)?
- Is the **report date** recent — within about the last 12 months?
- Does the **scope** actually name the service you use (not a different product the company sells)?
- Are there **exceptions or qualifications** in the auditor's opinion? A wall of exceptions matters more than the logo on the cover.

> **A certification is not a guarantee.** "SOC 2" or "ISO 27001" on a web page tells you the vendor takes security seriously enough to invest in it — it does **not** prove your specific data is safe, and it doesn't replace turning on MFA and pruning access on *your* side. Treat it as one input, not a gold star.

**3. Confirm the security basics exist** — almost always already stated in the vendor's terms or Data Processing Agreement (DPA): **encryption in transit and at rest, a real breach-notification commitment, and a way to get your data back and have it deleted when you leave.** For a major vendor you'll read this in their standard DPA; you won't negotiate it (Section 6).

### When the Vendor Is Small or Local: The 5-Question Email

Big vendors publish this information; small vendors, contractors, and local agencies usually don't — so just ask. A short email beats a 100-question enterprise questionnaire that nobody will complete or read:

> 1. Do you offer multi-factor authentication, and is our data encrypted both in transit and at rest?
> 2. Will you notify us within 72 hours of any breach involving our data?
> 3. Who else (subprocessors / subcontractors) can access our data?
> 4. How do we get our data back, and confirm it's deleted, when we stop working together?
> 5. Do you have a SOC 2 report, or a security page we can read?

> **No answer is itself an answer.** If a vendor that holds your crown-jewel data won't respond to those five questions, that silence is a finding. Weigh switching vendors, and at minimum **write down that you asked and got nothing** — that record is your diligence trail for the board and your liability protection if something later goes wrong.

---

## 5. Set Minimum Vendor Expectations (Your Baseline)

These are the controls every crown-jewel vendor should meet. Use this as your internal yardstick when choosing tools and when sending the 5-question email:

- **MFA / SSO support** for all user access
- **Encryption** of your data in transit and at rest
- **Breach notification** to you within **72 hours** (24–72 hours is the common standard)
- **Data return and deletion** when the relationship ends
- **Subprocessor transparency** — they'll tell you who else touches your data
- **A named security/privacy contact** you can actually reach
- **No unnecessary data collection** — they take only what the service needs

> **Send these expectations to your vendors directly.** Our companion [Vendor Security Requirements](../vendor-security-requirements/) document states this baseline in a form you can fill in and send to a vendor as-is.

---

## 6. Contracts: *Select* the Big Ones, *Negotiate* the Small Ones

A common piece of TPRM advice — "negotiate strong security clauses into every contract" — is unrealistic for a small organization, and chasing it wastes hours. Split your vendors:

**Large, standardized vendors (Google, Microsoft, Salesforce, Stripe, your bank).** You have no leverage to change their terms, and you don't need it. Here you "negotiate" by **choosing**: pick a vendor whose standard DPA and published security posture already meet your baseline (Section 5), then accept their terms as-is. Read the DPA once so you know what you're getting; don't email a sales rep trying to rewrite it.

**Small vendors, contractors, and custom-app developers.** This is where you *do* have leverage — and where security is most often skipped. Put your expectations directly into the engagement email, statement of work, or simple contract:

- Breach notification within a set timeframe (e.g., 72 hours)
- A **right to request evidence** of their security practices (you don't need a full audit — just the ability to ask for proof)
- Disclosure of any subcontractors who will touch your data
- Return and deletion of your data when the work ends

---

## 7. Manage the Whole Lifecycle — Especially Offboarding

Risk doesn't end at signup. Three lightweight steps cover the lifecycle:

- **Onboarding:** Before a crown-jewel vendor goes live, run the Section 4 checks, set up individual logins with MFA/SSO, and grant only the access it actually needs.
- **In-life:** Keep the inventory current. When you add a new tool or connect a new integration, add a row.
- **Offboarding (the one everyone forgets):** When you stop using a vendor or a contractor leaves, **revoke their accounts and API/app tokens, rotate any shared credentials, export your data, and confirm in writing that they've deleted it.** A forgotten ex-vendor account that's still connected is a standing breach waiting to happen — this has caused major real-world incidents.

---

## 8. Stop — Then Maintain on Triggers, Not on a Calendar

You are **done** when you've inventoried your vendors, identified your 5–10 crown-jewel vendors, done light diligence on them, and hardened identity and access (Section 3). Resist the urge to keep going. After that, **maintain on triggers rather than re-reviewing everything every year** — fixed annual re-reviews of every vendor are busywork, because almost nothing changes and the spreadsheet just rots.

**Re-review a vendor only when:**

- Its **contract comes up for renewal**
- It has a **security incident or breach** (yours or theirs)
- The **data it touches changes** — it starts handling something more sensitive

**The one thing genuinely worth doing on a calendar** is a **30-minute annual access sweep**: re-run Section 3 — check MFA is still on everywhere, prune connected apps again, and confirm no former employees or vendors still have access.

---

## Special Lanes (Don't Treat These Like Ordinary Vendors)

A few categories carry outsized risk and deserve their own simple rules.

### Payment Processors & Anything That Moves Money

A compromise here means direct theft and fraud liability. The rules are bright-line:

- Use a **major, reputable processor** (Stripe, PayPal, your bank's platform) and **never store card numbers yourselves** — let the processor handle them. This also dramatically shrinks your PCI compliance burden.
- Turn on **MFA** for every admin account.
- **Lock down who can change payout/bank details.** A spoofed "please update our bank account" email is one of the most common — and costly — nonprofit fraud schemes. Require a second person to verbally confirm any change to where money is sent.

### AI Tools and "Free" Services

If a tool is **free and isn't a recognized nonprofit grant program, assume the product is your data** — that's how it's paid for.

- **Never put donor, client, member, or financial data into a free consumer-grade tool** — AI chatbots, free transcription services, free CRMs, file converters, and the like.
- For AI vendors specifically, check whether they **train their models on your inputs by default**, and whether there's a setting to turn that off (or a business/enterprise tier that contractually won't).

### Browser Extensions & Device App Sprawl

The browser where your donor database is open is itself a vendor surface. A browser extension can be granted permission to **read everything you type and every page you visit**.

- Review installed extensions on staff browsers; remove anything unrecognized or unnecessary.
- Be cautious about staff installing random apps on the same device that handles sensitive data.

---

## Fourth-Party & Concentration Risk (Worth Knowing)

Your vendors have vendors. The app you trust may rely on a sub-provider you've never heard of — and when **many of your tools quietly depend on the same underlying platform**, a single failure there can take down several of your services at once. You can't fully map this on a small budget, and you shouldn't try. Two practical moves cover most of it:

- **The connected-apps review in Section 3 *is* your fourth-party inventory** for the integration risk that matters most — it's auto-generated and free.
- **Ask the subprocessor question** (Section 4/5) of your crown-jewel vendors, and keep a mental note of where you're heavily concentrated, so you're not surprised when a big shared provider has an outage or breach.

---

## Quick Reference Checklist

| # | Action | Done when |
|---|---|---|
| 1 | Vendor inventory built from money trail + connected-apps list | One spreadsheet exists, with the "data it touches" column filled in |
| 2 | Vendors sorted into "crown jewels" vs. "everything else" | ~5–10 vendors flagged as crown-jewel |
| 3 | MFA on every crown-jewel account | Enforced org-wide where possible |
| 4 | Shared / personal-email logins eliminated | Individual accounts + SSO in use |
| 5 | Connected third-party apps reviewed and pruned | Unknown/unused grants revoked |
| 6 | New app connections locked behind admin approval | "Block unverified apps" / restricted consent set |
| 7 | Ex-employee and ex-vendor access removed | Offboarding step in place |
| 8 | Light diligence done on crown-jewel vendors | MFA confirmed, trust page / SOC 2 4-point check, basics verified |
| 9 | 5-question email sent to small/local crown-jewel vendors | Answers (or non-answers) recorded |
| 10 | Minimum-expectations baseline applied to vendor selection | Section 5 list used as the yardstick |
| 11 | Security terms in small-vendor contracts | Breach notice, evidence right, deletion clauses present |
| 12 | Payment / money-movement controls in place | No stored cards, MFA on, bank-change approval rule |
| 13 | "No free tools for sensitive data" rule communicated to staff | Staff know the bright line |
| 14 | Browser extensions reviewed | Unrecognized extensions removed |
| 15 | One-page summary delivered to leadership/board | Decision-makers have seen it |

---

## Periodic Maintenance

| Frequency | Task |
|---|---|
| On each new vendor/tool | Add a row to the inventory; if crown-jewel, run Section 4 checks before go-live |
| At contract renewal | Re-review that vendor against the baseline |
| On any incident | Re-review the affected vendor; revoke/rotate as needed |
| When a person or vendor leaves | Offboard: revoke accounts, tokens, and shared credentials (Section 7) |
| Annually (30 min) | Access sweep — re-confirm MFA, prune connected apps, remove stale access |

---

## A Board / Leadership One-Pager

For a nonprofit, the deliverable that makes this stick is a single page leadership can act on. Diligence that never reaches a decision-maker is wasted effort. Keep it to:

1. **Our crown-jewel vendors** (the 5–10 that hold our most sensitive data)
2. **Where we're solid** (MFA on, access cleaned up, basics confirmed)
3. **Open issues** (e.g., "Vendor X holds donor data and won't answer our security questions — recommend we switch")
4. **The recommendation and what we need** (a decision, a small budget, or a sign-off)

---

## If a Vendor Is Breached: Quick Response

1. **Find out what data of yours was involved** — ask the vendor directly and read their breach notice carefully.
2. **Rotate credentials and revoke tokens** tied to that vendor immediately — change shared passwords, revoke its API/app access, and reset any reused passwords.
3. **Turn on / verify MFA** on the affected accounts if it wasn't already.
4. **Check your legal obligations** — depending on the data (donor, client, health, payment), you may be required to notify affected individuals or regulators within a set timeframe.
5. **Document the timeline** — what you knew and when, and the steps you took. This protects the organization.
6. **Contact KilPen** — we can help you scope the impact, respond, and decide whether to keep or replace the vendor.

---

*This guide reflects best practices as of June 2026. Tooling and vendor terms change; the principles — inventory, focus on what touches sensitive data, harden your own access first, and set a clear minimum baseline — are durable. KilPen can help you run the first pass, configure your Google Workspace or Microsoft 365 connected-app controls, and produce the board one-pager.*
