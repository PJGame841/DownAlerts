# DownAlerts
Just a simple system to ping an ip with port, if it doesn't respond -> send a message on a discord server

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set the environments variables
4. Run `npm run start`

## Environments variables

`DISCORD_WEBHOOK`: the webhook url to send the message -> Optional

`CHECK_ADDR`: the ip to check, can be a domain name -> Required

`CHECK_PORT`: the port to check, for website it's often 80 -> Required

`CHECK_NOTIFY`= 0 or 1, to send a message on discord if the ip is down -> Optional

`CHECK_INTERVAL`: the interval in ms to check the ip -> Optional

`CHECK_TIMEOUT`: the timeout in ms before the check fails -> Optional