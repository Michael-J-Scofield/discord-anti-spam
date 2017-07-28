<p align="center"><a href="https://nodei.co/npm/discord-anti-spam/"><img src="https://nodei.co/npm/discord-anti-spam.png"></a></p>

# discord-anti-spam.js
An extremely simple module to prevent spam on your discord server.

## Installation
This module assumes you already have a basic [Discord.js](https://discord.js.org/#/) bot setup.

Once you've done this, setting the anti spam up will be very easy.
And you can follow the code  below to get started!

```js
var anti_spam = require("discord-anti-spam");

antispam(bot, {
  warnBuffer: 3, //Maximum amount of messages allowed to send in the interval time before getting warned.
  maxBuffer: 5, // Maximum amount of messages allowed to send in the interval time before getting banned.
  interval: 1100, // Amount of time in ms users can send a maximum of the maxBuffer variable before getting banned.
  warningMessage: "stop spamming or I'll whack your head off.", // Warning message send to the user indicating they are going to fast.
  banMessage: "has been banned for spamming, anyone else?" // Ban message, always tags the banned user in front of it.
});

```
That's it. enjoy not being raided :)

If you have any issues, bugs or trouble setting the module up. feel free to open an issue on [Github](https://github.com)
