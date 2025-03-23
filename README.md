# Sonnen

## Raspberry Pi installation

Clone into the repository and run the following commands

`npx nx build pi`

### Install as a service

Place file in `/etc/systemd/system/sonnen.service`:

```bash
[Unit]
Description=Sonnen backend application
Documentation=https://github.com/bregnvig/sonnen
After=network.target

[Service]
Environment=SONNEN_API_KEY=
Environment=SONNEN_API_BASE_URL=192.168.86.31
Environment=SONNEN_BATTERY_CHECK_CRON="0 4 * * *"
Type=simple
User=pi
ExecStart=/usr/bin/node /dist/pi/main.js
Restart=on-failure
StandardOutput=append:/var/log/sonnen.log
StandardError=append:/var/log/sonnen-error.log

[Install]
WantedBy=multi-user.target
``` 

Reload systemd and start the service:

```bash
sudo systemctl daemon-reexec   # reloads systemd itself (safer on Raspberry Pi)
sudo systemctl daemon-reload   # reloads unit files
``` 

Start the service:

```bash
sudo systemctl enable sonnen
sudo systemctl start sonnen
``` 

Make sure `User` has write access to log files.

```bash
sudo touch /var/log/sonnen.log /var/log/sonnen-error.log
sudo chown pi:pi /var/log/sonnen*.log
```

