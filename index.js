if (Number(process.version.slice(1).split(".")[0]) < 10) throw new Error("Node 10.0.0 or higher is required. Update Node on your system.");

/**
 * This function always return false
 */
const falsify = () => false;

/**
 * This function formats a string by replacing some keywords with variables
 * @param {string} string The non-formatted string
 * @param {object} message The Discord Message object
 * @returns {string} The formatted string
 */
const formatString = (string, message) => {
  return string.replace(/{@user}/g, message.author.toString())
  .replace(/{user_tag}/g, message.author.tag)
  .replace(/{server_name}/g, message.guild.name);
}

const Events = require("events");
let users = [],
    warnedUsers = [],
    bannedUsers = [],
    kickedUsers = [],
    messageCache = [];

class antiSpam extends Events.EventEmitter {
  constructor(options) {
    super(options);

    if (!options) options = {};

    this.warnThreshold = options.warnThreshold || 3;
    this.banThreshold = options.banThreshold || 5;
    this.kickThreshold = options.kickThreshold || 5;
    this.maxInterval = options.maxInterval || 2000;
    this.warnMessage = options.warnMessage || "{@user}, Please stop spamming.";
    this.banMessage = options.banMessage || "**{user_tag}** has been banned for spamming.";
    this.kickMessage = options.kickMessage || "**{user_tag}** has been kicked for spamming.";
    this.maxDuplicatesWarning = options.maxDuplicatesWarning || 7;
    this.maxDuplicatesBan = options.maxDuplicatesBan || 10;
    this.maxDuplicatesKick = options.maxDuplicatesKick || 10;
    this.deleteMessagesAfterBanForPastDays = options.deleteMessagesAfterBanForPastDays || 1;
    this.exemptRoles = options.exemptRoles || falsify;
    this.exemptUsers = options.exemptUsers || falsify;
    this.exemptGuilds = options.exemptGuilds || falsify;
    this.exemptChannels = options.exemptChannels || falsify;
    this.exemptPermissions = options.exemptPermissions || [];
    this.ignoreBots = options.ignoreBots || true;
    this.verbose = options.verbose || false;
    this.ignoredUsers = options.ignoredUsers || [];
    this.ignoredGuilds = options.ignoredGuilds || [];
    this.ignoredChannels = options.ignoredChannels || [];

  }

  message(message) {
    if (this.ignoreBots === true && message.author.bot) return;
    if (message.channel.type !== "text") return;
    if (!message.guild && message.member) return;
    if (message.client && message.client.user && message.author.id === message.client.user.id) return;
    if (this.ignoredGuilds.includes(message.guild.id)) return;
    if (this.ignoredUsers.includes(message.author.id)) return;
    if (this.ignoredChannels.includes(message.channel.id)) return;

    for (const permission of this.exemptPermissions) {
      if (message.member.hasPermission(permission)) {
        return;
      }
    }

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
    if (this.exemptChannels && this.exemptChannels(message.channel) === true) return;

    const banUser = (msg) => {
      // Removes the user messages from the message cache
      messageCache = messageCache.filter((m) => m.author !== msg.author.id);
      // Mark the user as banned
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

      let msgToSend = formatString(this.banMessage, msg);

      msg.channel.send(msgToSend).catch(e => {
        if (this.verbose === true) {
          console.log(e);
        }
      });
      return true;
    };

    const kickUser = (msg) => {
      // Removes the user messages from the message cache
      messageCache = messageCache.filter((m) => m.author !== msg.author.id);
      // Mark the user as kicked
      kickedUsers.push(msg.author.id);

      if (!msg.member.kickable) {
        if (this.verbose == true) console.log(`**${msg.author.tag}** (ID: ${msg.author.id}) could not be kicked, insufficient permissions.`);
        msg.channel.send(`Could not kick **${msg.author.tag}** because of inpropper permissions.`).catch(e => {
          if (this.verbose === true) {
            console.log(e);
          }
        });
        return false;
      }

      try {
        msg.member.kick("Spamming!");
        this.emit("kickAdd", msg.member);
      } catch (e) {
        if (this.verbose == true) console.log(`**${msg.author.tag}** (ID: ${msg.author.id}) could not be kicked, ${e}.`);
        msg.channel.send(`Could not kick **${msg.author.tag}**. because \`${e}\`.`).catch(e => {
          if (this.verbose === true) {
            console.log(e);
          }
        });
        return false;
      }

      let msgToSend = formatString(this.kickMessage, msg);

      msg.channel.send(msgToSend).catch(e => {
        if (this.verbose === true) {
          console.log(e);
        }
      });
      return true;
    };

    const warnUser = (msg) => {
      // Mark the user as warned
      warnedUsers.push(msg.author.id);
      this.emit("warnAdd", message.member);

      let msgToSend = formatString(this.warnMessage, msg);

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
      "content": message.content,
      "author": message.author.id
    });

    let messageMatches = messageCache.filter((m) => m.content === message.content && m.author === message.author.id).length;

    if (messageMatches === this.maxDuplicatesWarning && !warnedUsers.includes(message.author.id)) {
      warnUser(message);
      this.emit("warnEmit", message.member);
    }

    if (messageMatches === this.maxDuplicatesBan) {
      banUser(message);
      this.emit("banEmit", message.member);
    }

    if (messageMatches === this.maxDuplicatesKick && !kickedUsers.includes(message.author.id)) {
      kickUser(message);
      this.emit("kickEmit", message.member);
    }

    let spamMatches = users.filter((u) => u.time > Date.now() - this.maxInterval && u.author === message.author.id).length;

    if (spamMatches === this.warnThreshold && !warnedUsers.includes(message.author.id)) {
      warnUser(message);
      this.emit("warnEmit", message.member);
    }

    if (spamMatches === this.banThreshold) {
      banUser(message);
      this.emit("banEmit", message.member);
    }

    if (spamMatches === this.kickThreshold && !kickedUsers.includes(message.author.id)) {
      kickUser(message);
      this.emit("kickEmit", message.member);
    }
  }

  getData() {
    return {
      messageCache,
      bannedUsers,
      kickedUsers,
      warnedUsers,
      users
    };
  }

  resetData() {
    messageCache = [];
    bannedUsers = [];
    kickedUsers = [];
    warnedUsers = [];
    users = [];

    this.emit("resetData");
    return true;
  }
}

module.exports = antiSpam;
