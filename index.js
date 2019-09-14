if (Number(process.version.slice(1).split(".")[0]) < 10) throw new Error("Node 10.0.0 or higher is required. Update Node on your system.");

const falsify = () => {
  return false;
}

let users = [],
warnedUsers = [],
bannedUsers = [],
messageCache = [];

const Events = require("events");

class antiSpam extends Events.EventEmitter {
  constructor(options) {
    super(options);

    if (!options) options = {};

    this.warnThreshold = options.warnThreshold || 3;
    this.banThreshold = options.banThreshold || 5;
    this.maxInterval = options.maxInterval || 2000;
    this.warnMessage = options.warnMessage || "{@user}, Please stop spamming.";
    this.banMessage = options.banMessage || "**{user_tag}** has been banned for spamming.";
    this.maxDuplicatesWarning = options.maxDuplicatesWarning || 7;
    this.maxDuplicatesBan = options.maxDuplicatesBan || 10;
    this.deleteMessagesAfterBanForPastDays = options.deleteMessagesAfterBanForPastDays || 1;
    this.exemptRoles = options.exemptRoles || falsify;
    this.exemptUsers = options.exemptUsers || falsify;
    this.exemptGuilds = options.exemptGuilds || falsify;
    this.exemptPermissions = options.exemptPermissions || [];
    this.ignoreBots = options.ignoreBots || true;
    this.verbose = options.verbose || false;
    this.client = options.client;
    this.ignoredUsers = options.ignoredUsers || [];
    this.ignoredGuilds = options.ignoredGuilds || [];
    
    if (!this.client) {
      console.log("[FATAL ERROR]: Discord Anti Spam - options.client is not optional.");
      process.exit(5);
    }
  }

  message(message) {
    if (this.ignoreBots === true && message.author.bot) return;
    if (message.channel.type !== "text") return;
    if (!message.guild && message.member) return;
    if (this.client && this.client.user && message.author.id === this.client.user.id) return;
    if (this.ignoredGuilds.includes(message.guild.id)) return;
    if (this.ignoredUsers.includes(message.author.id)) return;
    
    let hasRoleExempt = false;
    for (const role of message.member.roles) {
      if (hasRoleExempt === true) return;
      if (this.exemptRoles && this.exemptRoles(role) === true) {
        hasRoleExempt = true;
        return true;
      }
    }

    if (hasRoleExempt === true) return;
    if (this.exemptUsers && this.exemptUsers(message.member) === true) return;
    if (this.exemptGuilds && this.exemptGuilds(message.guild) === true) return;

    const banUser = (msg) => {
      for (let i = 0; i < messageCache.length; i++) {
        if (messageCache[i].author == msg.author.id) {
          messageCache.splice(i);
        }
      }

      bannedUsers.push(msg.author.id);

      if (!msg.member.bannable) {
        if (this.verbose == true) console.log(`**${msg.author.tag}** (ID: ${msg.author.id}) could not be banned, insufficient permissions.`);
        msg.channel.send(`Could not ban **${msg.author.tag}** because of inpropper permissions.`).catch(e => {
          if (this.verbose === true) {
            console.log(e);
          }
        });
        return false;
      }

      try {
        msg.member.ban({ reason: "Spamming!", days: this.deleteMessagesAfterBanForPastDays });
        this.emit("banAdd", msg.member);
      } catch (e) {
        if (this.verbose == true) console.log(`**${msg.author.tag}** (ID: ${msg.author.id}) could not be banned, ${e}.`);
        msg.channel.send(`Could not ban **${msg.author.tag}** because \`${e}\`.`).catch(e => {
          if (this.verbose === true) {
            console.log(e);
          }
        });
        return false;
      }

      let msgToSend = this.banMessage.replace(/{user_tag}/g, msg.author.tag);

      msg.channel.send(msgToSend).catch(e => {
        if (this.verbose === true) {
          console.log(e);
        }
      });
      return true;
    };

    const warnUser = (msg) => {
      warnedUsers.push(msg.author.id);
      this.emit("warnAdd", message.member);

      let msgToSend = this.warnMessage;
      msgToSend = msgToSend.replace(/{user_tag}/g, msg.author.tag);
      msgToSend = msgToSend.replace(/{@user}/g, `<@${msg.author.id}>`);

      msg.channel.send(msgToSend).catch(e => {
        if (this.verbose === true) {
          console.log(e);
        }
      });

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

    let messageMatches = 0;

    for (let i = 0; i < messageCache.length; i++) {
      if (messageCache[i].message === message.content && messageCache[i].author === message.author) messageMatches++;
    }

    if (messageMatches === this.maxDuplicatesWarning && !warnedUsers.includes(message.author.id)) {
      warnUser(message);
      this.emit("warnEmit", message.member);
    }

    if (messageMatches === this.maxDuplicatesBan && !bannedUsers.includes(message.author.id)) {
      banUser(message);
      this.emit("banEmit", message.member);
    }

    let spamMatches = 0;

    for (let i = 0; i < users.length; i++) {
      if (users[i].time > Date.now() - this.maxInterval) {
        spamMatches++;
      }
    }

    if (spamMatches === this.warnThreshold && !warnedUsers.includes(message.author.id)) {
      warnUser(message);
      this.emit("warnEmit", message.member);
    }

    if (spamMatches === this.banThreshold && !bannedUsers.includes(message.author.id)) {
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
    return true;
  }
}

module.exports = antiSpam;
