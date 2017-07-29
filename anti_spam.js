const authors = [];
var warned = [];
var banned = [];

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

  bot.on('message', msg => {
    if(msg.author.id != bot.user.id){
      var now = Math.floor(Date.now());
      authors.push({
        "time": now,
        "author": msg.author.id,
        "message": msg.content
      });

      matched = 1;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(msg.author.id)) {
            warned.push(msg.author.id);
            msg.channel.send(msg.author + " " + warningMessage);
          }
          if (matched == maxBuffer) {
            if (!banned.includes(msg.author.id)) {
              banned.push(msg.author.id);
              // Ban the user
              var user = msg.channel.guild.members.find(member => member.user.id === msg.author.id);
              if (user) {
                user.ban().then((member) => {
                  msg.channel.send(msg.author + " " +banMessage);
               }).catch(() => {
                  msg.channel.send("insufficient permission to kick " + msg.author + " for spamming.");
               });
              }
            }
          }
        }
        else if (authors[i].time < now - interval) {
          warned.splice(warned.indexOf(authors[i].author));
          banned.splice(warned.indexOf(authors[i].author));
          authors.splice(i);
        }
      }
    }
  });

}
