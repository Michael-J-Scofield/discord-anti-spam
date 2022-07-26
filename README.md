<p align="center"><a href="https://nodei.co/npm/discord-anti-spam/"><img src="https://nodei.co/npm/discord-anti-spam.png"></a></p>

# discord-anti-spam.js

A simple module with quick setup and different options to implement anti-spam features in your bot.

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
const { Client, GatewayIntentBits, Partial } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});
const AntiSpam = require("discord-anti-spam");
const antiSpam = new AntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  muteTreshold: 6, // Amount of messages sent in a row that will cause a mute.
  kickTreshold: 9, // Amount of messages sent in a row that will cause a kick.
  banTreshold: 12, // Amount of messages sent in a row that will cause a ban.
  warnMessage: "Stop spamming!", // Message sent in the channel when a user is warned.
  muteMessage: "You have been muted for spamming!", // Message sent in the channel when a user is muted.
  kickMessage: "You have been kicked for spamming!", // Message sent in the channel when a user is kicked.
  banMessage: "You have been banned for spamming!", // Message sent in the channel when a user is banned.
  unMuteTime: 60, // Time in minutes before the user will be able to send messages again.
  verbose: true, // Whether or not to log every action in the console.
  removeMessages: true, // Whether or not to remove all messages sent by the user.
  ignoredPermissions: [PermissionFlagsBits.Administrator], // If the user has the following permissions, ignore him.
  // For more options, see the documentation:
});

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

client.on("messageCreate", (message) => antiSpam.message(message));

client.login("YOUR_SUPER_SECRET_TOKEN");
```

## Support Server

Join our [Support Server](https://discord.gg/KQgDfGr) where we help you with issues regarding the module.

## Bug Reports

If you have any bugs or trouble setting the module up, feel free to open an issue on [Github](https://github.com/Michael-J-Scofield/discord-anti-spam)

## 📝 License

Copyright © 2019 [Michael-J-Scofield](https://github.com/Michael-J-Scofield)<br />
This project is MIT licensed.

---
