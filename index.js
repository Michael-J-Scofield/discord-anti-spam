if (Number(process.version.slice(1).split(".")[0]) < 10) throw new Error("Node 10.0.0 or higher is required. Update Node on your system.");

var users = [];
var warnedUsers = [];
var bannedUsers = [];
var messageCache = [];
const Events = require("events");

class antiSpam extends Events.EventEmitter {
  constructor(options) {
    this.warnThreshold = options.warnThreshold || 3;
    this.banThreshold = options.banThreshold || 5;
    this.maxInterval = options.maxInterval || 2000;
    this.warnMessage = options.warnMessage || "{@user}, Please stop spamming.";
    this.banMessage = options.banMessage || "**{user_tag}** has been banned for spamming.";
    this.maxDuplicatesWarning = options.maxDuplicatesWarning || 7;
    this.maxDuplicatesBan = options.maxDuplicatesBan || 10;
    this.deleteMessagesAfterBanForPastDays = options.deleteMessagesAfterBanForPastDays || 1;
    this.exemptRoles = options.exemptRoles || (role) => return false;
    this.exemptUsers = options.exemptUsers || (member) => return false;
    this.exemptGuilds = options.exemptGuilds || (guild) => return false;
    this.exemptPermissions = options.exemptPermissions || [];
    this.ignoreBots = options.ignoreBots || true;
    this.verbose = options.verbose || false;
    this.client = options.client;

    if (!this.client) {
      this.emit("error", "options.client is not optional.");
    }

    this.emit("ready");
  }

  message(message) {
    if (this.ignoreBots === true && message.author.bot) return;
    if (message.channel.type !== "text") return;
    if (!message.default || !message.deleted || !message.channel || !message.author || !message.content) return;
    if (!message.guild || !message.member) return;
    if (this.client && this.client.user && message.author.id === this.client.user.id);

    var hasRoleExtempt = false;
    for (const role of message.member.roles) {
      if (hasRoleExtempt === true) return;
      if (this.extemptRoles(role) && this.extemptRoles(role) === true) {
        hasRoleExtempt = true;
        return true;
      }
    }

    if (hasRoleExtempt === true) return;
    if (this.exemptUsers(message.member) && this.exemptUsers(message.member) === true) return;
    if (this.exemptGuilds(message.guild) && this.exemptGuilds(message.guild) === true) return;

    const banUser = (msg) => {
      for (var i = 0; i < messageCache.length; i++) {
        if (messageLog[i].author == msg.author.id) {
          messageCache.splice(i);
        }
      }

      bannedUsers.push(msg.author.id);

      if (!msg.author.bannable) {
        if (this.verbose == true) console.log(`**${msg.author.tag}** (ID: ${msg.author.id}) could not be banned, insufficient permissions.`);
        msg.channel.send(`Could not ban **${msg.author.tag}** because of inpropper permissions.`).catch(e => this.verbose === true ? console.log(e));
        return false;
      }

      try {
        msg.member.ban({ reason: "Spamming!", days: this.deleteMessagesAfterBanForPastDays });
        this.emit("banAdd", msg.member);
      } catch (e) {
        if (this.verbose == true) console.log(`**${msg.author.tag}** (ID: ${msg.author.id}) could not be banned, ${e}.`);
        msg.channel.send(`Could not ban **${msg.author.tag}** because \`${e}\`.`).catch(e => this.verbose === true ? console.log(e));
        return false;
      }

      var msgToSend = this.banMessage;
      msgToSend = msgToSend.replace(/{user_tag}/g, msg.author.tag);

      msg.channel.send(msgToSend).catch(e => this.verbose === true ? console.log(e));
      return true;
    };

    const warnUser = (msg) => {
      warnedUsers.push(msg.author.id);
      this.emit("warnAdd", message.member);

      var msgToSend = this.warnMessage;
      msgToSend = msgToSend.replace(/{user_tag}/g, msg.author.tag);
      msgToSend = msgToSend.replace(/{@user}/g, `<@${msg.author.id}>`);

      msg.channel.send(msgToSend).catch(e => this.verbose === true ? console.log(e));
      return true;
    };

    users.push({
      "time": Date.now(),
      "author": message.author.id
    });

    messageCache.push({
      "message": message.content,
      "author": message.author.id
    });

    var messageMatches = 0;

    for (var i = 0; i < messageCache.length; i++) {
      if (messageCache[i].message === message.content && messageCache[i].author === message.author) messageMatches++;
    }

    if (messageMatches === maxDuplicatesWarning && !warnedUsers.includes(message.author.id)) {
      warnUser(message);
      this.emit("warnEmit", message.member);
    }

    if (messageMatches === maxDuplicatesBan && !bannedUsers.includes(message.author.id)) {
      banUser(message);
      this.emit("banEmit", message.member);
    }

    var spamMatches = 0;

    for (var i = 0; i < authors.length; i++) {
      if (authors[i].time > Date.now() - interval) {
        spamMatches++;
      }
    }

    if (spamMatches === warnThreshold && !warnedUsers.includes(message.author.id)) {
      warnUser(message);
      this.emit("warnEmit", message.member);
    }

    if (spamMatches === banThreshold && !bannedUsers.includes(message.author.id)) {
      banUser(message);
      this.emit("banEmit", message.member);
    }
  }

  getData() {
    return {
      messageCache,
      bannedUsers,
      warnedUsers,
      users
    };
  }

  resetData() {
    messageCache = [];
    bannedUsers = [];
    warnedUsers = [];
    users = [];

    this.emit("resetData");
  }
}

module.exports = antiSpam;
