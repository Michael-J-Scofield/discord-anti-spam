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
const Discord = require('discord.js');
const client = new Discord.Client();
const DiscordAntiSpam = require('discord-anti-spam');
const AntiSpam = new DiscordAntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 15, // Amount of duplicate messages that trigger a ban.
	deleteMessagesAfterBanForPastDays: 1, // Days of messages that get deleted upon banning a user.
	exemptPermissions: [
		'MANAGE_MESSAGES',
		'ADMINISTRATOR',
		'MANAGE_GUILD',
		'BAN_MEMBERS'
	], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: false, // Extended Logs from module.
	ignoredUsers: [], // Array of User IDs that get ignored.
	ignoredRoles: [], // Array of Role IDs or names that are ignored.
	ignoredGuilds: [], // Array of Guild IDs that are ignored.
	ignoredChannels: [] // Array of channels IDs that are ignored.
});

AntiSpam.on('warnAdd', member => console.log(`${member.user.tag} has been warned.`));
AntiSpam.on('kickAdd', member => console.log(`${member.user.tag} has been kicked.`));
AntiSpam.on('banAdd', member => console.log(`${member.user.tag} has been banned.`));
AntiSpam.on('dataReset', () => console.log('Module cache has been cleared.'));
AntiSpam.on('spamThresholdBan',
	(member, duplicate) => console.log(`${member.user.tag} Has reached the ban threshold for spamming!`)
);
client.on('ready', () => console.log(`Logged in as ${client.user.tag}.`));

client.on('message', msg => {
	AntiSpam.message(msg);
});

client.login('YOUR_SUPER_SECRET_TOKEN');
```
