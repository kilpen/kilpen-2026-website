---
title: "Windows Security Best Practices"
meta_title: "Windows Security Best Practices | KilPen Client Security Guides"
description: "A complete guide to securing Windows 11 without domain join or management agents — covering BitLocker, Defender, firewall, privacy, Recall, and more."
date: 2026-06-16T00:00:00Z
categories: ["Security Guides"]
author: "Chris"
tags: ["windows", "windows-11", "security", "bitlocker", "defender", "privacy"]
draft: false
---

**Applies to:** Windows 11 (version 23H2 and 24H2). Most steps also apply to Windows 10, though menu paths differ and Windows 10 reached end of support in October 2025.  
**Audience:** Individual users and small teams who want strong security using built-in Windows tools — no domain join, MDM, or management agents required

---

This guide walks through the most important security settings available natively in Windows 11. Everything here uses built-in Windows features — no third-party management agents or enterprise infrastructure required.

Work through each section in order. Some settings differ between **Windows 11 Home** and **Windows 11 Pro**; those differences are called out where they matter. Most steps use the **Settings** app or **Windows Security**.

> **Edition check:** To see your edition, go to **Settings → System → About**. BitLocker, Group Policy, and some advanced controls require **Pro**, **Enterprise**, or **Education**. Home users have equivalent (if simpler) protections noted throughout.

---

## 1. Keep Windows Up to Date

Unpatched vulnerabilities are the leading cause of Windows compromise. Microsoft ships security fixes on the second Tuesday of each month ("Patch Tuesday"), plus out-of-band patches for critical issues.

**Steps:**
1. Open **Settings → Windows Update**
2. Click **Check for updates** and install everything offered
3. Turn on **Get the latest updates as soon as they're available**
4. Under **Advanced options**, enable **Get updates for other Microsoft products** (this patches Office and other Microsoft software)

> **Note:** Windows 10 reached end of support on October 14, 2025. If you are still on Windows 10, plan an upgrade to Windows 11 or enroll in Extended Security Updates (ESU) — an unsupported OS receives no security patches.

---

## 2. User Accounts

### Use a Standard Account for Daily Work

Running day-to-day as an administrator lets any malware you encounter run with full system privileges. Use a Standard account for everyday work and a separate Administrator account only when you need to install software or change system settings.

**Steps:**
1. **Settings → Accounts → Other users**
2. Add a user, then change the everyday account's type to **Standard user**
3. Keep one Administrator account with a strong, separate password

### Keep User Account Control (UAC) On

UAC prompts for consent before changes that require administrator rights. Leave it at the default level or higher.

1. Search the Start menu for **Change User Account Control settings**
2. Set the slider to **Always notify** (most secure) or leave at the default (second from top)

### The Built-in Administrator and Guest Accounts

The hidden built-in Administrator account should stay disabled (it is disabled by default — do not enable it). The legacy Guest account is also disabled by default and should remain so.

---

## 3. Sign-In Security: Windows Hello & Screen Lock

### Use Windows Hello

Windows Hello lets you sign in with a PIN, fingerprint, or facial recognition. The PIN is tied to this specific device (and the TPM hardware), so it cannot be reused elsewhere even if stolen — making it safer than a reusable password for local sign-in.

1. **Settings → Accounts → Sign-in options**
2. Set up **Windows Hello PIN** (always available), plus **Fingerprint** or **Facial recognition** if your hardware supports it
3. Use a PIN of at least 6 digits; longer is better

### Require Sign-In on Wake and Lock Automatically

1. **Settings → Accounts → Sign-in options → If you've been away, when should Windows require you to sign in again?** → set to **When PC wakes up from sleep**
2. **Settings → System → Power & battery → Screen and sleep** → set the screen to turn off after 5–10 minutes of inactivity, so the device locks when unattended
3. Lock instantly any time you step away with **Windows + L**

### Account Lockout

To slow password-guessing, Windows can lock an account after several failed sign-in attempts. **Clean installs of Windows 11 (22H2 and later) enable this by default** — 10 failed attempts triggers a 10-minute lockout — and it applies to Home and Pro alike.

**Important:** PCs that were *upgraded* from Windows 10 or an older build often do **not** have this enabled. To check and set it:

- **Any edition (Home or Pro):** open an elevated Command Prompt and run
  `net accounts /lockoutthreshold:10 /lockoutduration:10 /lockoutwindow:10`
- **Pro/Enterprise:** alternatively configure it in **Local Security Policy** (`secpol.msc`) → Account Policies → Account Lockout Policy

---

## 4. Disk Encryption (BitLocker / Device Encryption)

Disk encryption ensures that if your device is lost or stolen, the data on the drive cannot be read by removing the disk or booting another OS. **Which feature you get depends on your edition.**

### Windows 11 Pro, Enterprise, Education — BitLocker

1. Open **Control Panel → System and Security → BitLocker Drive Encryption** (or search "BitLocker")
2. Click **Turn on BitLocker** for your system drive
3. **Back up your recovery key** — save it to your Microsoft account, a printed copy, or a file stored on a *different* device. If you lose it and the TPM state changes, your data is unrecoverable.
4. Encrypt additional internal and removable drives the same way

> **Stronger option:** TPM-only BitLocker can be vulnerable to sophisticated physical attacks. For high-risk users, add a startup PIN (**require a PIN at every boot**) via Group Policy or `manage-bde`. This raises the bar significantly against physical theft.

### Windows 11 Home — Device Encryption

Home doesn't include BitLocker *management* (the Control Panel applet and Group Policy controls), but most modern devices support **Device Encryption** — the same BitLocker technology, managed automatically.

1. **Settings → Privacy & security → Device encryption**
2. Toggle **Device encryption** on (if the option isn't present, your hardware may not support it)

> **Critical for Home users — the recovery key:** With a **Microsoft account**, your recovery key is escrowed to that account automatically. With a **local account**, the key may not be backed up anywhere. This matters because **Windows 11 24H2 now auto-encrypts far more machines by default — including on clean installs and resets** — so it's possible to end up with an encrypted drive and *no saved recovery key*, which means permanent data loss if the device's security state ever changes.
>
> Confirm where your key is **now**: in Windows, open an elevated Command Prompt and run `manage-bde -protectors -get C:` to display the recovery key, then save it somewhere safe **off the device** (printed, or on another device). If you use a Microsoft account, also verify the escrowed copy at [account.microsoft.com/devices/recoverykey](https://account.microsoft.com/devices/recoverykey).

---

## 5. Windows Defender Firewall

The built-in firewall blocks unsolicited inbound connections. It is on by default — confirm it and keep it on for all network types.

**Steps:**
1. **Settings → Privacy & security → Windows Security → Firewall & network protection**
2. Confirm the firewall is **On** for **Domain**, **Private**, and **Public** networks
3. When joining a new network, choose **Public** unless it's your own trusted home or office network — the Public profile is more restrictive

> Avoid disabling the firewall to "fix" a connectivity problem. Instead, add a specific rule for the app that needs it. If you use Remote Desktop (Pro only), restrict it to trusted networks and never expose port 3389 directly to the internet.

---

## 6. Microsoft Defender Antivirus & SmartScreen

Windows includes Microsoft Defender Antivirus, a capable real-time anti-malware engine. For most users it's all the antivirus you need — leave its protections on.

**Steps — Virus & threat protection:**
1. **Windows Security → Virus & threat protection → Manage settings**
2. Confirm these are **On**:
   - **Real-time protection**
   - **Cloud-delivered protection**
   - **Automatic sample submission**
   - **Tamper Protection** — this stops malware (and rogue tools) from disabling your defenses

**Steps — SmartScreen & reputation-based protection:**
1. **Windows Security → App & browser control → Reputation-based protection → Settings**
2. Turn on **Check apps and files**, **SmartScreen for Microsoft Edge**, **Phishing protection**, **Potentially unwanted app blocking**, and **SmartScreen for Microsoft Store apps**

### Smart App Control (if available)

Smart App Control blocks untrusted and potentially malicious apps at the OS level. It becomes available on a **clean install of Windows 11** and starts in an "evaluation" mode, where Windows decides whether it can stay fully on without disrupting you.

- If **Windows Security → App & browser control → Smart App Control** shows **On** or **Evaluation**, leave it on.
- Historically, once Smart App Control was turned **Off** it could only be re-enabled by reinstalling Windows. As of the **April 2026 Windows update**, an administrator can now turn it back on from this same screen — but only if the device still meets the eligibility requirements, so don't disable it casually.

> You don't generally need a third-party antivirus on top of Defender. Avoid "PC cleaner," "optimizer," or "speed booster" apps — they are frequently adware or worse.

---

## 7. Ransomware Protection (Controlled Folder Access)

Controlled Folder Access blocks unauthorized apps from modifying files in your protected folders (Documents, Pictures, etc.), which stops most ransomware from encrypting them.

**Steps:**
1. **Windows Security → Virus & threat protection → Ransomware protection → Manage ransomware protection**
2. Turn on **Controlled folder access**
3. Optionally add extra folders to protect

> **Heads-up:** Controlled Folder Access can block legitimate apps (some games, backup tools, or creative software) from saving to protected folders. If a trusted app is blocked, allow it via **Allow an app through Controlled folder access** rather than turning the feature off.

---

## 8. Device Security: Core Isolation, Secure Boot & TPM

These hardware-backed protections defend against advanced malware. **Secure Boot and TPM 2.0 are required to run Windows 11. Memory Integrity is an additional, strongly recommended protection** — on by default on many new PCs but often off on machines upgraded from Windows 10.

1. **Windows Security → Device security**
2. Under **Core isolation**, turn on **Memory integrity** — this prevents malware from injecting code into high-security processes. If it won't turn on, an incompatible driver is usually the cause; the page will name it, so update or remove that driver, then enable it. (On a few older gaming rigs or virtual machines, Memory Integrity can slightly reduce performance.)
3. Confirm **Secure boot** is **On** (it verifies that only trusted code runs at startup)
4. Confirm a **TPM 2.0** security processor is present and healthy (required for Windows 11, BitLocker, and Windows Hello)

---

## 9. Privacy & Data Collection

Windows 11 has no single "privacy off" switch — controls are spread across several pages. Tighten the ones that matter most.

### Diagnostic Data

1. **Settings → Privacy & security → Diagnostics & feedback**
2. Turn **off** **Send optional diagnostic data**
3. Turn **off** **Tailored experiences** and **View diagnostic data**
4. Set **Delete diagnostic data** to remove what's already been collected

### Advertising ID and Tracking

1. **Settings → Privacy & security → General**
2. Turn **off** **Let apps show me personalized ads using my advertising ID**, and review the remaining toggles on this page — turn off any you don't want (e.g. the personalized-ads and tracking options)

### App Permissions

1. **Settings → Privacy & security**, then review **Location**, **Camera**, **Microphone**, and **Account info**
2. Disable access for any app that has no clear reason to need it. Pay special attention to **Camera** and **Microphone**.

### Windows Recall (Copilot+ PCs only)

Recall periodically screenshots your activity so you can search it later. Because those snapshots can capture passwords, financial data, and confidential documents, it's a meaningful privacy exposure. Recall is opt-in and limited to Copilot+ PCs, but verify it's off if you don't deliberately want it.

1. **Settings → Privacy & security → Recall & snapshots**
2. Turn **off** **Save snapshots**, then click **Delete snapshots** to clear any existing data

> If you don't see a Recall section, your PC isn't a Copilot+ device and Recall isn't present.

> **Stronger option:** to remove Recall entirely rather than just disabling it, search **"Turn Windows features on or off"** and uncheck **Recall**, then restart.

### Copilot and Cloud Sync

Be deliberate about what syncs to the cloud and whether AI assistants are signed in. Review **Settings → Accounts → Windows backup** and turn off syncing for anything sensitive you'd rather keep only on the device.

---

## 10. Microsoft Account Security

### Enable Two-Step Verification

Your Microsoft account can hold your BitLocker/Device Encryption recovery key, Find My Device, and synced data. Protect it.

1. Sign in at [account.microsoft.com/security](https://account.microsoft.com/security)
2. Turn on **Two-step verification**
3. Use the **Microsoft Authenticator** app or a hardware security key rather than SMS where possible
4. Consider going **passwordless** (sign in with Authenticator or a passkey instead of a password)

### Local Account vs. Microsoft Account

A **Microsoft account** enables recovery-key escrow, Find My Device, and easier recovery — convenient and a net security gain for most people. A **local account** shares less data with Microsoft but means *you* are solely responsible for your encryption recovery key and device recovery. For most users we recommend a Microsoft account with two-step verification turned on.

---

## 11. Browser Security

### Microsoft Edge (Built-in)

Edge shares the SmartScreen reputation engine with Windows and is well integrated.

1. **Edge → Settings → Privacy, search, and services**
2. Set **Tracking prevention** to **Strict**
3. Confirm **Microsoft Defender SmartScreen** is **on**
4. Turn on **Typosquatting checker** and **Secure DNS** (**Use secure DNS to specify how to look up the network address for websites**)

### Google Chrome (Required for Google Workspace Environments)

If your organization uses Google Workspace and enforces browser policy, Chrome may be required — or strongly preferred. Organizations can push security settings directly to Chrome via the Google Admin Console, including:

- **Force-installing extensions** (e.g., endpoint security agents, password managers, DLP tools)
- Enforcing Safe Browsing, password manager policies, and managed bookmarks
- Blocking access to specific sites or categories
- Requiring sign-in with a managed Google account

**If Chrome is managed by your organization:** those org-applied policies are a deliberate security control — do not attempt to disable or work around them.

**If Chrome is not managed by your organization** (personal install), apply these settings manually:

1. **Chrome → Settings → Privacy and security → Safe Browsing** → set to **Enhanced Protection**
2. **Chrome → Settings → Privacy and security → Security** → enable **Always use secure connections**
3. **Chrome → Settings → Privacy and security → Cookies** → set to **Block third-party cookies**
4. Keep Chrome updated — verify via **Chrome → Help → About Google Chrome**
5. Audit installed extensions: **Chrome → Extensions** — remove anything you don't recognize or no longer use

### Additional Browser Habits (All Browsers)

- Use **InPrivate / Incognito** for sensitive research sessions
- Keep your browser updated — browser exploits are among the most common attack vectors
- Be cautious with extensions — they can read everything you type and every page you visit; only install from trusted developers

---

## 12. Password Management

### Never Reuse Passwords

Credential stuffing — attackers replaying leaked password lists — is one of the most common account takeover methods. Every account needs a unique, strong password.

### Use a Password Manager

A dedicated password manager generates and stores strong unique passwords and autofills them across browsers and apps. Reputable cross-platform options: **1Password**, **Bitwarden** (open source), **Proton Pass**. Microsoft Edge and Authenticator also include a built-in password manager that syncs with your Microsoft account.

### Use Passkeys Whenever Offered

Passkeys are phishing-proof credentials backed by Windows Hello. Where a site offers passkeys, choose them over passwords — there's nothing to steal or phish, and you authenticate with your PIN or biometric.

---

## 13. Network Security

### Use a VPN on Untrusted Networks

On public Wi-Fi (coffee shops, hotels, airports), unencrypted traffic is visible to others on the network. Use a reputable VPN with a no-logs, audited policy. Recommended providers: **Mullvad**, **ProtonVPN**, **IVPN**. Avoid free VPNs — they frequently monetize your traffic data.

### Set the Right Network Profile

1. **Settings → Network & internet → [your connection] → Properties**
2. Set unknown or public networks to **Public** (blocks file sharing and discovery). Reserve **Private** for your own trusted networks.

### Turn Off Unneeded Sharing

1. **Settings → Network & internet → Advanced network settings → Advanced sharing settings**
2. Turn **off** **Network discovery** and **File and printer sharing** on Public networks (and on Private networks too, unless you actively share files at home/office)

### Wi-Fi Hygiene

- Prefer networks that use **WPA3** (or at least WPA2) encryption; avoid open networks with no password
- Turn off **Connect automatically** for public or one-time networks so your device doesn't silently rejoin a spoofed network later (**Settings → Network & internet → Wi-Fi → Manage known networks**)

---

## 14. Backup & Recovery

Backups are your last line of defense against ransomware, drive failure, and theft. Follow the **3-2-1 rule**: three copies of your data, on two types of media, with one copy offsite.

### Built-in Backup

- **File History** (**Settings → System → Storage → Advanced storage settings → Backup options**, or search "File History") backs up your libraries to an external drive on a schedule.
- **Windows Backup** (**Settings → Accounts → Windows backup**) syncs folders, settings, and apps to OneDrive.

### Offsite / Cloud Backup

Keep at least one copy off-site so a fire, flood, or theft can't destroy your only backup. Options include OneDrive, Backblaze, or an external drive stored at another location.

### Test Your Backup

At least once a quarter, confirm you can actually restore a file. A backup you've never tested cannot be trusted.

---

## 15. Physical & Device Security

No software control helps if someone has unrestricted physical access to an unlocked machine.

- **Never leave your PC unlocked and unattended** — press **Windows + L** to lock instantly
- Enable **Find My Device**: **Settings → Privacy & security → Find my device** → On (requires a Microsoft account and location)
- Disk encryption (Section 4) ensures a stolen device's data can't be read
- On laptops in high-risk settings (open offices, conferences), use a **Kensington lock**
- Be cautious with unknown **USB devices** — never plug in a drive you found or don't trust

---

## Quick Reference Checklist

| # | Setting | Location |
|---|---|---|
| 1 | Windows Update on, latest updates enabled | Settings → Windows Update |
| 2 | Standard account for daily use | Settings → Accounts → Other users |
| 3 | UAC at default or "Always notify" | Search: Change User Account Control |
| 4 | Windows Hello PIN / biometric set | Settings → Accounts → Sign-in options |
| 5 | Require sign-in on wake | Settings → Accounts → Sign-in options |
| 6 | BitLocker (Pro) or Device Encryption (Home) on | Control Panel → BitLocker / Settings → Device encryption |
| 7 | Recovery key backed up and located | account.microsoft.com/devices/recoverykey |
| 8 | Firewall on for all network types | Windows Security → Firewall & network protection |
| 9 | Defender real-time + Tamper Protection on | Windows Security → Virus & threat protection |
| 10 | SmartScreen / reputation protection on | Windows Security → App & browser control |
| 11 | Smart App Control on/evaluation (if available) | Windows Security → App & browser control |
| 12 | Controlled folder access on | Windows Security → Ransomware protection |
| 13 | Memory integrity + Secure Boot + TPM on | Windows Security → Device security |
| 14 | Optional diagnostic data off | Settings → Privacy & security → Diagnostics |
| 15 | Advertising ID off | Settings → Privacy & security → General |
| 16 | App permissions (camera/mic/location) reviewed | Settings → Privacy & security |
| 17 | Recall snapshots off (Copilot+ PCs) | Settings → Privacy & security → Recall & snapshots |
| 18 | Two-step verification on Microsoft account | account.microsoft.com/security |
| 19 | Browser privacy settings configured | Edge → Privacy / Chrome → Privacy and security |
| 20 | Password manager in use, no reuse | 1Password / Bitwarden / Proton Pass |
| 21 | Public network profile on untrusted Wi-Fi | Settings → Network & internet |
| 22 | Backups running (3-2-1) and tested | File History / Windows Backup |
| 23 | Find My Device on | Settings → Privacy & security → Find my device |

---

## Periodic Maintenance

| Frequency | Task |
|---|---|
| Monthly | Check Windows Update; install pending updates and restart |
| Monthly | Review app permissions for newly installed software |
| Quarterly | Test restoring a file from backup |
| Quarterly | Run a full Microsoft Defender scan |
| Quarterly | Review network profiles and saved Wi-Fi networks |
| Annually | Confirm your encryption recovery key location is current |
| Annually | Review startup apps (Task Manager → Startup) and remove unknown entries |

---

## Incident Response: If You Suspect Compromise

1. **Disconnect from the network immediately** — unplug Ethernet, turn off Wi-Fi, or enable Airplane mode
2. **Do not power off** if you may need forensic evidence — consult a professional first
3. Run a full scan: **Windows Security → Virus & threat protection → Scan options → Full scan**, and consider the **Microsoft Defender Offline scan**
4. Review **Task Manager → Startup** and **Settings → Apps → Installed apps** for unfamiliar entries
5. Change critical passwords **from a different, trusted device** — not the suspect machine
6. **Contact KilPen** — fully remediating a compromised Windows device is difficult to do with confidence, and a clean reinstall is often the safest path

---

*This guide reflects Windows 11 (24H2) settings as of June 2026. Microsoft changes Settings layout and feature names between releases; exact menu paths may vary slightly by version and edition.*
