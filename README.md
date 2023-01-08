# CompRetty

A competition management Discord bot.

![](https://raw.github.com/GleammerRay/CompRetty/master/assets/banner.svg)

## Contents
1. [Setting up the bot in Discord](#setting-up-the-bot-in-discord)
2. [Discord slash commands](#discord-slash-commands)
   - [User commands](#user-commands)
   - [Admin commands](#admin-commands)
3. [Setting up your own CompRetty application](#setting-up-your-own-compretty-application)
   1. [Creating a link](#1-creating-a-link)
   2. [Setting up the config](#2-setting-up-the-config)
   3. [Running the bot with NodeJS](#3-running-the-bot-with-nodejs)
   4. [Making backups](#4-making-backups)
   5. [Updating](#5-updating)
   6. [Logging](#6-logging)
5. [Command line arguments](#command-line-arguments)
6. [Library](#library)

## Setting up the bot in Discord
1. Invite one of the currently available bots:
   - [CompRetty](https://discord.com/api/oauth2/authorize?client_id=1050406766204170360&permissions=2048&scope=bot) - by Gleammer#5946
2. Go to `Server Settings` -> `Integrations` -> `Bots and Apps` -> `CompRetty`.
3. Set channels and roles for commands that you want to use.
4. Set up competitions on all channels that you want to use via the `/setup` command.
5. Enjoy! 🏏

## Discord slash commands

### User commands

- `/help` - List all available commands.
- `/competition`, `/comp`, `/join`, `/pug` - Show the competition.
- `/get_role` - Get the competition role.
- `/shuffle` - Vote to shuffle players.

### Admin commands

- `/setup` - Summon the setup wizard.
- `/force_start` - Force a game to start.
- `/kick` - Kick player(s) from competition.

## Setting up your own CompRetty application

In case you want to run a bot of your own, you can!

Make sure to download the [latest bot release](https://github.com/GleammerRay/CompRetty/releases) before proceeding.

### 1. Creating a link
1. Go to [Discord Developer Portal - My Applications](https://discord.com/developers/applications) and create a new application. [A tutorial can be found here](https://github.com/discord-apps/bot-tutorial).
2. Go to URL Generator under OAuth2 and select bot scope with permissions to send messages.
3. Use the generated URL to invite the bot. 🤖

### 2. Setting up the config

1. Make a copy of `.env.template` named `.env` (removing the `.template` in the end).
2. Specify your Discord bot token in `COMPRETTY_BOT_TOKEN` in the `.env`. You can get it from the bot section of your Discord application.
3. Specify the owner ID in `COMPRETTY_OWNER_ID` in the `.env`. You can get it by enabling developer mode in Discord and right clicking on your username in any message, and the selecting `Copy ID`.
4. You are ready to run your bot! 🦸

### 3. Running the bot with NodeJS

1. Get [NodeJS](https://nodejs.org/en/download/) (and npm if you're on linux).
2. Run `npm ci` in the root of bot directory to install dependencies.
3. Run `node start_bot.js` to run the bot. 🏃

### 4. Making backups

All bot generated preferences including per-server preferences are saved in the `usrprefs` folder (or a different folder if you have changed `COMPRETTY_PREFS_PATH`). Make sure to back up this file regularly to avoid data loss. 

### 5. Updating

1. [Download and extract the latest available release](https://github.com/GleammerRay/CompRetty/releases).
2. Copy your `.env` file and `usrprefs` folder from old installation to the newly acquired release.
2. Run `npm ci` in the root of bot directory to install dependencies.
3. Enjoy the latest features! ⚡

### 6. Logging

By default, CompRetty is logging to your console.

If you wish to save the log, specify the `-s` or `--save-log` argument when running the bot. The log will then be saved to `bot.log` inside bot's directory.

Log message types:
- `I` - Informational message: contains relevant information about what the bot is doing.
- `W` - Warning: notifies about something that can cause runtime issues.
- `E` - Error: an unresolved runtime error. The bot will keep working, but its behaviour is not guaranteed.
- `F` - Fatal error: an error that caused the bot to crash.
- `S` - System message: contains relevant information about the bot process.

## Command line arguments

- `-h` / `--help` - Display help page.
- `-q` / `--quiet` - Do not log info and warnings into console. The `-s` option will not be affected.
- `-s` / `--save-log` - Save script log to a file. Default path is `bot.log` in parent directory, custom path can be specified with `-o`.
- `-o` / `--output <filepath>` - Specify a custom log output file path instead of `bot.log`.
- `-r` / `--restart` - Automatically restart the script on crash.
- `--raw` - Execute a raw run. The script will ignore all options and its output will not be formatted.

## Library

Library exports:
- `BurstStack` - A burst command execution stack. Executes multiple commands in one "burst" and waits a set threshold in between.
- `startBurstStacks` - Start optional CompRetty specific burst stacks.
- `stopBurstStacks` - Stop CompRetty specific burst stacks.
- `PlayerType` - Type of a player. Any, ready or not ready.
- `VoteType` - Type of a vote. None, against or for.
- `ComprettyEventType` - Type of an event. Left or joined.
- `CompRettyEvent` - A CompRetty event. Contains player ID, team, event type and a message.
- `CompRettyPlayer` - A CompRetty team player. Contains player preferences and methods to operate on them.
- `CompRettyTeam` - A CompRetty team. Contains preferences, team players and methods to operate on them.
- `CompRettyTeams` - A wrapper for the competition teams list. Contains teams and team related helper methods.
- `CompRettyVotes` - Helper class for managing player votes.
- `CompRettyShuffle` - A CompRetty shuffle. Contains channel ID, teams, votes and methods to operate on them.
- `CompRettyCompetition` - A CompRetty competition. Contains competition preferences, teams and methods to operate on them.
- `CompRettyChannel` - A channel that uses the CompRetty bot. Contains channel preferences, current competition and methods to operate on them.
- `CompRettyGuild` - A guild that uses the CompRetty bot. Contains guild preferences, channels and methods to operate on them.
- `CompRettyDiscord` - Bot preferences, guilds and methods to operate on them.
- `CompRetty` - Discord bot. Provides `start()` and `stop()` methods.

#### Made with 💜 by Gleammer.
