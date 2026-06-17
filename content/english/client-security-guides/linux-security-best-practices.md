---
title: "Linux Security Best Practices (Ubuntu / Debian)"
meta_title: "Linux Security Best Practices for Ubuntu & Debian | KilPen Client Security Guides"
description: "A complete guide to securing an Ubuntu or Debian desktop without management agents — covering updates, LUKS encryption, UFW, AppArmor, privacy, and supply-chain safety."
date: 2026-06-16T00:00:00Z
categories: ["Security Guides"]
author: "Chris"
tags: ["linux", "ubuntu", "debian", "security", "luks", "ufw", "apparmor"]
draft: false
---

**Applies to:** Ubuntu 24.04 LTS (and 22.04 LTS), plus Debian and Ubuntu-based distributions such as Linux Mint and Pop!_OS. Commands use `apt`, `ufw`, and AppArmor. Fedora/RHEL equivalents (`dnf`, `firewalld`, SELinux) are noted where they differ.  
**Audience:** Desktop users and small teams who want strong security using built-in Linux tools — no configuration management, MDM, or agents required

---

This guide covers the most important security settings for an Ubuntu or Debian **desktop**. Everything here uses the distribution's own tools. Commands that change the system are run with `sudo`; type your password when prompted.

> **A note on the Linux security model:** Linux is not immune to attack, but its risks differ from Windows and macOS. The biggest real-world threats to a desktop Linux user are **malicious software you install yourself** (untrusted scripts, packages, and repositories), **weak account and physical security**, and **unpatched software** — so this guide weights those heavily.

> Most GUI steps assume the **GNOME** desktop (Ubuntu's default). Other desktops (KDE, Cinnamon) have equivalent settings in different menus; the terminal commands work everywhere.

---

## 1. Keep the System Updated

Unpatched software is the most common path to compromise. Ubuntu and Debian ship security patches frequently through the package manager.

**Apply updates now (terminal):**
```
sudo apt update && sudo apt full-upgrade
```
On a stable LTS, `full-upgrade` is the right choice for staying fully patched. It can occasionally add or remove packages to satisfy dependencies (this is normal); if you'd rather never have packages removed automatically, use `sudo apt upgrade` instead. A reboot is sometimes needed after kernel updates — Ubuntu will tell you.

**Turn on automatic security updates:** Ubuntu installs `unattended-upgrades` by default, but confirm it's active:
```
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```
Choose **Yes** to enable automatic download and installation of security updates.

**Desktop GUI alternative:** Open **Software & Updates → Updates** and set **"When there are security updates"** to **Download and install automatically**.

> **Don't forget app and firmware updates.** If you use **Snap** packages (the default Firefox on Ubuntu is one), they auto-update in the background. **Flatpak** apps update via `flatpak update` (or automatically through GNOME Software). For device firmware, run `sudo fwupdmgr refresh && sudo fwupdmgr update`. Run `sudo apt full-upgrade` weekly to catch everything else.

> **Stay on a supported release.** Run a current LTS (24.04 or 22.04). When your release reaches end of standard support, upgrade — an unsupported release stops receiving security patches. Debian users: track the current stable release and its security suite.

---

## 2. User Accounts & sudo

### Don't Run as Root; Use a Standard Account

On **Ubuntu** the **root account is locked by default** — you perform admin tasks through `sudo` from your own account. Keep it that way; do **not** set a root password.

> **Debian users:** the Debian installer *asks* whether to set a root password. If you set one, root is enabled and your first user may **not** be in the `sudo` group. Either administer the system as root deliberately, **or** add your user to sudo (`adduser <user> sudo` as root) and lock the root account (`passwd -l root`) to match the Ubuntu model — but don't half-do both.

- For shared machines, give day-to-day users a **Standard** account (no administrator/sudo rights) and keep a separate administrator account.
- Manage this under **Settings → System → Users** (click **Unlock**, then set the account type to **Standard** or **Administrator**).

### Use a Strong Login Password

Your login password gates sign-in and `sudo`. Use a long, unique passphrase (12+ characters, or several random words), and never reuse it elsewhere.

> **Login password ≠ disk passphrase.** The password you type to sign in is *not* the same secret as the **LUKS passphrase** entered at boot to unlock the encrypted disk (Section 4) — they are separate secrets even if you chose the same words for both.

### Check Who Has sudo

List members of the admin group so there are no surprises:
```
getent group sudo
```
Remove sudo from an account that shouldn't have it:
```
sudo deluser <username> sudo
```

---

## 3. Screen Lock & Sign-In

### Lock Automatically and on Suspend

1. **Settings → Privacy & Security → Screen Lock** (on some versions: **Settings → Privacy → Screen Lock**)
2. Turn on **Automatic Screen Lock** and set the delay to a few minutes
3. Confirm the screen locks when the system suspends

### Lock Instantly

Press **Super + L** (the Super key is the Windows/Command key) whenever you step away.

### Don't Enable Automatic Login

In **Settings → System → Users**, make sure **Automatic Login** is **off** — otherwise, once the disk is unlocked at boot, the machine signs straight in with no further check. (Your LUKS passphrase is still required at boot, so the disk stays encrypted at rest — but auto-login removes the everyday sign-in barrier.)

---

## 4. Full-Disk Encryption (LUKS)

Disk encryption ensures that if the device is lost or stolen, the data can't be read by removing the drive or booting another OS. Ubuntu and Debian use **LUKS** (Linux Unified Key Setup).

**The important caveat:** LUKS full-disk encryption is easiest to enable **during installation**. On the Ubuntu installer, first choose **Use LVM with the new Ubuntu installation**, which then unlocks the **"Encrypt the new Ubuntu installation for security"** checkbox — tick it and set a strong encryption passphrase. Note this guided path **erases the whole disk**, so it isn't suitable for an existing dual-boot setup you want to keep.

**Check whether your system is already encrypted:**
```
lsblk -f
```
Look for a `crypto_LUKS` filesystem (or run `sudo cryptsetup status` on the mapped device). If you see it, you're encrypted.

> **If your system is not encrypted,** the reliable path is to **back up your data and reinstall** with encryption enabled. In-place encryption of an existing system is possible but advanced and risky — for most users a clean reinstall is safer. KilPen can help plan this.

> **Record your passphrase (and recovery key) safely.** If you forget the LUKS passphrase, the data is unrecoverable. Store it in a password manager and/or a secure physical location — never in a plaintext file on the same machine. Newer Ubuntu releases (25.10+) add TPM-backed encryption with a managed recovery key; if you use it, save that recovery key somewhere safe off the device.

---

## 5. Firewall (UFW)

Desktop Ubuntu and Debian ship with a firewall (`ufw`) installed but **not enabled** by default. Turn it on with a default-deny-inbound policy.

```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
sudo ufw status verbose
```

This blocks unsolicited inbound connections while allowing your own outbound traffic. If you later run a service that genuinely needs an inbound port, add a specific rule (e.g. `sudo ufw allow 22/tcp` for SSH) rather than disabling the firewall.

> **Prefer a GUI?** Install **gufw** (`sudo apt install gufw`) for a graphical "Firewall Configuration" app. *(Fedora/RHEL use `firewalld` instead: `sudo systemctl enable --now firewalld`.)*

---

## 6. AppArmor (Mandatory Access Control)

AppArmor confines individual programs to only the files and capabilities they legitimately need, limiting the damage if one is exploited. On Ubuntu it's **enabled by default** — your job is mainly to confirm it's running.

```
sudo aa-status
```
You should see profiles loaded and in **enforce** mode. If `aa-status` isn't found, install the tools:
```
sudo apt install apparmor-utils
```
Leave AppArmor enabled. Only disable a specific profile if a trusted application genuinely breaks, and prefer fixing the profile over turning it off.

> *(Fedora/RHEL use **SELinux** instead — keep it in `enforcing` mode; check with `getenforce`.)*

---

## 7. Software Sources & Supply-Chain Safety

This is the area where desktop Linux users most often compromise themselves. Be deliberate about where software comes from.

- **Prefer the official repositories**, Snap Store, or Flathub. Software installed through `apt`, Snap, and Flatpak is signed and far safer than random downloads.
- **Never pipe untrusted scripts straight into a shell.** Treat `curl https://… | sudo bash` from an unfamiliar site as running unknown code as root. Download the script, read it, and verify the source first.
- **Be cautious with PPAs and third-party `apt` repositories.** Each one you add can publish updates to your system with full trust. Add only those from projects you trust, and remove ones you no longer use.
- **Verify downloads when offered.** If a vendor publishes a checksum or GPG signature for a `.deb` or ISO, check it (`sha256sum file.deb`) before installing.
- **Review app permissions.** Snap and Flatpak apps are sandboxed, but some request broad access. Review and pare back Flatpak permissions with **Flatseal** (or `flatpak permissions`), and check a Snap's access under its Permissions settings.
- **Remove software you don't use.** Uninstall an app you no longer need with `sudo apt remove <package>`, then clear leftover orphaned dependencies with `sudo apt autoremove`. A smaller install has fewer things to patch and fewer ways in.

---

## 8. Privacy & Data Collection

Ubuntu collects far less than Windows, and most of it is opt-in — but a few things are worth tightening.

### GNOME Privacy Settings

Open **Settings → Privacy & Security** (older versions: **Settings → Privacy**) and review:

- **Location Services** — turn off unless you need it
- **File History & Trash** — set automatic trash/temp cleanup if you like
- **Screen Lock** — confirm it's on (Section 3)
- **Connectivity Checking** — optional to disable; it pings a Canonical/Ubuntu server to detect captive portals
- **Diagnostics / Problem Reporting** — set automatic error reporting to **Never** if you don't want crash data sent

### Disable Crash & Usage Reporting (optional)

To stop background crash reporting entirely:
```
sudo systemctl disable --now apport.service
sudo systemctl disable --now whoopsie.service
```
Ubuntu's install-time **"Help improve Ubuntu"** telemetry (`ubuntu-report`) is opt-in; if you opted in and want out, you can remove it: `sudo apt purge ubuntu-report`.

> Disabling `apport` means you won't get automatic crash diagnostics. That's a reasonable privacy tradeoff for many users, but skip it if you rely on those reports for troubleshooting.

---

## 9. Online Accounts & SSH

### Protect Your Online Accounts

The accounts you sign into from this machine (email, cloud storage, Git hosting) are common targets. Turn on **two-factor authentication** everywhere it's offered, preferably with an authenticator app or hardware security key rather than SMS.

### If You Use SSH

SSH is **not installed by default** on the Ubuntu desktop. If you don't need remote terminal access, leave it off — or remove the server:
```
sudo apt remove openssh-server
```

If you **do** run an SSH server, harden it. First, set up **key-based authentication** — generate a key with `ssh-keygen -t ed25519`, copy it to the server, and **confirm you can log in with the key in a separate session**. Only then edit `/etc/ssh/sshd_config` (or a drop-in under `/etc/ssh/sshd_config.d/`) and set:
```
PermitRootLogin no
PasswordAuthentication no
```

> **Avoid locking yourself out:** disabling `PasswordAuthentication` before your key works will lock you out of a remote machine. Verify key login first.

Apply the change and restrict access:
```
sudo systemctl restart ssh
sudo ufw allow from <trusted-ip> to any port 22
```

> **Ubuntu 22.10+ uses socket-based activation** for SSH (`ssh.socket`), so the daemon may only start when a connection arrives. After editing the config, `sudo systemctl restart ssh` applies it; check the listener with `sudo systemctl status ssh.socket`. Never expose SSH directly to the internet without key auth.

---

## 10. Browser Security

### Firefox (Ubuntu Default)

1. **Settings → Privacy & Security**
2. Set **Enhanced Tracking Protection** to **Strict**
3. Turn on **HTTPS-Only Mode**
4. Under **Firefox Data Collection and Use**, turn off telemetry if you prefer
5. Keep Firefox updated — the Ubuntu Snap version updates itself automatically

### Google Chrome (Required for Google Workspace Environments)

If your organization uses Google Workspace and enforces browser policy, Chrome may be required — or strongly preferred. Organizations can push security settings directly to Chrome via the Google Admin Console, including:

- **Force-installing extensions** (e.g., endpoint security agents, password managers, DLP tools)
- Enforcing Safe Browsing, password manager policies, and managed bookmarks
- Blocking access to specific sites or categories
- Requiring sign-in with a managed Google account

**If Chrome is managed by your organization:** those org-applied policies are a deliberate security control — do not attempt to disable or work around them.

**If Chrome is not managed by your organization** (personal install), apply these settings manually:

1. Install Chrome from Google's official `.deb` (this adds Google's signed repository so it updates through `apt`)
2. **Chrome → Settings → Privacy and security → Safe Browsing** → set to **Enhanced Protection**
3. **Chrome → Settings → Privacy and security → Security** → enable **Always use secure connections**
4. **Chrome → Settings → Privacy and security → Cookies** → set to **Block third-party cookies**
5. Audit installed extensions: **Chrome → Extensions** — remove anything you don't recognize

### Additional Browser Habits (All Browsers)

- Use **Private / Incognito** windows for sensitive research sessions
- Keep your browser updated — browser exploits are among the most common attack vectors
- Be cautious with extensions — they can read everything you type and every page you visit; only install from trusted developers

---

## 11. Password Management

### Never Reuse Passwords

Credential stuffing — attackers replaying leaked password lists — is one of the most common account takeover methods. Every account needs a unique, strong password.

### Use a Password Manager

Strong options that run well on Linux:

- **KeePassXC** — free, open source, fully offline; available via `apt`, Snap, or Flatpak
- **Bitwarden** — free tier, syncs across devices, open source
- **Proton Pass** and **1Password** — both offer native Linux apps

### Use Passkeys and Hardware Keys

Where a site offers **passkeys**, prefer them over passwords — they're phishing-proof. A hardware security key (YubiKey) is well supported on Linux and is an excellent second factor.

---

## 12. Network Security

### Use a VPN on Untrusted Networks

On public Wi-Fi, unencrypted traffic is visible to others on the network. Use a reputable, no-logs, audited VPN: **Mullvad**, **ProtonVPN**, **IVPN** (all have Linux clients or WireGuard configs). Avoid free VPNs — they frequently monetize your traffic.

### Don't Run Services You Don't Need

Every listening network service is attack surface. See what's listening:
```
sudo ss -tulpn
```
If something is listening that you don't recognize or need, remove or disable that package. Combined with the default-deny firewall (Section 5), this keeps the machine quiet on the network.

### Wi-Fi Hygiene

- Prefer **WPA3** (or at least WPA2) networks; avoid open networks with no password
- Remove saved networks you no longer use (**Settings → Wi-Fi → known networks**)

---

## 13. Backup & Recovery

Backups are your last line of defense against ransomware, drive failure, and theft. Follow the **3-2-1 rule**: three copies of your data, on two types of media, with one copy offsite.

### Déjà Dup (Built-in Backups)

Ubuntu includes the **Backups** app (Déjà Dup):

1. Open **Backups**
2. Choose folders to back up and a storage location (external drive, network share, or cloud)
3. Turn on **Encrypt backups** and set a passphrase — always encrypt, especially for portable or cloud storage
4. Enable **automatic** scheduled backups

### Test Your Backup

At least once a quarter, restore a file to confirm the backup actually works. A backup you've never tested cannot be trusted.

### Keep a Copy Offsite

Store one backup in a different physical location (or encrypted cloud storage) so a fire, flood, or theft can't destroy your only copy.

---

## 14. Malware & Integrity

Desktop Linux faces less commodity malware than Windows, so a resident antivirus is usually unnecessary. Focus on the controls already covered — trusted software sources (Section 7), updates, AppArmor, and least privilege — which address the real risks.

- **ClamAV** (`sudo apt install clamav`) is useful mainly for **scanning files you pass to Windows users** or running a mail/file server — not as always-on desktop protection.
- **Avoid "Linux cleaner/optimizer" tools and dubious one-line installers** — they're far likelier to harm than help.
- If you ever suspect a compromise, a rootkit checker like **`rkhunter`** or **`chkrootkit`** can be run on demand, though results need expert interpretation.

---

## 15. Physical & Device Security

No software control helps if someone has unrestricted physical access to an unlocked machine.

- **Never leave your machine unlocked and unattended** — **Super + L** locks instantly
- Set a **UEFI/BIOS password** and disable booting from USB/external media in firmware, so an attacker can't boot another OS to bypass your login
- Keep **Secure Boot enabled** in UEFI (Ubuntu supports it) — it helps ensure only trusted code runs at startup
- Full-disk encryption (Section 4) ensures a stolen device's data can't be read
- On laptops in high-risk settings, use a **Kensington lock**
- Be cautious with unknown **USB devices** — never plug in a drive you found or don't trust

---

## Quick Reference Checklist

| # | Setting | How |
|---|---|---|
| 1 | System fully updated | `sudo apt update && sudo apt full-upgrade` |
| 2 | Automatic security updates on | `unattended-upgrades` enabled |
| 3 | Root account left locked; use sudo | (default on Ubuntu) |
| 4 | Standard account for non-admin users | Settings → System → Users |
| 5 | Strong, unique login passphrase | — |
| 6 | Automatic screen lock on | Settings → Privacy & Security → Screen Lock |
| 7 | Automatic login off | Settings → System → Users |
| 8 | Full-disk encryption (LUKS) active | `lsblk -f` shows `crypto_LUKS` |
| 9 | LUKS passphrase / recovery key stored safely | password manager + offline copy |
| 10 | Firewall enabled, default-deny inbound | `sudo ufw enable` |
| 11 | AppArmor enforcing | `sudo aa-status` |
| 12 | Software only from trusted sources | repos / Snap / Flathub; no `curl \| bash` |
| 13 | Privacy & problem reporting reviewed | Settings → Privacy & Security |
| 14 | 2FA on all online accounts | per service |
| 15 | SSH removed or hardened | `apt remove openssh-server` / key auth |
| 16 | Browser privacy hardened | Firefox Strict / Chrome Enhanced |
| 17 | Password manager in use, no reuse | KeePassXC / Bitwarden |
| 18 | No unnecessary listening services | `sudo ss -tulpn` |
| 19 | Encrypted backups running (3-2-1) | Déjà Dup |
| 20 | UEFI/BIOS password + Secure Boot on | firmware settings |

---

## Periodic Maintenance

| Frequency | Task |
|---|---|
| Weekly | Run `sudo apt update && sudo apt full-upgrade` to catch non-security updates |
| Monthly | Review installed apps and added repositories/PPAs; remove what you don't use |
| Quarterly | Test restoring a file from backup |
| Quarterly | Review listening services (`sudo ss -tulpn`) and firewall rules (`sudo ufw status`) |
| Annually | Confirm your LUKS passphrase/recovery key is recorded and current |
| At release EOL | Upgrade to a supported LTS / stable release before support ends |

---

## Incident Response: If You Suspect Compromise

1. **Disconnect from the network immediately** — turn off Wi-Fi or unplug Ethernet
2. **Do not power off** if you may need forensic evidence — consult a professional first
3. Look for unexpected listening services (`sudo ss -tulpn`) and unfamiliar running processes (`ps aux`, `top`)
4. Review what runs at login/boot: user autostart entries and `systemctl list-unit-files --state=enabled`
5. Change critical passwords **from a different, trusted device** — not the suspect machine
6. **Contact KilPen** — confidently cleaning a compromised system is difficult, and a wipe-and-reinstall from known-good media (restoring data from a clean backup) is often the safest path

---

*This guide reflects Ubuntu 24.04 LTS and Debian as of June 2026. Menu names and paths vary between desktop environments and releases; the terminal commands are the most portable reference.*
