const authors = [];
var warned = [];
var banned = [];
var messagelog = [];

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
  const maxDuplicatesWarning = (options && options.duplicates || 7);
  const maxDuplicatesBan = (options && options.duplicates || 10);
  const deleteMessagesAfterBanForPastDays = (options && options.deleteMessagesAfterBanForPastDays || 7);
  const logChannel = options.logChannel;

  bot.on('message', msg => {

    //Always return with an bot.....
    if(msg.author.bot) return;

    if(msg.author.id != bot.user.id){
      var now = Math.floor(Date.now());
      authors.push({
        "time": now,
        "author": msg.author.id
      });
      messagelog.push({
        "message": msg.content,
        "author": msg.author.id
      });

      // Check how many times the same message has been sent.
      var msgMatch = 0;
      for (var i = 0; i < messagelog.length; i++) {
        if (messagelog[i].message == msg.content && (messagelog[i].author == msg.author.id) && (msg.author.id !== bot.user.id)) {
          msgMatch++;
        }
      }
      // Check matched count
      if (msgMatch == maxDuplicatesWarning && !warned.includes(msg.author.id)) {
        warn(msg, msg.author.id);
      }
      if (msgMatch == maxDuplicatesBan && !banned.includes(msg.author.id)) {
        ban(msg, msg.author.id);
      }

      matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > now - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(msg.author.id)) {
            warn(msg, msg.author.id);
          }
          else if (matched == maxBuffer) {
            if (!banned.includes(msg.author.id)) {
              ban(msg, msg.author.id);
            }
          }
        }
        else if (authors[i].time < now - interval) {
          authors.splice(i);
          warned.splice(warned.indexOf(authors[i]));
          banned.splice(warned.indexOf(authors[i]));
        }
        if (messagelog.length >= 200) {
          messagelog.shift();
        }
      }
    }
  });

  /**
   * Warn a user
   * @param  {Object} msg
   * @param  {string} userid userid
   */
  function warn(msg, userid) {
    warned.push(msg.author.id);
    msg.author.send(msg.author.username + ", " + warningMessage);
    logEvent(msg, {
      title: "User Warned",
      desc: "A user has been warned via the anti-spam system. See below for details:",
      fields: [
        ["Username", msg.author.username, true],
        ["Channel", msg.channel.name, true],
        ["Reason", "The anti-spam system has observed this user sending spamm to the server and has been warned. If this behavior continues the user will be banned.", false]
      ]
    });
  }

  /**
   * Ban a user by the user id
   * @param  {Object} msg
   * @param  {string} userid userid
   * @return {boolean} True or False
   */
  function ban(msg, userid) {
    for (var i = 0; i < messagelog.length; i++) {
      if (messagelog[i].author == msg.author.id) {
        messagelog.splice(i);
      }
    }

    banned.push(msg.author.id);

    var user = msg.channel.guild.members.find(member => member.user.id === msg.author.id);
    if (user) {
      user.ban(deleteMessagesAfterBanForPastDays).then((member) => {
        logEvent(msg, new {
          title: "User Banned", 
          desc: "A user has been banned via the anti-spam system. See below for details:",
          fields: [
            ["Username", msg.author.username, true],
            ["Channel", msg.channel.name, true],
            ["Reason", "The anti-spam system has observed this user repeately spamming the server. After being warned multiple times, they have been banned.", false]
          ]
        })
        msg.author.send(msg.author.username + ", " + banMessage);
        return true;
     }).catch(() => {
        msg.channel.send("insufficient permission to ban " + msg.author + " for spamming.");
        return false;
     });
    }
  }

  /**
   * Post Log Using Embed
   * @param {Object} msg
   * @param {Object} data
   */
  function logEvent(msg, data){
    const embed = new Discord.RichEmbed();
    if(data.title != null){
        embed.setTitle(data.title);
    }
    if(data.desc != null){
        embed.setDescription(data.desc);
    }
    if(data.fields != null){
        data.fields.forEach(field => {
            if(field.length == 3){
                embed.addField(field[0], field[1], field[2]);
            } else {
                embed.addField(field[0], field[1]);
            }
        });
    }
    embed.setColor(0xf07a3a);
    const channel = logChannel != "" ? msg.client.channels.get(logChannel) : msg.channel;
    channel.send(embed);
  }
}