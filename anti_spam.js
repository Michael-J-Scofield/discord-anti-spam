const Discord = require("discord.js"); // Requiring Library just for the sick of being there

var authors = [];
var warned = [];
var banned = [];
var messageLog = [];

module.exports = async (client, options) => {
  /* Option Definitions */
  
  const warnBuffer = (options && options.warnBuffer) || 3; // Default Value: 3
  const maxBuffer = (options && options.maxBuffer) || 5; // Default Value: 5
  const interval = (options && options.interval) || 1000; //Default Time: 2000MS (2 Seconds in Miliseconds)
  const warningMessage = (options && options.warningMessage) || "please stop spamming!"; // Default Message: "please stop spamming!" (@User please stop spamming!)
  const banMessage = (options && options.banMessage) || "has been hit by ban hammer for spamming!"; // Default Message: "has been hit by ban hammer for spamming!" (@User has been hit by ban hammer for spamming!)
  const maxDuplicatesWarning = (options && options.maxDuplicatesWarning || 7); // Default Value: 7
  const maxDuplicatesBan = (options && options. maxDuplicatesBan || 10); // Deafult Value: 7
  const deleteMessagesAfterBanForPastDays = (options && options.deleteMessagesAfterBanForPastDays || 7); // Default Value: 10
  const exemptRoles = (options && options.exemptRoles) || []; // Default Value: Nothingness (None)
  const exemptUsers = (options && options.exemptUsers) || []; // Default Value: Nothingness (None)
  
  /* Make sure all variables have correct types */
  // TO DO: Terminate process when one of these errors is runned.

  if(isNaN(warnBuffer)) throw new Error("warnBuffer must be a number.");
  if(isNaN(maxBuffer)) throw new Error("maxBuffer must be a number.");
  if(isNaN(interval)) throw new Error("interval must be a number.");
  if(!isNaN(banMessage) || banMessage.length < 5) throw new Error("banMessage must be a string and have at least 5 charcters length.");
  if(!isNaN(warningMessage) || warningMessage.length < 5) throw new Error("warningMessage must be a string and have at least 5 characters.");
  if(isNaN(maxDuplicatesWarning)) throw new Error("maxDuplicatesWarning must be a number.")
  if(isNaN(maxDuplicatesBan)) throw new Error("maxDuplicatesBan must be a number.");
  if(isNaN(deleteMessagesAfterBanForPastDays)) throw new Error("deleteMessagesAfterBanForPastDays must be a number.");
  if(exemptRoles.constructor !== Array) throw new Error("extemptRoles must be an array.");
  if(exemptUsers.constructor !== Array) throw new Error("exemptUsers must be an array.");
  
  // Custom 'checkMessage' event that handles messages
 client.on("checkMessage", async (message) => {
 
  // Ban the User
  const banUser = async (m, banMsg) => {
    for (var i = 0; i < messageLog.length; i++) {
        if (messageLog[i].author == m.author.id) {
          messageLog.splice(i);
        }
      }
  
      banned.push(m.author.id);
  
      let user = m.guild.members.get(m.author.id);
      if (user) {
        user.ban(deleteMessagesAfterBanForPastDays).then((member) => {
          m.channel.send(`<@!${m.author.id}>, ${banMsg}`);
          return true;
       }).catch(() => {
          m.channel.send(`Oops, seems like i don't have sufficient permissions to ban <@!${message.author.id}>!`);
          return false;
      });
    }
  }
  
    
   // Warn the User
   const warnUser = async (m, reply) => {
    warned.push(m.author.id);
    m.channel.send(`<@${m.author.id}>, ${reply}`); // Regular Mention Expression for Mentions
   }

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
        if (messageLog[i].message == message.content && (messageLog[i].author == message.author.id) && (message.author.id !== client.user.id)) {
          msgMatch++;
        }
      }
      
      if (msgMatch == maxDuplicatesWarning && !warned.includes(message.author.id)) {
        warnUser(message, warningMessage);
      }

      if (msgMatch == maxDuplicatesBan && !banned.includes(message.author.id)) {
        banUser(message, banMessage);
      }

      var matched = 0;

      for (var i = 0; i < authors.length; i++) {
        if (authors[i].time > currentTime - interval) {
          matched++;
          if (matched == warnBuffer && !warned.includes(message.author.id)) {
            warnUser(message, warningMessage);
          } else if (matched == maxBuffer) {
            if (!banned.includes(message.author.id)) {
              banUser(message, banMessage);
            }
          }
        } else if (authors[i].time < currentTime - interval) {
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
}
