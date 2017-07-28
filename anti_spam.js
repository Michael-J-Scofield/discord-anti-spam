var warned = 0;
var banned = 0;

const authors = [];

/**
 * Add simple spam protection to your discord server.
 * @param  {Bot} bot - The discord.js CLient/bot
 * @param  {object} options - Optional (Custom configuarion options)
 * @return {[type]}         [description]
 */
module.exports = function (bot, options) {
  // Set options
  const warnBuffer = (options && options.prefix) || 3;
  const maxBuffer = (options && options.prefix) || 5;
  const interval = (options && options.interval) || 1000;
  const warningMessage = (options && options.warningMessage) || "stop spamming or I'll whack your head off.";
  const banMessage = (options && options.banMessage) || "has been banned for spamming, anyone else?";

  console.log('Anti spam ready, configuration: \nwarnBuffer: ' + warnBuffer + "\nmaxBuffer: " + maxBuffer + "\nInterval: " + interval);

  bot.on('message', msg => {
    if(msg.author.id != bot.user.id){
      var now = Math.floor(Date.now());
      authors.push({
        "time": now,
        "author": msg.author.id,
        "message": msg.content
      });

      matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
          matched++;
          if (matched == warnBuffer && !warned) {
            warned = true;
            msg.reply(warningMessage);
          }
          if (matched == maxBuffer) {
            if (!banned) {
              msg.channel.send(msg.author + " " +banMessage);
              banned = true;
            }
            // Ban the user
            var user = msg.channel.guild.members.find(member => member.user.id === msg.author.id);
            if (user) {
              user.ban().then((member) => {
                 console.log("The ban hammer has spoken");
             }).catch(() => {
                 //console.log("Unable to ban for spamming, insufficient permissions or user must be a mod");
             });
            }
          }
        }
        else if (authors[i].time < now - interval) {
          authors.splice(i);
          warned = false;
          banned = false;
        }
      }
    }
  });

}
