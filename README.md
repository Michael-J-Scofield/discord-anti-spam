<p align="center"><a href="https://nodei.co/npm/discord-anti-spam/"><img src="https://nodei.co/npm/discord-anti-spam.png"></a></p>

# discord-anti-spam.js
A simple module with quick setup and different options to implement Anti-Spam system in your bot.

**DISCLAMER:** You can only setup 1 set of configuration per client. (That means that you can't configure settings for each server for now. You can only modify in which guild checker is run and in which checker is not run.) 

## Installation
To install this module type the following command in your console:
```
npm i discord-anti-spam
```

## Example
Example of a basic bot handling spam messages using this module.

```js
const Discord = require('discord.js');
const antispam = require('discord-anti-spam'); // Requiring this module.
const client = new Discord.Client();

client.on('ready', () => {
  // Module Configuration Constructor
   antispam(client, {
        warnBuffer: 3, // Maximum ammount of messages allowed to send in the interval time before getting warned.
        maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
        interval: 2000, // Amount of time in ms users can send the maxim amount of messages(maxBuffer) before getting banned. 
        warningMessage: "please stop spamming!", // Message users receive when warned. (message starts with '@User, ' so you only need to input continue of it.) 
        banMessage: "has been hit by ban hammer for spamming!", // Message sent in chat when user is banned. (message starts with '@User, ' so you only need to input continue of it.) 
        maxDuplicatesWarning: 7,// Maximum amount of duplicate messages a user can send in a timespan before getting warned.
        maxDuplicatesBan: 10, // Maximum amount of duplicate messages a user can send in a timespan before getting banned.
        deleteMessagesAfterBanForPastDays: 7, // Deletes the message history of the banned user in x days.
        exemptRoles: ["Moderator"], // Name of roles (case sensitive) that are exempt from spam filter.
        exemptUsers: ["MrAugu#9016"] // The Discord tags of the users (e.g: MrAugu#9016) (case sensitive) that are exempt from spam filter.
      });
      
  // Rest of your code
});

client.on('message', msg => {
  client.emit('checkMessage', msg); // This runs the filter on any message bot receives in any guilds.
  
  // Rest of your code
}

client.login('token');
```
The code above will allow users to send a maximum of 3 messages. It will allow a maximum of 5 messages to be sent in an interval of 2000 Milliseconds (2 Seconds in Milliseconds), if more bot attempts to ban the user. The users will be warned with message `@User, please stop spamming!`. If user gets banned others will be notified with message `@User has been hit by ban hammer in for spamming!`. Maximum number of duplicated messages before user gets warned is 7. Maximum number of duplicated messages before bot attempts to ban user is 10. If user gets banned, the bot will delete all messages from that user that have been sent in the past 7 days. The bot will ignore any people with a role named `Moderator` and bot will ignore people named `MrAugu#9016`.

## Documentation

```js
antispam(<Client>);
```
This will configure module to run on its default configuration.<br>
`<Client>` - Variable that defines `new Discord.Client()`<br>
`antispam` - Variable that defines `require('discord-anti-spam')` <br>
<br>
```js
client.emit('checkMessage', <Message>)
```
`<Message>` - Variable that defines the message itself. (`client.on('message', async (msg) =>{})` in this situation msg is the <Message> variable.)
This will basically send your message to module. In fact is REQUIERED for module to run.<br>
<br>
```js
antispam(client, {
        warnBuffer: 3,
        maxBuffer: 5,
        interval: 2000,
        warningMessage: "",
        banMessage: "",
        maxDuplicatesWarning: 7,
        maxDuplicatesBan: 10,
        deleteMessagesAfterBanForPastDays: 7,
        exemptRoles: [],
        exemptUsers: []
      });
```
`antispam` - Variable that defines `require('discord-anti-spam')` <br>
`<Client>` - Required, Discord.Client<br>
`warnBuffer` - Optional, Type: Integer<br>
`maxBuffer` - Optional, Type: Integer<br>
`interval` - Optional, Type: Integer<br>
`warningMessage` - Optonal, Type: String, Minimum 5 Characters<br>
`banMessage` - Optional, Type: String, Minimum 5 Characters<br>
`maxDuplicatesWarning` - Optional, Type: Integer<br>
`maxDuplicatesBan` - Optional, Type: Integer<br>
`deleteMessagesAfterBanForPastDays` - Optional, Type: Integer<br>
`exemptRoles` - Optional, Type: Array<br>
`exemptUsers`- Optional, Type: Array<br>
<br>
**NOTE:** The module **will** throw errors for assigning incorrect types to configuration values.<br>
<br>
That's pretty much all. &lt;3<br>
If you have any issues, bugs or trouble setting the module up, feel free to open an issue on [Github](https://github.com/Michael-J-Scofield/discord-anti-spam)

## Contributors

- [Michael-J-Scofield](https://github.com/Michael-J-Scofield)
- [MrAugu](https://github.com/MrAugu)
- [y21](https://github.com/y21)
- [thomas-crane](https://github.com/thomas-crane)
- [joker314](https://github.com/joker314)
- [Kolkies](https://github.com/Kolkies)
- [64ps](https://github.com/64ps)
- [iWikipedia](https://github.com/iWikipedia)
