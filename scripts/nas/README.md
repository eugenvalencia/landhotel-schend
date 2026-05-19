# NAS Scripts — Conexa-Schend Synology

Synced to `/volume1/CONEXA-SCHEND/scripts/` on the NTS-Server (DS1019+).

## Scripts

### `backup-repos.sh`
Nightly tarball backup of public GitHub repos + n8n workflow exports.
- Output: `/volume1/CONEXA-SCHEND/backups/{schend-site,hetzner-n8n}/`
- Retention: last 14 tarballs per repo, last 30 days of logs
- Run via DSM Task Scheduler (daily 03:00)

### `restore-docker-socket-perms.sh`
Restores `/var/run/docker.sock` to `root:docker 660` after DSM reboot.
Synology resets it to `root:root` on boot, which kicks the admin user out of Docker.
- Run via DSM Task Scheduler trigger: **At Boot-up**

## DSM Task Scheduler Setup

Both scripts need to be registered once in DSM:

1. DSM → **Systemsteuerung** → **Aufgabenplaner**
2. **Erstellen** → **Geplante Aufgabe** → **Benutzerdefiniertes Skript**
3. For `backup-repos.sh`:
   - Name: `Conexa Backup`
   - Benutzer: `root`
   - Zeitplan: Täglich, 03:00
   - Skript: `/bin/sh /volume1/CONEXA-SCHEND/scripts/backup-repos.sh`
4. For `restore-docker-socket-perms.sh`:
   - Name: `Docker Socket Fix`
   - Trigger: **Beim Hochfahren**
   - Skript: `/bin/sh /volume1/CONEXA-SCHEND/scripts/restore-docker-socket-perms.sh`
