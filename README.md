<p align="center"><a href="https://nodei.co/npm/discord-anti-spam/"><img src="https://nodei.co/npm/discord-anti-spam.png"></a></p>

# discord-anti-spam.js
A simple module with quick setup and different options to implement Anti-Spam system in your bot.

**DISCLAMER:** You can only setup 1 set of configuration per client. (That means that you can't configure settings for each server for now. You can only modify in which guild checker is run and in which checker is not run.) 

## Installation
To install this module type in your console command below:
```
npm i discord-anti-spam
```

## Documentation
In example below you can see where to place code, how to edit configuration, how to use default one, and obviosuly how to get it to work.

```js
const Discord = require('discord.js');
const antispam = require('discord-anti-spam'); // Requiring this module.
const client = new Discord.Client();

client.on('ready', () => {
  // Start of module configuration
   antispam(client, {
        warnBuffer: 3, // Maximum ammount of messages allowed to send in the interval time before getting warned.
        maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
        interval: 1000, // Amount of time in ms users can send the maxim amount of messages(maxBuffer) before getting banned. 
        warningMessage: "please stop spamming!", // Message users receive when warned. (message starts with '@User, ' so you only need to input continue of it.) 
        banMessage: "has been hit by ban hammer for spamming!", // Message sent in chat when user is banned. (message starts with '@User, ' so you only need to input continue of it.) 
        maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned.
        maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned.
        deleteMessagesAfterBanForPastDays: 7, // Deletes the message history of the banned user in x days.
        exemptRoles: [], // Name of roles (case sensitive) that are exempt from spam filter.
        exemptUsers: [] // The Discord tags of the users (e.g: MrAugu#9016) (case sensitive) that are exempt from spam filter.
      });
  // End of module configuration
  
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  client.emit('checkMessage', msg); // This runs the filter on any message bot receives in any guilds 
}

client.login('token');
```
The example below contains default values. Any element of constructor is optional. If not specified, it will be replaced by its default value. In fact you only need `antispam(<Client>);` in ready event (<Client> is your client variable in example below was simply client) and `<Client>.emit('checkMessage', <Message>);`(<Client> was specified already. <Message>)


## Installation
This module assumes you already have a basic [Discord.js](https://discord.js.org/#/) bot setup.

Once you've done this, setting the anti spam up will be very easy.
And you can follow the code  below to get started!

```js
const antispam = require("discord-anti-spam");

antispam(bot, {
  warnBuffer: 3, //Maximum amount of messages allowed to send in the interval time before getting warned.
  maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
  interval: 1000, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
  warningMessage: "stop spamming or I'll whack your head off.", // Warning message send to the user indicating they are going to fast.
  banMessage: "has been banned for spamming, anyone else?", // Ban message, always tags the banned user in front of it.
  maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned
  maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned
  deleteMessagesAfterBanForPastDays: 7 // Delete the spammed messages after banning for the past x days.
  exemptRoles: ["Admin", "Chat Moderator"] // The names of the roles which should not be spam-filtered
  exemptUsers: ["user#1234"] // The Discord tags of the users who should not be spam-filtered
});

```
That's it. enjoy not being raided :)

If you have any issues, bugs or trouble setting the module up. feel free to open an issue on [Github](https://github.com/Michael-J-Scofield/discord-anti-spam)
