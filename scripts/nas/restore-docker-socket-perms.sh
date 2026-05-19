#!/bin/sh
# Restore Docker socket permissions after reboot.
# Synology resets /var/run/docker.sock to root:root on every boot.
# This script restores root:docker + 660 so admin (in docker group) can use docker.
# Managed by Roman (CTO).

sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
