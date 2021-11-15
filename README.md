<p align="center"><a href="https://nodei.co/npm/discord-anti-spam/"><img src="https://nodei.co/npm/discord-anti-spam.png"></a></p>

# discord-anti-spam.js

A simple module with quick setup and different options to implement anti-spam features in your bot.
**This version of the package will only support discord.js v13**

## Installation

To install this module type the following command in your console:

```
npm i discord-anti-spam
```

## Documentation

You can see the package documentation [**here**](https://discord-anti-spam.js.org).

## Example

Example of a basic bot handling spam messages using this module.

```js
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const AntiSpam = require("discord-anti-spam");
const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
  kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
  banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
  maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
  warnMessage: "{@user}, Please stop spamming.", // Message that will be sent in chat upon warning a user.
  kickMessage: "**{user_tag}** has been kicked for spamming.", // Message that will be sent in chat upon kicking a user.
  muteMessage: "**{user_tag}** has been muted for spamming.", // Message that will be sent in chat upon muting a user.
  banMessage: "**{user_tag}** has been banned for spamming.", // Message that will be sent in chat upon banning a user.
  maxDuplicatesWarning: 6, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
  maxDuplicatesMute: 8, // Ammount of duplicate message that trigger a mute.
  ignoredPermissions: ["ADMINISTRATOR"], // Bypass users with any of these permissions.
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredMembers: [], // Array of User IDs that get ignored.
  muteRoleName: "Muted", // Name of the role that will be given to muted users!
  timeMute: 0, // Amount of time (in minutes) a user will be muted for.
  removeMessages: true, // If the bot should remove all the spam messages when taking action on a user!
  modLogsEnabled: false, // If to enable modlogs
  modLogsChannelName: "mod-logs", // channel to send the modlogs too!
  modLogsMode: "embed",
  // And many more options... See the documentation.
});

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

client.on("messageCreate", (message) => antiSpam.message(message));

client.login("YOUR_SUPER_SECRET_TOKEN");
```

## Example (As a direct copy template without explanations)

```js
const antiSpam = new AntiSpam({
  warnThreshold: 3,
  muteThreshold: 4,
  kickThreshold: 7,
  banThreshold: 7,
  maxInterval: 2000,
  warnMessage: "{@user}, Please stop spamming.",
  kickMessage: "**{user_tag}** has been kicked for spamming.",
  muteMessage: "**{user_tag}** has been muted for spamming.",
  banMessage: "**{user_tag}** has been banned for spamming.",
  maxDuplicatesWarning: 6,
  maxDuplicatesKick: 10,
  maxDuplicatesBan: 12,
  maxDuplicatesMute: 8,
  ignoredPermissions: ["ADMINISTRATOR"],
  ignoreBots: true,
  verbose: true,
  ignoredMembers: [],
  muteRoleName: "Muted",
  muteTime: 0,
  removeMessages: true,
  modLogsEnabled: false,
  modLogsChannelName: "mod-logs",
  modLogsMode: "embed",
});
```

## Support Server

Join our [Support Server](https://discord.gg/KQgDfGr) where we help you with issues regarding the module.

## Bug Reports

If you have any bugs or trouble setting the module up, feel free to open an issue on [Github](https://github.com/Michael-J-Scofield/discord-anti-spam)

## 📝 License

Copyright © 2019 [Michael-J-Scofield](https://github.com/Michael-J-Scofield)<br />
This project is MIT licensed.

---
