# twitch-to-slack
Node.JS script sending slack message when selected twitch channel start to stream

## Features
- Detect if a twich stream is online
- Send nptification to a Slack hook if a whatched stream come online
- Can watch multiple stream channel

## Installation
- Simply clone this depot anywhere on your server.
- Copy [config.json.exemple](https://github.com/BernardJeremy/twitch-to-slack/blob/master/config.json.example) file into a `config.json` file.
- Perform `npm install` command.
- Install a [incoming-webhooks](https://api.slack.com/incoming-webhooks) on your Slack.
- Add your link of the Slack incoming-webhooks in the `config.json` file.
- Add your wanted reference in the `config.json` file.
- Optional (but recommended) : Install a task scheduler (like `CRON`) to run the script regularly.

## Configuration
- `twitchAPILink` : Link to the twich API page (You shouldn't have to change this).
- `chaineID` : Name of the watched stream (`ogaminglol` in `https://www.twitch.tv/ogaminglol`). Could be a single string or an array of string, to watch multiple stream.
- `slackHookUrl` :  Link to your Slack incoming-webhooks.
