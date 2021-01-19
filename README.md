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
const Discord = require('discord.js');
const client = new Discord.Client();
const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	muteThreshold: 4, // Amount of messages sent in a row that will cause a mute
	kickThreshold: 7, // Amount of messages sent in a row that will cause a kick.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	muteMessage: '**{user_tag}** has been muted for spamming.',// Message that will be sent in chat upon muting a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
	exemptPermissions: [ 'ADMINISTRATOR'], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredUsers: [], // Array of User IDs that get ignored.
	muteRoleName: "Muted", // Name of the role that will be given to muted users!
	removeMessages: true // If the bot should remove all the spam messages when taking action on a user!
	// And many more options... See the documentation.
});

client.on('ready', () => console.log(`Logged in as ${client.user.tag}.`));

client.on('message', (message) => antiSpam.message(message)); 

client.login('YOUR_SUPER_SECRET_TOKEN');
```

## Support Server

Join our [Support Server](https://discord.gg/KQgDfGr) where we help you with issues regarding the module.

## Bug Reports

If you have any bugs or trouble setting the module up, feel free to open an issue on [Github](https://github.com/Michael-J-Scofield/discord-anti-spam)
