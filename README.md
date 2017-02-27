# twitch-to-slack
Node.JS script that sends Slack messages when specified twitch channels start to stream

## Features
- Detect if one or more specified Twitch streams are online
- Send notification to a Slack webhook when a watched stream comes online
- Can optionally send notifications if an online stream changes its status

## Installation
- Clone this repo anywhere on your server.
- With your cloned copy of this repo as your current working directory:
    - Run the command `npm install`.
    - Copy the file `config.json.example` to a new file named `config.json`.
- Install a new [incoming webhook](https://api.slack.com/incoming-webhooks) on your Slack.
- [Register a new Twitch application](https://www.twitch.tv/kraken/oauth2/clients/new) in order to obtain a new Twitch client token.
- Configure the application by updating `config.json` as described below.
- Optional (but recommended) : Install a task scheduler (like `cron`) to run the script regularly.

## Configuration
- `twitchAPILink` : Link to the twich API page (you shouldn't have to change this).
- `clientToken` : Application's client_id, requested by Twich API. You have to [register](https://www.twitch.tv/kraken/oauth2/clients/new) your application to get one.
- `chaineID` : The Twitch usernames of the streams to watch. Can be a either single string (e.g. `"ogaminglol"`) or an array of strings (e.g. `[ "ogaminglol", "examplestreamfun" ]`).
- `notificationOnStatusChange` : Set to `true` or `false` to enable or to disable the notification if the status (name) of the stream change.
- `slackHookUrl` :  Link to your Slack incoming webhook.
- `slackHookName` :  The name that the script will use to identify itself when posting to Slack.
