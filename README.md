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

Check status:

```bash
sudo systemctl status sonnen
```

Make sure `User` has write access to log files.

```bash
sudo touch /var/log/sonnen.log /var/log/sonnen-error.log
sudo chown pi:pi /var/log/sonnen*.log
```

## Development with firestore

Use environment to decide which firestore database to populate.

If you need to populate the firebase emulator use `export FIRESTORE_EMULATOR_HOST="localhost:8080"`. Remember to start the emulator before executing the builder.

### Starting emulators

1. Run emulators
   use `firebase emulators:start --only=functions,firestore,auth,pubsub --config=firebase.json --export-on-exit=./saved-data --import=./saved-data --inspect-functions`
   Delete `export`, `import` and/or `--inspect-functions` if not wanted
   2If ports are already taken, run `npm run kill-ports`

