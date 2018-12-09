var authors = [];
var warned = [];
var banned = [];
var messageLog = [];

module.exports = async (client, options) => {
  /* Defining Functions */
 
  // Ban the User by Id
  const banUser = async (m, user) => {
    for (var i = 0; i < messageLog.length; i++) {
      if (messageLog[i].author === m.author.id) {
        messageLog.splice(i);
      }
  } 
    
   // Warn the User
   const warnUser = async (m, reply) => {
    warned.push(m.author.id);
    m.channel.send(`<!${m.author.id}>, ${reply}`); // Regular Mention Expression for Mentions
   }
  
  /* Option Definitions */
   
  const warnBuffer = (options && options.warnBuffer) || 3; // Default Value: 3
  const maxBuffer = (options && options.maxBuffer) || 5; // Default Value: 5
  const interval = (options && options.interval) || 1000; //Default Time: 2000MS (2 Seconds in Miliseconds)
  const warningMessage = (options && options.warningMessage) || "please stop spamming!"; // Default Message: "please stop spamming!" (@User please stop spamming!)
  const banMessage = (options && options.banMessage) || "has been hit by ban hammer for spamming!"; // Default Message: "has been hit by ban hammer for spamming!" (@User has been hit by ban hammer for spamming!)
  const maxDuplicatesWarning = (options && options. maxDuplicatesWarning || 7); // Default Value: 7
  const maxDuplicatesBan = (options && options. maxDuplicatesBan || 10); // Deafult Value: 7
  const deleteMessagesAfterBanForPastDays = (options && options.deleteMessagesAfterBanForPastDays || 7); // Default Value: 10
  const exemptRoles = (options && options.exemptRoles) || []; // Default Value: Nothingness (None)
  const exemptUsers = (options && options.exemptUsers) || []; // Default Value: Nothingness (N  one)

 client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type !== "text" || !message.member || !message.guild || !message.channel.guild) return;
   
    if (message.member.roles.some(r => exemptRoles.includes(r.name)) || exemptUsers.includes(message.author.tag)) return;

    if (message.author.id !== client.user.id) {
      let currentTime = Math.floor(Date.now());
      authors.push({
        "time": currentTime,
        "author": message.author.id
      });
      
      messageLog.push({
        "message": message.content,
        "author": message.author.id
      });
      
      let msgMatch = 0;
      for (var i = 0; i < messageLog.length; i++) {
        if (messageLog[i].message == msg.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
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

      var matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > currentTime - interval) {
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
        if (messageLog.length >= 200) {
          messageLog.shift();
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
    msg.channel.send(msg.author + " " + warningMessage);
  }

  /**
   * Ban a user by the user id
   * @param  {Object} msg
   * @param  {string} userid userid
   * @return {boolean} True or False
   */
  function ban(msg, userid) {
    for (var i = 0; i < messageLog.length; i++) {
      if (messageLog[i].author == msg.author.id) {
        messageLog.splice(i);
      }
    }

    banned.push(msg.author.id);

    var user = msg.channel.guild.members.find(member => member.user.id === msg.author.id);
    if (user) {
      user.ban(deleteMessagesAfterBanForPastDays).then((member) => {
        msg.channel.send(msg.author + " " +banMessage);
        return true;
     }).catch(() => {
        msg.channel.send("insufficient permission to kick " + msg.author + " for spamming.");
        return false;
     });
    }
  }

}
