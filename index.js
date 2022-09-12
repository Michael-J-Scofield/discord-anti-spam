const Discord = require("discord.js");
const { EventEmitter } = require("events");

/**
 * @callback IgnoreMemberFunction
 * @param {Discord.GuildMember} member The member to check
 * @returns {boolean} Whether the member should be ignored
 */

/**
 * @callback IgnoreRoleFunction
 * @param {Discord.Collection<Discord.Snowflake, Discord.Role>} role The role to check
 * @returns {boolean} Whether the user should be ignored
 */

/**
 * @callback IgnoreGuildFunction
 * @param {Discord.Guild} guild The guild to check
 * @returns {boolean} Whether the guild should be ignored
 */

/**
 * @callback IgnoreChannelFunction
 * @param {Discord.Channel} channel The channel to check
 * @returns {boolean} Whether the channel should be ignored
 */

/**
 * Emitted when a member gets warned.
 * @event AntiSpamClient#warnAdd
 * @property {Discord.GuildMember} member The member that was warned.
 * @property {Discord.TextChannel} channel The channel that the spam messages was sent in.
 * @property {Discord.Message} message The message that was sent as last. Could be used to find the guild object etc..
 */

/**
 * Emitted when a member gets kicked.
 * @event AntiSpamClient#kickAdd
 * @property {Discord.GuildMember} member The member that was kicked.
 * @property {Discord.TextChannel} channel The channel that the spam messages was sent in.
 * @property {Discord.Message} message The message that was sent as last. Could be used to find the guild object etc..
 */

/**
 * Emitted when a member gets muted.
 * @event AntiSpamClient#muteAdd
 * @property {Discord.GuildMember} member The member that was muted.
 * @property {Discord.TextChannel} channel The channel that the spam messages was sent in.
 * @property {Discord.Message} message The message that was sent as last. Could be used to find the guild object etc..
 */
/**
 * Emitted when a member gets banned.
 * @event AntiSpamClient#banAdd
 * @property {Discord.GuildMember} member The member that was banned.
 * @property {Discord.TextChannel} channel The channel that the spam messages was sent in.
 * @property {Discord.Message} message The message that was sent as last. Could be used to find the guild object etc..
 */

/**
 * Options for the AntiSpam client
 * @typedef AntiSpamClientOptions
 *
 * @property {number} [warnThreshold=3] Amount of messages sent in a row that will cause a warning.
 * @property {number} [muteThreshold=4] Amount of messages sent in a row that will cause a mute.
 * @property {number} [kickThreshold=5] Amount of messages sent in a row that will cause a kick.
 * @property {number} [banThreshold=7] Amount of messages sent in a row that will cause a ban.
 *
 * @property {number} [maxInterval=2000] Amount of time (ms) in which messages are considered spam.
 * @property {number} [maxDuplicatesInterval=2000] Amount of time (ms) in which duplicate messages are considered spam.
 *
 * @property {number} [maxDuplicatesWarn=7] Amount of duplicate messages that trigger a warning.
 * @property {number} [maxDuplicatesMute=9] Amount of duplicate messages that trigger a mute.
 * @property {number} [maxDuplicatesKick=10] Amount of duplicate messages that trigger a kick.
 * @property {number} [maxDuplicatesBan=11] Amount of duplicate messages that trigger a ban.
 *
 * @property {number} [unMuteTime='0'] Time in minutes to wait until unmuting a user.
 * @property {string|Discord.Snowflake} [modLogsChannel='mod-logs'] Name or ID of the channel in which moderation logs will be sent.
 * @property {boolean} [modLogsEnabled=false] Whether moderation logs are enabled.
 * @property {string} [modLogsMode='embed'] Whether send moderations logs in an discord embed or normal message! Options: 'embed' or 'message".
 *
 * @property {string} [warnMessage='{@user}, Please stop spamming.'] Message that will be sent in the channel when someone is warned.
 * @property {string} [kickMessage='**{user_tag}** has been kicked for spamming.'] Message that will be sent in the channel when someone is kicked.
 * @property {string} [muteMessage='**{user_tag}** has been muted for spamming.'] Message that will be sent in the channel when someone is muted.
 * @property {string} [banMessage='**{user_tag}** has been banned for spamming.'] Message that will be sent in the channel when someone is banned.
 *
 * @property {boolean} [actionInEmbed=false] Whether the action message will be sent in an embed or not.
 * @property {string} [actionEmbedIn="channel"] Whether the action message will be sent in the channel or dm. Options: 'channel' or 'dm'.
 * @property {string} [actionEmbedColor='#ff0000'] Color of the embeds of the action message.
 * @property {string} [embedFooterIconURL='https://raw.githubusercontent.com/Michael-J-Scofield/discord-anti-spam/master/docs/img/antispam.png'] Footer icon of the embed of the action message.
 * @property {string} [embedTitleIconURL='https://raw.githubusercontent.com/Michael-J-Scofield/discord-anti-spam/master/docs/img/antispam.png'] Icon of the embeds of the action message.
 *
 * @property {string} [warnEmbedTitle='User has been warned'] Title of the embeds of the action message.
 * @property {string} [kickEmbedTitle='User has been kicked'] Title of the embed of the warn message.
 * @property {string} [muteEmbedTitle='User has been muted'] Title of the embed of the mute message.
 * @property {string} [banEmbedTitle='User has been banned'] Title of the embed of the ban message.
 *
 * @property {string} [warnEmbedDescription='You have been warned for spamming.'] Description of the embed of the warn message.
 * @property {string} [kickEmbedDescription='You have been kicked for spamming.'] Description of the embed of the kick message.
 * @property {string} [muteEmbedDescription='You have been muted for spamming.'] Description of the embed of the mute message.
 * @property {string} [banEmbedDescription='You have been banned for spamming.'] Description of the embed of the ban message.
 *
 * @property {string} [warnEmbedFooter='You have been warned.'] Footer of the embed of the warn message.
 * @property {string} [kickEmbedFooter='You have been kicked.'] Footer of the embed of the kick message.
 * @property {string} [muteEmbedFooter='You have been muted.'] Footer of the embed of the mute message.
 * @property {string} [banEmbedFooter='You have been banned.'] Footer of the embed of the ban message.
 *
 * @property {boolean} [errorMessages=true] Whether the bot should send a message in the channel when it doesn't have some required permissions, like it can't kick members.
 * @property {string} [kickErrorMessage='Could not kick **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to kick the member.
 * @property {string} [banErrorMessage='Could not ban **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to mute the member (to add the mute role).
 * @property {string} [muteErrorMessage='Could not mute **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to ban the member.
 *
 * @property {Discord.Snowflake|string[]|IgnoreMemberFunction} [ignoredMembers=[]] Array of member IDs that are ignored.
 * @property {Discord.Snowflake|string[]|IgnoreRoleFunction} [ignoredRoles=[]] Array of role IDs or role names that are ignored. Members with one of these roles will be ignored.
 * @property {Discord.Snowflake|string[]|IgnoreGuildFunction} [ignoredGuilds=[]] Array of guild IDs or guild names that are ignored.
 * @property {Discord.Snowflake|string[]|IgnoreChannelFunction} [ignoredChannels=[]] Array of channel IDs or channel names that are ignored.
 * @property {Discord.PermissionString[]} [ignoredPermissions=[]] Users with at least one of these permissions will be ignored. Please use the PermissionFlagsBits function. (https://discord.js.org/#/docs/discord.js/main/class/PermissionsBitField?scrollTo=s-Flags)
 * @property {boolean} [ignoreBots=true] Whether bots should be ignored.
 *
 * @property {boolean} [warnEnabled=true] Whether warn sanction is enabled.
 * @property {boolean} [kickEnabled=true] Whether kick sanction is enabled.
 * @property {boolean} [muteEnabled=true] Whether mute sanction is enabled.
 * @property {boolean} [banEnabled=true] Whether ban sanction is enabled.
 *
 * @property {number} [deleteMessagesAfterBanForPastDays=1] When a user is banned, their messages sent in the last x days will be deleted.
 * @property {boolean} [verbose=true] Extended logs from module (recommended).
 * @property {boolean} [debug=false] Whether to run the module in debug mode.
 * @property {boolean} [removeMessages=true] Whether to delete user messages after a sanction.
 *
 * @property {boolean} [MultipleSanctions=false] Whether to run sanctions multiple times
 */

/**
 * Cached message.
 * @typedef CachedMessage
 *
 * @property {Discord.Snowflake} messageID The ID of the message.
 * @property {Discord.Snowflake} guildID The ID of the guild where the message was sent.
 * @property {Discord.Snowflake} authorID The ID of the author of the message.
 * @property {Discord.Snowflake} channelID The ID of the channel of the message.
 * @property {string} content The content of the message.
 * @property {number} sentTimestamp The timestamp the message was sent.
 */

/**
 * Cache data for the AntiSpamClient
 * @typedef AntiSpamCache
 *
 * @property {Discord.Snowflake[]} warnedUsers Array of warned users.
 * @property {Discord.Snowflake[]} kickedUsers Array of kicked users.
 * @property {Discord.Snowflake[]} mutedUsers Array of muted users.
 * @property {Discord.Snowflake[]} bannedUsers Array of banned users.
 * @property {CachedMessage[]} messages Array of cached messages, used to detect spam.
 */

/**
 * Main AntiSpam class
 */
class AntiSpamClient extends EventEmitter {
  /**
   * @param {AntiSpamClientOptions} options The options for this AntiSpam client instance
   */
  constructor(options) {
    super();
    /**
     * The options for this AntiSpam client instance
     * @type {AntiSpamClientOptions}
     */
    this.options = {
      warnThreshold: options.warnThreshold || 3,
      muteThreshold: options.muteThreshold || 4,
      kickThreshold: options.kickThreshold || 5,
      banThreshold: options.banThreshold || 7,

      maxInterval: options.maxInterval || 2000,
      maxDuplicatesInterval: options.maxDuplicatesInterval || 2000,

      maxDuplicatesWarn: options.maxDuplicatesWarn || 7,
      maxDuplicatesMute: options.maxDuplicatesMute || 9,
      maxDuplicatesKick: options.maxDuplicatesKick || 10,
      maxDuplicatesBan: options.maxDuplicatesBan || 11,

      unMuteTime: options.unMuteTime * 60_000 || 300000,

      modLogsChannel: options.modLogsChannel || "mod-logs",
      modLogsEnabled: options.modLogsEnabled || false,
      modLogsMode: options.modLogsMode || "embed",

      warnMessage: options.warnMessage || "{@user}, Please stop spamming.",
      muteMessage:
        options.muteMessage || "**{user_tag}** has been muted for spamming.",
      kickMessage:
        options.kickMessage || "**{user_tag}** has been kicked for spamming.",
      banMessage:
        options.banMessage || "**{user_tag}** has been banned for spamming.",

      actionInEmbed: options.actionInEmbed || false,
      actionEmbedIn: options.actionEmbedIn || "channel",
      actionEmbedColor: options.actionEmbedColor || "#ff0000",

      warnEmbedTitle: options.warnEmbedTitle || "User have been warned.",
      kickEmbedTitle: options.kickEmbedTitle || "User have been kicked.",
      muteEmbedTitle: options.muteEmbedTitle || "User have been muted.",
      banEmbedTitle: options.banEmbedTitle || "User have been banned.",

      embedTitleIconURL:
        options.embedTitleIconURL ||
        "https://raw.githubusercontent.com/Michael-J-Scofield/discord-anti-spam/master/docs/img/antispam.png",

      warnEmbedDescription:
        options.warnEmbedDescription || "You have been warned for spamming.",
      kickEmbedDescription:
        options.kickEmbedDescription || "You have been kicked for spamming.",
      muteEmbedDescription:
        options.muteEmbedDescription || "You have been muted for spamming.",
      banEmbedDescription:
        options.banEmbedDescription || "You have been banned for spamming.",

      warnEmbedFooter: options.warnEmbedFooter || "You have been warned.",
      kickEmbedFooter: options.kickEmbedFooter || "You have been kicked.",
      muteEmbedFooter: options.muteEmbedFooter || "You have been muted.",
      banEmbedFooter: options.banEmbedFooter || "You have been banned.",

      embedFooterIconURL:
        options.embedFooterIconURL ||
        "https://raw.githubusercontent.com/Michael-J-Scofield/discord-anti-spam/master/docs/img/antispam.png",

      errorMessages:
        options.errorMessages != undefined ? options.errorMessages : true,
      kickErrorMessage:
        options.kickErrorMessage ||
        "Could not kick **{user_tag}** because of improper permissions.",
      banErrorMessage:
        options.banErrorMessage ||
        "Could not ban **{user_tag}** because of improper permissions.",
      muteErrorMessage:
        options.muteErrorMessage ||
        "Could not mute **{user_tag}** because of improper permissions.",

      ignoredMembers: options.ignoredMembers || [],
      ignoredRoles: options.ignoredRoles || [],
      ignoredGuilds: options.ignoredGuilds || [],
      ignoredChannels: options.ignoredChannels || [],
      ignoredPermissions: options.ignoredPermissions || [],
      ignoreBots: options.ignoreBots != undefined ? options.ignoreBots : true,

      warnEnabled:
        options.warnEnabled != undefined ? options.warnEnabled : true,
      kickEnabled:
        options.kickEnabled != undefined ? options.kickEnabled : true,
      muteEnabled:
        options.muteEnabled != undefined ? options.muteEnabled : true,
      banEnabled: options.banEnabled != undefined ? options.banEnabled : true,

      deleteMessagesAfterBanForPastDays:
        options.deleteMessagesAfterBanForPastDays || 1,
      verbose: options.verbose || false,
      debug: options.debug || false,
      removeMessages:
        options.removeMessages != undefined ? options.removeMessages : true,

      removeBotMessages: options.removeBotMessages || false,
      removeBotMessagesAfter: options.removeBotMessagesAfter || 2000,

      MultipleSanctions: options.MultipleSanctions || false,
    };

    /**
     * The cache for this AntiSpam client instance
     * @type {AntiSpamCache}
     */
    this.cache = {
      messages: [],
      warnedUsers: [],
      kickedUsers: [],
      bannedUsers: [],
    };
  }

  /**
   * Format a string and returns it.
   * @ignore
   * @param {string} string The string to format.
   * @param {Discord.Message} message The Discord api message.
   * @returns {string}
   */
  format(string, message) {
    if (typeof string === "string") {
      const content = string
        .replace(/{@user}/g, message.author.toString())
        .replace(/{user_tag}/g, message.author.tag)
        .replace(/{server_name}/g, message.guild.name);
      return { content };
    }
  }

  /**
   * Send action message in the channel or dm
   * @ignore
   * @param {Discord.Message} message The Discord api message.
   * @param {String} action The action which happend. "warn", "kick", "mute", "ban"
   * @returns boolean.
   */
  sendActionMessage(message, action) {
    if (this.options.actionInEmbed == true) {
      if (this.options.actionEmbedIn == "channel") {
        const embed = new Discord.EmbedBuilder()
          .setColor(this.options.actionEmbedColor)
          .setTitle(
            this.format(this.options[`${action}EmbedTitle`], message).content,
            this.options.embedTitleIconURL
          )
          .setDescription(
            this.format(this.options[`${action}EmbedDescription`], message)
              .content
          )
          .setFooter({
            text: this.format(this.options[`${action}EmbedFooter`], message)
              .content,
            iconURL: this.options.embedFooterIconURL,
          });
        message.channel.send({ embeds: [embed] });
      } else {
        const embed = new Discord.EmbedBuilder()
          .setColor(this.options.actionEmbedColor)
          .setTitle(
            this.format(this.options[`${action}EmbedTitle`], message).content,
            this.options.embedTitleIconURL
          )
          .setDescription(
            this.format(this.options[`${action}EmbedDescription`], message)
              .content
          )
          .setFooter({
            text: this.format(this.options[`${action}EmbedFooter`], message)
              .content,
            iconURL: this.options.embedFooterIconURL,
          });
        message.author.send({ embeds: [embed] });
      }
    } else {
      if (this.options.actionEmbedIn == "channel") {
        if (action == "warn") {
          message.channel
            .send(this.format(this.options.warnMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (warnUser#sendSuccessMessage)[341]: ${e.message}`
                );
              }
            });
          return true;
        } else if (action == "kick") {
          message.channel
            .send(this.format(this.options.kickMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (kickUser#sendSuccessMessage)[352]: ${e.message}`
                );
              }
            });
          return true;
        } else if (action == "mute") {
          message.channel
            .send(this.format(this.options.muteMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (muteUser#sendSuccessMessage)[363]: ${e.message}`
                );
              }
            });
          return true;
        } else if (action == "ban") {
          message.channel
            .send(this.format(this.options.banMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (banUser#sendSuccessMessage)[374]: ${e.message}`
                );
              }
            });
        }
      } else {
        if (action == "warn") {
          message.author
            .send(this.format(this.options.warnMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (warnUser#sendSuccessMessage)[386]: ${e.message}`
                );
              }
            });
          return true;
        } else if (action == "kick") {
          message.author
            .send(this.format(this.options.kickMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (kickUser#sendSuccessMessage)[397]: ${e.message}`
                );
              }
            });
          return true;
        } else if (action == "mute") {
          message.author
            .send(this.format(this.options.muteMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (muteUser#sendSuccessMessage)[408]: ${e.message}`
                );
              }
            });
          return true;
        } else if (action == "ban") {
          message.author
            .send(this.format(this.options.banMessage, message))
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (banUser#sendSuccessMessage)[419]: ${e.message}`
                );
              }
            });
        }
      }
    }
  }

  /**
   * Logs the actions
   * @ignore
   * @param {Discord.Message} msg The Discord Api message.
   * @param {string} action The action to log. "warn", "kick", "mute", "ban"
   * @param {Discord.Client} client The Discord api client.
   * @returns {Promise<void>} Returns a promise of void.
   */
  async log(msg, action, client) {
    if (this.options.modLogsEnabled) {
      const modLogChannel =
        client.channels.cache.get(this.options.modLogsChannel) ||
        msg.guild.channels.cache.find(
          (channel) =>
            channel.name == this.options.modLogsChannel &&
            channel.type == Discord.ChannelType.GuildText
        ) ||
        msg.guild.channels.cache.find(
          (channel) =>
            channel.id == this.options.modLogsChannel &&
            channel.type == Discord.ChannelType.GuildText
        );

      if (modLogChannel) {
        if (this.options.modLogsMode == "embed") {
          const embed = new Discord.EmbedBuilder()
            .setAuthor({
              name: "DAS Spam Detection",
              iconURL: "https://discord-anti-spam.js.org/img/antispam.png",
            })
            .setDescription(
              `${msg.author} *(${msg.author.id})* has been **${action}** for **spam**!`
            )
            .setFooter({
              text: "DAS Spam Detection",
              iconURL: "https://discord-anti-spam.js.org/img/antispam.png",
            })
            .setTimestamp()
            .setColor("Red");
          modLogChannel.send({ embeds: [embed] }).catch((e) => {
            if (this.options.verbose) {
              console.error(
                "DAntiSpam (log#noMessageSent): The mod log message could not be sent."
              );
            }
          });
        } else {
          modLogChannel
            .send(
              `${msg.author}*(${msg.author.id})* has been **${action}** for **spam**.`
            )
            .catch((e) => {
              if (this.options.verbose) {
                console.error(
                  "DAntiSpam (log#noMessageSent): The mod log message could not be sent."
                );
              }
            });
        }
      } else {
        if (this.options.debug || this.options.verbose) {
          console.log(
            `DAntiSpam (log#ChannelNotFound): The mod log channel was not found.`
          );
        }
      }
    }
  }

  /**
   * Delete spam messages
   * @ignore
   * @param {CachedMessage[]} messages The cached messages to delete
   * @param {Discord.Client} client The Discord api client.
   * @returns {Promise<void>} The promise of the deletion.
   */
  async clearSpamMessages(messages, client) {
    try {
      messages.forEach((message) => {
        const channel = client.channels.cache.get(message.channelID);
        if (channel) {
          const msg = channel.messages.cache.get(message.messageID);
          if (msg && msg.deletable)
            msg.delete().catch((err) => {
              if (err && this.options.debug == true)
                console.log(
                  `DAntiSpam (clearSpamMessages#failed): The message(s) couldn't be deleted`
                );
            });
        }
      });
    } catch (e) {
      if (e) {
        if (this.options.debug) {
          console.log(
            `DAntiSpam (clearSpamMessages#failed): The message(s) couldn't be deleted!`
          );
        }
      }
    }
  }

  /**
   * Ban a user.
   * @ignore
   * @param {Discord.Message} message Context message.
   * @param {Discord.GuildMember} member The member to ban.
   * @param {CachedMessage[]} [spamMessages] The spam messages.
   * @returns {Promise<boolean>} Whether the member could be banned.
   */
  async banUser(message, member, spamMessages) {
    if (this.options.removeMessages && spamMessages) {
      this.clearSpamMessages(spamMessages, message.client);
    }
    this.cache.messages = this.cache.messages.filter(
      (u) => u.authorID !== message.author.id
    );
    this.cache.bannedUsers.push(message.author.id);
    if (!member.bannable) {
      if (this.options.verbose) {
        console.log(
          `DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`
        );
      }
      if (this.options.errorMessages) {
        let send = message.channel
          .send(this.format(this.options.banErrorMessage, message))
          .catch((e) => {
            if (this.options.verbose) {
              console.error(
                `DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`
              );
            }
          });
      }
      return false;
    } else {
      await message.member
        .ban({
          reason: "Spamming!",
          days: this.options.deleteMessagesAfterBanForPastDays,
        })
        .catch((e) => {
          if (this.options.errorMessages) {
            message.channel
              .send(this.format(this.options.banErrorMessage, message))
              .catch((e) => {
                if (this.options.verbose) {
                  console.error(
                    `DAntiSpam (banUser#sendSuccessMessage): ${e.message}`
                  );
                }
              });
          }
        });
      await this.sendActionMessage(message, "ban");
      if (this.options.modLogsEnabled) {
        this.log(message, `banned`, message.client);
      }
      this.emit("banAdd", member, message.channel, message);
      return true;
    }
  }

  /**
   * Mute a user.
   * @ignore
   * @param {Discord.Message} message Context message.
   * @param {Discord.GuildMember} member The member to mute.
   * @param {CachedMessage[]} [spamMessages] The spam messages.
   * @returns {Promise<boolean>} Whether the member could be muted.
   */
  async muteUser(message, member, spamMessages) {
    if (this.options.removeMessages && spamMessages) {
      this.clearSpamMessages(spamMessages, message.client);
    }
    this.cache.messages = this.cache.messages.filter(
      (u) => u.authorID !== message.author.id
    );
    const userCanBeMuted =
      message.guild.members.me.permissions.has(
        Discord.PermissionFlagsBits.ModerateMembers
      ) &&
      message.guild.members.me.roles.highest.position >
        message.member.roles.highest.position &&
      message.member.id !== message.guild.ownerId;
    if (!userCanBeMuted) {
      if (this.options.verbose) {
        console.log(
          `DAntiSpam (kickUser#userNotMutable): ${message.author.tag} (ID: ${message.author.id}) could not be muted, improper permissions.`
        );
      }
      if (this.options.errorMessages) {
        await message.channel
          .send(this.format(this.options.muteErrorMessage, message))
          .catch((e) => {
            if (this.options.verbose) {
              console.log(
                `DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`
              );
            }
          });
      }
      return false;
    }
    await message.member.timeout(this.options.unMuteTime, "Spamming");
    await this.sendActionMessage(message, "mute");
    if (this.options.modLogsEnabled) {
      this.log(message, `muted`, message.client);
    }
    this.emit("muteAdd", member, message.channel, message);
    return true;
  }

  /**
   * Kick a user.
   * @ignore
   * @param {Discord.Message} message Context message.
   * @param {Discord.GuildMember} member The member to kick.
   * @param {CachedMessage[]} [spamMessages] The spam messages.
   * @returns {Promise<boolean>} Whether the member could be kicked.
   */
  async kickUser(message, member, spamMessages) {
    if (this.options.removeMessages && spamMessages) {
      this.clearSpamMessages(spamMessages, message.client);
    }
    this.cache.messages = this.cache.messages.filter(
      (u) => u.authorID !== message.author.id
    );
    this.cache.kickedUsers.push(message.author.id);
    if (!member.kickable) {
      if (this.options.verbose) {
        console.log(
          `DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions`
        );
      }
      if (this.options.errorMessages) {
        message.channel
          .send(this.format(this.options.kickErrorMessage, message))
          .catch((e) => {
            if (this.options.verbose) {
              console.error(
                `DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`
              );
            }
          });
      }
      return false;
    } else {
      await message.member.kick("Spamming!");
      this.sendActionMessage(message, "kick");
      if (this.options.modLogsEnabled) {
        this.log(message, `kicked`, message.client);
      }
      this.emit("kickAdd", member, message.channel, message);
      return true;
    }
  }

  /**
   * Warn a user.
   * @ignore
   * @param {Discord.Message} message Context message.
   * @param {Discord.GuildMember} member The member to warn.
   * @param {CachedMessage[]} [spamMessages] The spam messages.
   * @returns {Promise<boolean>} Whether the member could be warned.
   */
  async warnUser(message, member, spamMessages) {
    if (this.options.removeMessages && spamMessages) {
      this.clearSpamMessages(spamMessages, message.client);
    }
    this.cache.warnedUsers.push(message.author.id);
    this.log(message, `warned`, message.client);
    this.sendActionMessage(message, "warn");
    this.emit("warnAdd", member, message.channel, message);
    return true;
  }

  /**
   * Checks a message.
   * @param {Discord.Message} message The message to check.
   * @returns {Promise<boolean>} Whether the message has triggered a threshold.
   * @example
   * client.on('message', (msg) => {
   * 	antiSpam.message(msg);
   * });
   */
  async message(message) {
    const { options } = this;

    if (
      !message.guild ||
      message.author.id === message.client.user.id ||
      (message.guild.ownerId === message.author.id && !options.debug) ||
      (options.ignoreBots && message.author.bot)
    ) {
      return false;
    }

    const isMemberIgnored =
      typeof options.ignoredMembers === "function"
        ? options.ignoredMembers(message.member)
        : options.ignoredMembers.includes(message.author.id);
    if (isMemberIgnored) return false;

    const isGuildIgnored =
      typeof options.ignoredGuilds === "function"
        ? options.ignoredGuilds(message.guild)
        : options.ignoredGuilds.includes(message.guild.id);
    if (isGuildIgnored) return false;

    const isChannelIgnored =
      typeof options.ignoredChannels === "function"
        ? options.ignoredChannels(message.channel)
        : options.ignoredChannels.includes(message.channel.id);
    if (isChannelIgnored) return false;

    const member =
      message.member || (await message.guild.members.fetch(message.author));

    const memberHasIgnoredRoles =
      typeof options.ignoredRoles === "function"
        ? options.ignoredRoles(member.roles.cache)
        : options.ignoredRoles.some((r) => member.roles.cache.has(r));
    if (memberHasIgnoredRoles) return false;

    if (
      options.ignoredPermissions.some((permission) =>
        member.permissions.has(permission)
      )
    )
      return false;

    const currentMessage = {
      messageID: message.id,
      guildID: message.guild.id,
      authorID: message.author.id,
      channelID: message.channel.id,
      content: message.content,
      sentTimestamp: message.createdTimestamp,
    };
    this.cache.messages.push(currentMessage);

    const cachedMessages = this.cache.messages.filter(
      (m) => m.authorID === message.author.id && m.guildID === message.guild.id
    );

    const duplicateMatches = cachedMessages.filter(
      (m) =>
        m.content === message.content &&
        m.sentTimestamp >
          currentMessage.sentTimestamp - options.maxDuplicatesInterval
    );

    /**
     * Duplicate messages sent before the threshold is triggered
     * @type {CachedMessage[]}
     */
    const spamOtherDuplicates = [];
    if (duplicateMatches.length > 0) {
      let rowBroken = false;
      cachedMessages
        .sort((a, b) => b.sentTimestamp - a.sentTimestamp)
        .forEach((element) => {
          if (rowBroken) return;
          if (element.content !== duplicateMatches[0].content) rowBroken = true;
          else spamOtherDuplicates.push(element);
        });
    }

    const spamMatches = cachedMessages.filter(
      (m) => m.sentTimestamp > Date.now() - options.maxInterval
    );

    let sanctioned = false;

    const userCanBeBanned =
      options.banEnabled &&
      !this.cache.bannedUsers.includes(message.author.id) &&
      !sanctioned;
    if (userCanBeBanned && spamMatches.length >= options.banThreshold) {
      this.banUser(message, member, spamMatches);
      sanctioned = true;
    } else if (
      userCanBeBanned &&
      duplicateMatches.length >= options.maxDuplicatesBan
    ) {
      this.banUser(message, member, [
        ...duplicateMatches,
        ...spamOtherDuplicates,
      ]);
      sanctioned = true;
    }

    const userCanBeMuted = options.muteEnabled && !sanctioned;
    if (userCanBeMuted && spamMatches.length >= options.muteThreshold) {
      this.muteUser(message, member, spamMatches);
      sanctioned = true;
    } else if (
      userCanBeMuted &&
      duplicateMatches.length >= options.maxDuplicatesMute
    ) {
      this.muteUser(message, member, [
        ...duplicateMatches,
        ...spamOtherDuplicates,
      ]);
      sanctioned = true;
    }

    const userCanBeKicked =
      options.kickEnabled &&
      !this.cache.kickedUsers.includes(message.author.id) &&
      !sanctioned;
    if (userCanBeKicked && spamMatches.length >= options.kickThreshold) {
      this.kickUser(message, member, spamMatches);
      sanctioned = true;
    } else if (
      userCanBeKicked &&
      duplicateMatches.length >= options.maxDuplicatesKick
    ) {
      this.kickUser(message, member, [
        ...duplicateMatches,
        ...spamOtherDuplicates,
      ]);
      sanctioned = true;
    }

    const userCanBeWarned =
      options.warnEnabled &&
      !this.cache.warnedUsers.includes(message.author.id) &&
      !sanctioned;
    if (userCanBeWarned && spamMatches.length >= options.warnThreshold) {
      this.warnUser(message, member, spamMatches);
      sanctioned = true;
    } else if (
      userCanBeWarned &&
      duplicateMatches.length >= options.maxDuplicatesWarn
    ) {
      this.warnUser(message, member, [
        ...duplicateMatches,
        ...spamOtherDuplicates,
      ]);
      sanctioned = true;
    }

    return sanctioned;
  }
  /**
   * Checks if the user left the server to remove him from the cache!
   * @param {Discord.GuildMember} member The member to remove from the cache.
   * @returns {Promise<boolean>} Whether the member has been removed
   * @example
   * client.on('guildMemberRemove', (member) => {
   * 	antiSpam.userleave(member);
   * });
   */
  async userleave(member) {
    const options = this.options;
    const isGuildIgnored =
      typeof options.ignoredGuilds === "function"
        ? options.ignoredGuilds(member.guild)
        : options.ignoredGuilds.includes(member.guild.id);
    if (isGuildIgnored) return false;

    this.cache.bannedUsers = this.cache.bannedUsers.filter(
      (u) => u !== member.user.id
    );
    this.cache.kickedUsers = this.cache.kickedUsers.filter(
      (u) => u !== member.user.id
    );
    this.cache.warnedUsers = this.cache.warnedUsers.filter(
      (u) => u !== member.user.id
    );

    return true;
  }

  /**
   * Reset the cache of this AntiSpam client instance.
   */
  reset() {
    this.cache = {
      messages: [],
      warnedUsers: [],
      kickedUsers: [],
      bannedUsers: [],
    };
  }
}

module.exports = AntiSpamClient;
