---
title: "Vendor Security Requirements (Send to Your Vendors)"
meta_title: "Vendor Security Requirements Template | KilPen Client Security Guides"
description: "A ready-to-send document that states the minimum security expectations your organization asks of vendors who handle your data — the vendor-facing companion to our Third-Party & Vendor Risk Management guide."
date: 2026-06-18T00:00:00Z
categories: ["Security Guides"]
author: "Chris"
tags: ["third-party-risk", "vendor-risk", "tprm", "vendor-requirements", "security", "template"]
draft: false
---

> **For our clients — how to use this page (do not send this box).** This is the **vendor-facing companion** to our [Third-Party & Vendor Risk Management guide](../third-party-risk-management/). The section below the line is written to be **sent directly to a vendor** that handles your data. Fill in the bracketed fields (`[…]`), delete this instruction box, and send it as an email, a PDF, or an attachment to a contract or statement of work. Send it to the vendors in your "crown-jewel" bucket — the ones that touch personal data, money, or your accounts. For large providers (Google, Microsoft, Stripe, etc.), expect them to answer by pointing you to their security/trust page rather than replying point by point; that's acceptable. KilPen can help you tailor or send this.

---

## Information Security Requirements for Vendors

**From:** [Your organization name]  
**To:** [Vendor name]  
**Date:** [Date]  
**Re:** Security expectations for handling our data

Thank you for working with us. We take the protection of the data entrusted to us — including the personal information of the people we serve — seriously, and we ask the same of the partners who handle it on our behalf. This document sets out the baseline security practices we expect from vendors who store, process, transmit, or can access our data or systems. None of it is unusual; it reflects widely accepted good practice.

We're sharing this early so expectations are clear from the start, and we're glad to discuss anything here that needs clarification for your service. Where we already have a contract or data processing agreement in place, those signed terms govern; this document describes the standard we work toward together.

### Who this applies to

These expectations apply if your organization (or any subcontractor you use) does any of the following with our data or systems: **stores it, processes it, transmits it, hosts it, or has login or administrative access to it.** If your service never touches our data or systems, most of this won't apply — just let us know.

### What we ask of you

1. **Multi-factor authentication (MFA).** Require MFA for access to any account or system that can reach our data, including your staff's administrative accounts. Where you offer single sign-on (SSO), please let us know so we can use it.

2. **Encryption.** Protect our data with encryption both **in transit** (e.g., TLS) and **at rest**.

3. **Breach notification.** Notify us **within 72 hours** of discovering any security incident or breach that affects, or may reasonably affect, our data — even if the investigation is still ongoing. Tell us what happened, what data was involved, and what you're doing about it.

4. **Least-privilege access.** Limit access to our data to the people who genuinely need it for your service, and **promptly remove access** for your staff or subcontractors when they leave or no longer need it.

5. **Subcontractor (subprocessor) transparency.** Tell us which other parties can access our data, and let us know **before** you add a new one that will handle it.

6. **Data return and deletion.** When our relationship ends, **return our data to us in a usable format and securely delete** your copies (including backups, on a reasonable schedule), and confirm in writing when deletion is complete.

7. **Data minimization.** Collect and retain only the data your service actually needs, and keep it only as long as necessary.

8. **Keep your systems patched.** Maintain reasonable, timely patching and vulnerability management for the systems that handle our data.

9. **Use of our data.** Use our data **only to provide the agreed service.** Do not sell it, share it, or use it for unrelated purposes. If your service uses artificial intelligence, **do not use our data to train AI models** without our explicit, written agreement.

10. **A named security contact.** Give us the name and email of someone we can reach with security or privacy questions, and for reporting or receiving notice of an incident.

11. **Legal compliance.** Handle our data in line with the privacy and data-protection laws that apply to it.

### How to respond

Please reply to confirm you can meet these expectations, and answer the five questions below. **If you already hold a current SOC 2 Type II report, ISO 27001 certification, or a similar independent assessment**, you're welcome to share it (or a link to your security/trust page) in place of answering items it already covers — just point us to the relevant part.

> 1. Do you require multi-factor authentication, and is our data encrypted both in transit and at rest?
> 2. Will you notify us within 72 hours of any breach involving our data?
> 3. Which other parties (subcontractors / subprocessors) can access our data?
> 4. How will we get our data back, and confirm it has been deleted, when we stop working together?
> 5. Do you have a SOC 2 report, ISO 27001 certification, or a security page we can review?

If anything here doesn't fit how your service works, tell us — we'd rather understand the difference than assume. Please send your response and any questions to **[your name and email]**.

We appreciate your partnership in keeping this data safe.

— [Your organization name]

---

*Prepared with guidance from KilPen Technical Services. This document states expectations and does not by itself create a contract; specific obligations are governed by your signed agreement or data processing terms.*
