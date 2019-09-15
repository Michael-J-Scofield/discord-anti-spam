<p align="center"><a href="https://nodei.co/npm/discord-anti-spam/"><img src="https://nodei.co/npm/discord-anti-spam.png"></a></p>

# discord-anti-spam.js
A simple module with quick setup and different options to implement anti-spam features in your bot.

## Installation
To install this module type the following command in your console:
```
npm i discord-anti-spam
```

## Support Server
Join our [Support Server](https://discord.gg/KQgDfGr) where we help you with issues regarding the module.

## Bug Reports
If you have any bugs or trouble setting the module up, feel free to open an issue on [Github](https://github.com/Michael-J-Scofield/discord-anti-spam)


## Example
Example of a basic bot handling spam messages using this module.

```js
const Discord = require("discord.js");
const client = new Discord.Client();
const DiscordAntiSpam = require("discord-anti-spam");
const AntiSpam = new DiscordAntiSpam({
  warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
  banThreshold: 5, // Amount of messages sent in a row that will cause a ban
  maxInterval: 2000, // Amount of time (in ms) in which messages are cosidered spam.
  warnMessage: "{@user}, Please stop spamming.", // Message will be sent in chat upon warning.
  banMessage: "**{user_tag}** has been banned for spamming.", // Message will be sent in chat upon banning.
  maxDuplicatesWarning: 7, // Amount of same messages sent that will be considered as duplicates that will cause a warning.
  maxDuplicatesBan: 10, // Amount of same messages sent that will be considered as duplicates that will cause a ban.
  deleteMessagesAfterBanForPastDays: 1, // Amount of days in which old messages will be deleted. (1-7)
  ignoredUsers: [], // array of ignored user ids
  ignoredGuilds: [], // array of ignored guild ids
  exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR", "MANAGE_GUILD", "BAN_MEMBERS"], // Bypass users with at least one of these permissions
  ignoreBots: true, // Ignore bot messages
  verbose: false, // Extended Logs from module
  client: client, // Client is your Discord.Client and is a required option.
  ignoredUsers: [], // Array of string user IDs that are ignored
  ignoredGuilds: [] // Array of string Guild IDs that are ignored
});

AntiSpam.on("warnEmit", (member) => console.log(`Attempt to warn ${member.user.tag}.`));
AntiSpam.on("warnAdd", (member) => console.log(`${member.user.tag} has been warned.`));
AntiSpam.on("banEmit", (member) => console.log(`Attempt to ban ${member.user.tag}.`));
AntiSpam.on("banAdd", (member) => console.log(`${member.user.tag} has been banned.`));
AntiSpam.on("dataReset", () => console.log("Module cache has been cleared."));

client.on("ready", () => console.log(`Logged in as ${client.user.tag}.`));

client.on("message", (msg) => {
  AntiSpam.message(msg);
});

client.login("YOUR_SUPER_SECRET_TOKEN");
```
