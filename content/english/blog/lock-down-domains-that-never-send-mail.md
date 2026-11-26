---
title: "Lock Down Domains That Never Send Mail"
meta_title: "Null MX, SPF and DMARC for Domains That Don't Send Mail"
description: "Extra and defensive domains that never send mail are easy to spoof. Check names with RDAP, add three DNS records (null MX, SPF, DMARC) and verify them with dig."
date: 2026-11-26T00:00:00Z
image: "/images/solutions/lock-down-domains-that-never-send-mail.png"
categories: ["How To"]
author: "Christopher"
tags: ["security", "dns", "email", "spf", "dmarc", "rdap", "cloudflare"]
draft: false
---

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="kilpen" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>

SKILL LEVEL:  Beginner to Intermediate.

Most organizations end up with more domains than they use for email. Some protect the brand (the `.org` when you use the `.com`, or a common misspelling). Others hold a campaign site or a parked name. And some exist only for technical reasons, like a separate "usercontent" domain for files that people upload to your web app.

Development teams sometimes ask us to register a usercontent domain next to their app's main domain. This article explains why that pattern exists, how to check whether a name is free before you buy it, and the three DNS records that stop anyone from sending convincing email "from" a domain that never sends mail.

{{< notice "info" >}}
This article is based on our work for clients. The command-line steps were written for a fresh Ubuntu 24.04 server, but any machine with `dig`, `curl` and `jq` will do. `example-usercontent.com` is a placeholder. Replace it with your own domain.
{{< /notice >}}

*Tested on Ubuntu 24.04 LTS with bind9-dnsutils 9.18.39, curl 8.5.0 and jq 1.7.1, November 2026.*

# What we're covering #
* Why apps serve uploaded files from a separate domain.
* Checking whether a domain is available with RDAP.
* The three-record lockdown: a null MX record, an SPF record that allows no senders, and a DMARC reject policy.
* Adding the records in Cloudflare and checking them with `dig`.

## Understand why uploaded files get their own domain ##
Big platforms serve user files from domains that look odd at first. Google uses `googleusercontent.com` and GitHub uses `githubusercontent.com`. This is deliberate. Google's security team described the approach in [Content hosting for the modern web](https://security.googleblog.com/2012/08/content-hosting-for-modern-web.html) and returned to it in [Securely hosting user data in modern web applications](https://web.dev/articles/securely-hosting-user-data).

The issue is that an uploaded file isn't always passive. An HTML or SVG file can contain script. If your app serves that file from its own domain, or from a subdomain such as `files.example.org`, browsers treat the script as part of your site:

* **On the same origin,** the script can call your app as the logged-in user and read the responses.
* **On a subdomain,** the script still counts as the same *site*. It receives cookies scoped to `example.org`, it can set cookies that your main app will later read, and `SameSite` cookie protection does nothing, because both addresses count as one site.

A separate *registrable* domain, such as `example-usercontent.com` next to `example.org`, is a different site as far as the browser is concerned. In Google's words, "any malicious content on exampleusercontent.com can't impact example.com."

There's one more step if each user or tenant gets their own subdomain (for example `alice.example-usercontent.com`). Browsers decide where one "site" ends by consulting the [Public Suffix List](https://publicsuffix.org/). If a domain is listed there, each of its subdomains is treated as a separate site, so one user's content can't reach another's. That's why `github.io` is on the list. Only the domain owner can [request an entry](https://publicsuffix.org/submit/), and the maintainers have requirements, so plan for it early.

A separate domain doesn't replace careful serving. The same web.dev article also recommends `Content-Disposition: attachment` for downloads, `X-Content-Type-Options: nosniff`, and a `Content-Security-Policy: sandbox` header for active content. Your developers should use those as well.

## Register in your organization's own accounts ##
This step isn't technical, but it matters. Register the domain in **your organization's** registrar account and host its DNS in **your organization's** DNS account. Don't let it end up in a developer's personal account or the agency's account. If developers need to change records, create a limited API token for that one zone. When the project ends or the agency changes, the domain stays with you.

## Check availability with RDAP ##
RDAP (Registration Data Access Protocol) is the structured, JSON-based replacement for WHOIS. The free [rdap.org](https://about.rdap.org/) service looks up which registry is responsible for a domain and redirects you there, so you need `curl -L` to follow the redirect.

First install the tools:

```bash
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y bind9-dnsutils curl jq
```

A registered domain returns HTTP 200 and a JSON record:

```bash
curl -sL -o /dev/null -w '%{http_code}\n' https://rdap.org/domain/example.com
curl -fsSL https://rdap.org/domain/example.com \
  | jq -r '.ldhName, (.status | join(", ")), (.events[] | "\(.eventAction): \(.eventDate)")'
```

The first command prints `200`. The second prints the domain name, its status flags and its registration and expiry dates. The output looks something like this (your dates will differ):

```text
200
EXAMPLE.COM
client delete prohibited, client transfer prohibited, client update prohibited
registration: <date>
expiration: <date>
last changed: <date>
last update of RDAP database: <date>
```

When a name isn't registered, the registry answers **404**:

```bash
name=this-name-is-probably-not-registered-8f3k2q.com
curl -sL -o /dev/null -w '%{http_code}\n' "https://rdap.org/domain/${name}"
```

There's one catch. rdap.org also returns 404 when it doesn't know an RDAP server for that top-level domain at all. So a 404 only means "not registered" if the top-level domain appears in IANA's [RDAP bootstrap file](https://data.iana.org/rdap/dns.json). You can check, for example for `.com`:

```bash
curl -fsSL https://data.iana.org/rdap/dns.json \
  | jq -r --arg tld com '.services[] | select(.[0] | index($tld)) | .[1][0]'
```

If that prints a URL, a 404 means the name is free. If it prints nothing, RDAP can't tell you, so use the registrar's search instead. Either way, the registrar's checkout has the final word. rdap.org also limits clients to about 10 requests every 10 seconds, so don't loop over a long list.

## Understand why a domain with no email needs email records ##
A domain with no mail records isn't "off". Mail servers still accept messages claiming to be from it, and with nothing published they have no policy telling them the mail is fake. That makes unused, parked and defensive domains good material for phishing: an invoice from a "billing" address at `example-usercontent.com` looks close enough to the real thing.

Three records tell the rest of the internet that this domain neither sends nor receives mail:

1. **Null MX ([RFC 7505](https://www.rfc-editor.org/rfc/rfc7505.html)).** An MX record with priority 0 and a single dot as the server means "this domain accepts no mail". Without any MX record, senders fall back to the domain's A/AAAA address (usually its web server). A null MX stops that, and RFC 7505 tells receiving servers they may reject mail whose sender domain has a null MX.
2. **SPF `v=spf1 -all`.** SPF lists the servers allowed to send for a domain. [`-all`](https://www.rfc-editor.org/rfc/rfc7208.html#section-5.1) with nothing in front of it means "none". Every message fails.
3. **DMARC `p=reject`.** DMARC tells receivers what to do when a message fails the checks. `reject` means "refuse it". Because the domain has no SPF-authorized servers and no DKIM keys, every message claiming to be from it fails. A DMARC policy also [covers subdomains](https://www.rfc-editor.org/rfc/rfc7489.html#section-6.3) unless you set a separate `sp=` value, so `anything.example-usercontent.com` is covered too.

In zone-file form, the three records are:

<!-- sandbox: skip -->
```text
example-usercontent.com.          MX   0 .
example-usercontent.com.          TXT  "v=spf1 -all"
_dmarc.example-usercontent.com.   TXT  "v=DMARC1; p=reject"
```

These records only cover email. Website records (A, AAAA, CNAME) can sit alongside them. If you want aggregate reports of who is trying to send as the domain, add `rua=mailto:` with an address you monitor to the DMARC record. If that address is at a different domain, that domain has to publish a record authorizing it to receive the reports. The UK government's [guidance for domains that don't send email](https://www.gov.uk/guidance/protect-domains-that-dont-send-email) uses the same three records and also adds an empty wildcard DKIM key (`*._domainkey` with `v=DKIM1; p=`). The UK guidance lists it as a fourth record to create. It's a cheap extra, but the three records above do the core work.

## Add the records in Cloudflare ##
**Only do this for domains that will never send or receive mail.** If the domain might send mail later (sign-in links or account emails from the app, for example), these records will cause that mail to be rejected. Change them first.

Before you start, delete any other MX or SPF records on the domain. A domain with a null MX must not publish any other MX record, and a domain may only have one SPF record. Registrars often add "parking" mail records to new domains, so check for these. The UK guidance notes that some DNS providers won't accept a null MX. If yours is one of them, add the SPF and DMARC records anyway. They do most of the anti-spoofing work.

Cloudflare's dashboard changes from time to time, but the steps look like this:

1. Log in, select your account, then the domain.
2. Go to **DNS → Records** and select **Add record**.
3. **Null MX:** Type `MX`, Name `@`, Mail server `.` (a single dot), Priority `0`. Save. If the dashboard won't accept `.`, skip the MX record and add the other two (see the note above).
4. **SPF:** Type `TXT`, Name `@`, Content `v=spf1 -all`. Save.
5. **DMARC:** Type `TXT`, Name `_dmarc`, Content `v=DMARC1; p=reject`. Save.

Cloudflare's **Email → DMARC Management** page ([docs](https://developers.cloudflare.com/dmarc-management/security-records/)) shows the email records you already have in one view, which is a good final check.

## Verify with dig ##
DNS changes on Cloudflare usually show up within minutes. `example.com`, the domain reserved for documentation, publishes exactly this lockdown, so you can try the commands on it right away:

```bash
dig +short MX example.com
dig +short TXT example.com
dig +short TXT _dmarc.example.com
```

The MX query returns `0 .` and one of the TXT records is `"v=spf1 -all"`. The TXT query may also return other records, such as site verification tokens. The third command returns example.com's DMARC policy, which includes `p=reject`. On a domain with no DMARC policy it returns nothing.

For your own domains, this small function runs all three checks and says what's missing:

```bash
check_nomail() {
  local d="$1"
  echo "== ${d}"
  local mx; mx=$(dig +short MX "$d" | tr '\n' ' ')
  echo "MX:    ${mx:-MISSING}"
  echo "SPF:   $(dig +short TXT "$d" | grep -i 'v=spf1' || echo 'MISSING')"
  echo "DMARC: $(dig +short TXT "_dmarc.$d" | grep -i 'v=DMARC1' || echo 'MISSING')"
}
check_nomail example.com
```

For a fully locked-down domain you want `MX: 0 .`, `SPF: "v=spf1 -all"` and a DMARC line containing `p=reject`. Run it for every domain you own, including the ones you forgot you registered:

<!-- sandbox: skip -->
```bash
for d in example-usercontent.com example.net example.org; do check_nomail "$d"; done
```

## Next steps ##
Make a list of every domain your organization owns. Your registrar's dashboard and last year's renewal invoices are good places to start. Mark which ones actually send mail, and lock down the rest. It takes three records per domain, and it's easy to redo whenever you register a new one.

For domains that *do* send mail, the job is to get SPF, DKIM and DMARC right for each service that sends as you. That's harder, and it's worth doing carefully. Our [Vendor Security Requirements](/client-security-guides/vendor-security-requirements/) guide covers what to ask of the vendors that send email for you.

# Need more help? #
Not sure how many domains you own, or who controls their DNS? Our [IT Operations](/it-ops/) service can take on this kind of housekeeping for small nonprofits, law firms and mission-driven organizations, and our [Technology Consulting](/technology-consulting/) service can help your developers plan how to host user uploads safely. [Contact us](/contact/) and we'll get right back to you.
