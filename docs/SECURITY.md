# 🔒 Security, Privacy & Data Isolation

## 1. Threat Model & Privacy Principles

SurvivalOS is designed to operate in adversarial and high-risk conditions where personal privacy, location concealment, and medical data protection are critical.

---

## 2. Core Security Pillars

### 1. Zero External Telemetry
- **No Remote Analytics**: No Google Analytics, Mixpanel, Sentry, or third-party telemetry scripts are included.
- **No External CDN Dependencies**: All fonts (Inter/Geist), styling, and icon packages (Lucide) are bundled locally.
- **Air-Gapped Operation**: The entire stack can run inside a fully air-gapped system without internet access.

### 2. Sandboxed AI Execution
- The AI Agent does not possess OS shell access, terminal execution rights, or disk write capabilities beyond predetermined database entries.
- All agent interactions occur through a strictly audited **Python Tool Registry** with typed inputs and outputs.

### 3. Local Data Storage & Isolation
- All user profiles, household sizes, coordinates, medical records, and supply levels reside exclusively in `data/apocalypse.db` on your local disk.
- Database records are not synced to external servers or multi-tenant clouds.

---

## 3. Best Practices for High-Threat Environments

1. **Full-Disk Encryption**: Store the project inside a BitLocker (Windows), FileVault (macOS), or LUKS (Linux) encrypted volume.
2. **Local Host Binding**: The FastAPI backend binds to `127.0.0.1` by default to prevent unauthorized devices on your local Wi-Fi or LAN from querying your survival vault.
3. **Database Backups**: Regularly export or back up `data/apocalypse.db` to an encrypted offline flash drive (e.g. VeraCrypt).
