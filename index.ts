import Discord, { PermissionFlags, PermissionResolvable } from "discord.js";
import { EventEmitter } from "events";

/**
 * @callback IgnoreMemberFunction
 * @param {Discord.GuildMember} member The member to check
 * @returns {boolean} Whether the member should be ignored
 */
type IgnoreMemberFunction = (member: Discord.GuildMember) => boolean;

/**
 * @callback IgnoreRoleFunction
 * @param {Discord.Collection<Discord.Snowflake, Discord.Role>} role The role to check
 * @returns {boolean} Whether the user should be ignored
 */
type IgnoreRoleFunction = (role: Discord.Role) => boolean;

/**
 * @callback IgnoreGuildFunction
 * @param {Discord.Guild} guild The guild to check
 * @returns {boolean} Whether the guild should be ignored
 */
type IgnoreGuildFunction = (guild: Discord.Guild) => boolean;

/**
 * @callback IgnoreChannelFunction
 * @param {Discord.Channel} channel The channel to check
 * @returns {boolean} Whether the channel should be ignored
 */
type IgnoreChannelFunction = (channel: Discord.Channel) => boolean;

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
 */
interface AntiSpamClientOptions {
  removeBotMessages: boolean;
  removeBotMessagesAfter?: number;
  warnThreshold?: number;
  muteThreshold?: number;
  kickThreshold?: number;
  banThreshold?: number;
  maxInterval?: number;
  maxDuplicatesInterval?: number;
  maxDuplicatesWarn?: number;
  maxDuplicatesMute?: number;
  maxDuplicatesKick?: number;
  maxDuplicatesBan?: number;
  unMuteTime?: number;
  modLogsChannel?: string | Discord.Snowflake;
  modLogsEnabled?: boolean;
  modLogsMode?: string;
  warnMessage?: string;
  kickMessage?: string;
  muteMessage?: string;
  banMessage?: string;
  actionInEmbed?: boolean;
  actionEmbedIn?: string;
  actionEmbedColor?: string;
  embedFooterIconURL?: string;
  embedTitleIconURL?: string;
  warnEmbedTitle?: string;
  kickEmbedTitle?: string;
  muteEmbedTitle?: string;
  banEmbedTitle?: string;
  warnEmbedDescription?: string;
  kickEmbedDescription?: string;
  muteEmbedDescription?: string;
  banEmbedDescription?: string;
  warnEmbedFooter?: string;
  kickEmbedFooter?: string;
  muteEmbedFooter?: string;
  banEmbedFooter?: string;
  errorMessages?: boolean;
  kickErrorMessage?: string;
  banErrorMessage?: string;
  muteErrorMessage?: string;
  ignoredMembers?: Discord.Snowflake[] | IgnoreMemberFunction;
  ignoredRoles?: (Discord.Snowflake | string)[] | IgnoreRoleFunction;
  ignoredGuilds?: Discord.Snowflake[] | IgnoreGuildFunction;
  ignoredChannels?: Discord.Snowflake[] | IgnoreChannelFunction;
  ignoredPermissions?: Discord.PermissionFlags[];
  ignoreBots?: boolean;
  warnEnabled?: boolean;
  kickEnabled?: boolean;
  muteEnabled?: boolean;
  banEnabled?: boolean;
  ipwarnEnabled?: boolean;
  deleteMessagesAfterBanForPastDays?: number;
  verbose?: boolean;
  debug?: boolean;
  removeMessages?: boolean;
  MultipleSanctions?: boolean;
}

/**
 * Cached message.
 */
interface CachedMessage {
  messageID: Discord.Snowflake;
  guildID: Discord.Snowflake;
  authorID: Discord.Snowflake;
  channelID: Discord.Snowflake;
  content: string;
  sentTimestamp: number;
}

/**
 * Cache data for the AntiSpamClient
 */
interface AntiSpamCache {
  warnedUsers: Discord.Snowflake[];
  kickedUsers: Discord.Snowflake[];
  mutedUsers: Discord.Snowflake[];
  bannedUsers: Discord.Snowflake[];
  messages: CachedMessage[];
}

/**
 * Main AntiSpam class
 */
export default class AntiSpamClient extends EventEmitter {
  options: {
    warnThreshold: number;
    muteThreshold: number;
    kickThreshold: number;
    banThreshold: number;
    maxInterval: number;
    maxDuplicatesInterval: number;
    maxDuplicatesWarn: number;
    maxDuplicatesMute: number;
    maxDuplicatesKick: number;
    maxDuplicatesBan: number;
    unMuteTime: number;
    modLogsChannel?: string | Discord.Snowflake;
    modLogsEnabled: boolean;
    modLogsMode: string;
    warnMessage: string;
    muteMessage: string;
    kickMessage: string;
    banMessage: string;
    actionInEmbed: boolean;
    actionEmbedIn: string;
    actionEmbedColor: string;
    warnEmbedTitle: string;
    kickEmbedTitle: string;
    muteEmbedTitle: string;
    banEmbedTitle: string;
    embedTitleIconURL: string;
    warnEmbedDescription: string;
    kickEmbedDescription: string;
    muteEmbedDescription: string;
    banEmbedDescription: string;
    warnEmbedFooter: string;
    kickEmbedFooter: string;
    muteEmbedFooter: string;
    banEmbedFooter: string;
    embedFooterIconURL: string;
    errorMessages: boolean;
    kickErrorMessage: string;
    banErrorMessage: string;
    muteErrorMessage: string;
    ignoredMembers: Discord.Snowflake[] | IgnoreMemberFunction;
    ignoredRoles: (Discord.Snowflake | string)[] | IgnoreRoleFunction;
    ignoredGuilds: Discord.Snowflake[] | IgnoreGuildFunction;
    ignoredChannels: Discord.Snowflake[] | IgnoreChannelFunction;
    ignoredPermissions: Discord.PermissionFlags[];
    ignoreBots: boolean;
    warnEnabled: boolean;
    ipwarnEnabled: boolean;
    kickEnabled: boolean;
    muteEnabled: boolean;
    banEnabled: boolean;
    deleteMessagesAfterBanForPastDays: number;
    verbose: boolean;
    debug: boolean;
    removeMessages: boolean;
    removeBotMessages: boolean;
    removeBotMessagesAfter: number;
    MultipleSanctions: boolean;
  };
  cache: {
    messages: CachedMessage[];
    warnedUsers: Discord.Snowflake[];
    kickedUsers: Discord.Snowflake[];
    bannedUsers: Discord.Snowflake[];
  };
  /**
   * @param {AntiSpamClientOptions} options The options for this AntiSpam client instance
   */
  constructor(options: AntiSpamClientOptions) {
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

      unMuteTime: (options.unMuteTime ?? 5) * 60_000 || 300_000,

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

      errorMessages: options.errorMessages ?? true,
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
      ignoreBots: options.ignoreBots ?? true,

      warnEnabled: options.warnEnabled ?? true,
      ipwarnEnabled: options.ipwarnEnabled ?? false,
      kickEnabled: options.kickEnabled ?? true,
      muteEnabled: options.muteEnabled ?? true,
      banEnabled: options.banEnabled ?? true,

      deleteMessagesAfterBanForPastDays:
        options.deleteMessagesAfterBanForPastDays || 1,
      verbose: options.verbose || false,
      debug: options.debug || false,
      removeMessages: options.removeMessages ?? true,

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
  format(
    string: string,
    message: {
      author: { toString: () => string; tag: string };
      guild: { name: string };
    }
  ): string {
    if (typeof string === "string") {
      return string
        .replace(/{@user}/g, message.author.toString())
        .replace(/{user_tag}/g, message.author.tag)
        .replace(/{server_name}/g, message.guild.name);
    }
    return "";
  }

  /**
   * Send action message in the channel or dm
   * @ignore
   * @param {Discord.Message} message The Discord api message.
   * @param {String} action The action which happend. "warn", "kick", "mute", "ban"
   * @returns boolean.
   */
  sendActionMessage(message: Discord.Message, action: string) {
    if (this.options.actionInEmbed == true) {
      if (this.options.actionEmbedIn == "channel") {
        const embed = new Discord.EmbedBuilder()
          .setColor(this.options.actionEmbedColor as Discord.ColorResolvable)
          .setTitle(this.options[`${action}Title`])
          .setThumbnail(this.options.embedTitleIconURL)
          .setDescription(
            this.format(this.options[`${action}EmbedDescription`], {
              author: {
                toString: () => message.author.toString(),
                tag: message.author.tag,
              },
              guild: message.guild
                ? { name: message.guild.name }
                : { name: "No Guild" },
            })
          )
          .setFooter({
            text: this.format(this.options[`${action}EmbedFooter`], {
              author: {
                toString: () => message.author.toString(),
                tag: message.author.tag,
              },
              guild: message.guild
                ? { name: message.guild.name }
                : { name: "No Guild" },
            }),
            iconURL: this.options.embedFooterIconURL,
          });
        if (message.channel.type === Discord.ChannelType.GuildText) {
          message.channel.send({ embeds: [embed] });
        } else {
          if (this.options.verbose) {
            console.error(
              "DAntiSpam (sendActionMessage#noChannel#399): The message channel is not a text channel."
            );
          }
        }
      } else {
        const embed = new Discord.EmbedBuilder()
          .setColor(this.options.actionEmbedColor as Discord.ColorResolvable)
          .setTitle(this.options[`${action}Title`])
          .setThumbnail(this.options.embedTitleIconURL)
          .setDescription(
            this.format(this.options[`${action}EmbedDescription`], {
              author: {
                toString: () => message.author.toString(),
                tag: message.author.tag,
              },
              guild: message.guild
                ? { name: message.guild.name }
                : { name: "No Guild" },
            })
          )
          .setFooter({
            text: this.format(this.options[`${action}EmbedFooter`], {
              author: {
                toString: () => message.author.toString(),
                tag: message.author.tag,
              },
              guild: message.guild
                ? { name: message.guild.name }
                : { name: "No Guild" },
            }),
            iconURL: this.options.embedFooterIconURL,
          });
        message.author.send({ embeds: [embed] });
      }
    } else if (this.options.actionEmbedIn == "channel") {
      if (action == "warn") {
        const messageContentObj = {
          author: {
            toString: () => message.author.toString(),
            tag: message.author.tag,
          },
          guild: {
            name: message.guild ? message.guild.name : "No Guild",
          },
        };
        const formattedMessage = this.format(
          this.options.warnMessage,
          messageContentObj
        );
        if (message.channel.type === Discord.ChannelType.GuildText) {
          message.channel.send(formattedMessage);
        } else {
          if (this.options.verbose) {
            console.error(
              "DAntiSpam (sendActionMessage#noChannel#399): The message channel is not a text channel."
            );
          }
        }
        return true;
      } else if (action == "kick") {
        const messageContentObj = {
          author: {
            toString: () => message.author.toString(),
            tag: message.author.tag,
          },
          guild: {
            name: message.guild ? message.guild.name : "No Guild",
          },
        };
        const formattedMessage = this.format(
          this.options.kickMessage,
          messageContentObj
        );
        if (message.channel.type === Discord.ChannelType.GuildText) {
          message.channel.send(formattedMessage);
        } else {
          if (this.options.verbose) {
            console.error(
              "DAntiSpam (sendActionMessage#noChannel#477): The message channel is not a text channel."
            );
          }
        }

        return true;
      } else if (action == "mute") {
        const messageContentObj = {
          author: {
            toString: () => message.author.toString(),
            tag: message.author.tag,
          },
          guild: {
            name: message.guild ? message.guild.name : "No Guild",
          },
        };
        const formattedMessage = this.format(
          this.options.muteMessage,
          messageContentObj
        );
        if (message.channel.type === Discord.ChannelType.GuildText) {
          message.channel.send(formattedMessage);
        } else {
          if (this.options.verbose) {
            console.error(
              "DAntiSpam (sendActionMessage#noChannel#502): The message channel is not a text channel."
            );
          }
        }
        return true;
      } else if (action == "ban") {
        const messageContentObj = {
          author: {
            toString: () => message.author.toString(),
            tag: message.author.tag,
          },
          guild: {
            name: message.guild ? message.guild.name : "No Guild",
          },
        };
        const formattedMessage = this.format(
          this.options.banMessage,
          messageContentObj
        );
        if (message.channel.type === Discord.ChannelType.GuildText) {
          message.channel.send(formattedMessage);
        } else {
          if (this.options.verbose) {
            console.error(
              "DAntiSpam (sendActionMessage#noChannel#526): The message channel is not a text channel."
            );
          }
        }
      }
    } else if (action == "warn") {
      const context = {
        author: {
          toString: () => message.author.toString(),
          tag: message.author.tag,
        },
        guild: {
          name: message.guild ? message.guild.name : "No Guild",
        },
      };
      // Ensure to use the correct property name here. Assuming it's `warnMessage`
      const formattedMessage = this.format(this.options.warnMessage, context);
      // Send the formatted message to the author
      message.author.send(formattedMessage).catch((e) => {
        if (this.options.verbose) {
          // Assuming `this.options.verbose` is the correct path
          console.error(
            `AntiSpam (warnUser#sendSuccessMessage)[386]: ${e.message}`
          );
        }
      });
      return true;
    } else if (action == "kick") {
      const context = {
        author: {
          toString: () => message.author.toString(),
          tag: message.author.tag,
        },
        guild: {
          name: message.guild ? message.guild.name : "No Guild",
        },
      };
      // Ensure to use the correct property name here. Assuming it's `kickMessage`
      const formattedMessage = this.format(this.options.kickMessage, context);
      // Send the formatted message to the author
      message.author.send(formattedMessage).catch((e) => {
        if (this.options.verbose) {
          // Assuming `this.options.verbose` is the correct path
          console.error(
            `AntiSpam (kickUser#sendSuccessMessage)[397]: ${e.message}`
          );
        }
      });
      return true;
    } else if (action == "mute") {
      const context = {
        author: {
          toString: () => message.author.toString(),
          tag: message.author.tag,
        },
        guild: {
          name: message.guild ? message.guild.name : "No Guild",
        },
      };
      // Ensure to use the correct property name here. Assuming it's `muteMessage`
      const formattedMessage = this.format(this.options.muteMessage, context);
      // Send the formatted message to the author
      message.author.send(formattedMessage).catch((e) => {
        if (this.options.verbose) {
          // Assuming `this.options.verbose` is the correct path
          console.error(
            `AntiSpam (muteUser#sendSuccessMessage)[363]: ${e.message}`
          );
        }
      });
      return true;
    } else if (action == "ban") {
      const context = {
        author: {
          toString: () => message.author.toString(),
          tag: message.author.tag,
        },
        guild: {
          name: message.guild ? message.guild.name : "No Guild",
        },
      };
      // Ensure to use the correct property name here. Assuming it's `banMessage`
      const formattedMessage = this.format(this.options.banMessage, context);
      // Send the formatted message to the author
      message.author.send(formattedMessage).catch((e) => {
        if (this.options.verbose) {
          // Assuming `this.options.verbose` is the correct path
          console.error(
            `AntiSpam (banUser#sendSuccessMessage)[419]: ${e.message}`
          );
        }
      });
    }
  }

  private getGuildTextBasedChannel(
    client: Discord.Client,
    msg: Discord.Message,
    modLogsChannel: string
  ): Discord.TextChannel | Discord.ThreadChannel | undefined {
    const channelById = client.channels.cache.get(modLogsChannel);

    // Check if the channel is a Text Channel or Thread Channel
    if (
      channelById?.type === Discord.ChannelType.GuildText &&
      channelById.isTextBased()
    ) {
      return channelById as Discord.TextChannel | Discord.ThreadChannel;
    }

    const channelByName = msg.guild?.channels.cache.find(
      (channel) =>
        channel.name === modLogsChannel &&
        channel.type === Discord.ChannelType.GuildText
    );

    if (channelByName?.isTextBased()) {
      return channelByName as Discord.TextChannel | Discord.ThreadChannel;
    }

    const channelByIdInGuild = msg.guild?.channels.cache.find(
      (channel) =>
        channel.id === modLogsChannel &&
        channel.type === Discord.ChannelType.GuildText
    );

    if (channelByIdInGuild?.isTextBased()) {
      return channelByIdInGuild as Discord.TextChannel | Discord.ThreadChannel;
    }

    return undefined;
  }

  /**
   * Logs the actions
   * @ignore
   * @param {Discord.Message} msg The Discord Api message.
   * @param {string} action The action to log. "warn", "kick", "mute", "ban"
   * @param {Discord.Client} client The Discord api client.
   * @returns {Promise<void>} Returns a promise of void.
   */
  async log(
    msg: Discord.Message,
    action: string,
    client: Discord.Client
  ): Promise<void> {
    if (this.options.modLogsEnabled) {
      const modLogChannel = this.getGuildTextBasedChannel(
        client,
        msg,
        this.options.modLogsChannel
      );
      // const modLogChannel: Discord.TextChannel | Discord.ThreadChannel =
      client.channels.cache.get(this.options.modLogsChannel) ||
        msg.guild?.channels.cache.find(
          (channel) =>
            channel.name == this.options.modLogsChannel &&
            channel.type == Discord.ChannelType.GuildText
        ) ||
        msg.guild?.channels.cache.find(
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
      } else if (this.options.debug || this.options.verbose) {
        console.log(
          `DAntiSpam (log#ChannelNotFound): The mod log channel was not found.`
        );
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
  async clearSpamMessages(
    messages: CachedMessage[],
    client: Discord.Client
  ): Promise<void> {
    try {
      messages.forEach((message) => {
        const channel = client.channels.cache.get(
          message.channelID
        ) as Discord.TextBasedChannel;
        if (channel) {
          const msg = channel.messages.cache.get(message.messageID);
          if (msg?.deletable)
            msg.delete().catch((err) => {
              if (err && this.options.debug == true)
                console.log(
                  `DAntiSpam (clearSpamMessages#failed): The message(s) couldn't be deleted`
                );
            });
        }
      });
    } catch (e) {
      if (e && this.options.debug) {
        console.log(
          `DAntiSpam (clearSpamMessages#failed): The message(s) couldn't be deleted!`
        );
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
  async banUser(
    message: Discord.Message,
    member: Discord.GuildMember,
    spamMessages: CachedMessage[]
  ): Promise<boolean> {
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
        const { guild } = message;
        if (guild) {
          if (message.channel.type === Discord.ChannelType.GuildText) {
            const send = message.channel
              .send(
                this.format(this.options.banErrorMessage, { ...message, guild })
              )
              .catch((e) => {
                if (this.options.verbose) {
                  console.error(
                    `DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`
                  );
                }
              });
          } else {
            if (this.options.verbose) {
              console.error(
                `DAntiSpam (banUser#sendMissingPermMessage): The message channel is not a text channel.`
              );
            }
          }
        } else if (this.options.verbose) {
          console.error(
            `DAntiSpam (banUser#sendMissingPermMessage): Guild is null.`
          );
        }
      }
      return false;
    }
    if (message.member) {
      await message.member
        .ban({
          reason: "Spamming!",
          deleteMessageSeconds:
            60 * 60 * 24 * this.options.deleteMessagesAfterBanForPastDays,
        })
        .catch((e) => {
          if (this.options.errorMessages) {
            const messageDetails = {
              author: {
                toString: () => message.author.toString(),
                tag: message.author.tag,
              },
              guild: {
                name: message.guild ? message.guild.name : "No Guild",
              },
            };
            if (message.channel.type === Discord.ChannelType.GuildText) {
              message.channel
                .send(this.format(this.options.banErrorMessage, messageDetails))
                .catch((e) => {
                  if (this.options.verbose) {
                    console.error(
                      `DAntiSpam (banUser#sendSuccessMessage): ${e.message}`
                    );
                  }
                });
            } else {
              if (this.options.verbose) {
                console.error(
                  `DAntiSpam (banUser#sendSuccessMessage): The message channel is not a text channel.`
                );
              }
            }
          }
        });
    }
    this.sendActionMessage(message, "ban");
    if (this.options.modLogsEnabled) {
      this.log(message, `banned`, message.client);
    }
    this.emit("banAdd", member, message.channel, message);
    return true;
  }

  /**
   * Mute a user.
   * @ignore
   * @param {Discord.Message} message Context message.
   * @param {Discord.GuildMember} member The member to mute.
   * @param {CachedMessage[]} [spamMessages] The spam messages.
   * @returns {Promise<boolean>} Whether the member could be muted.
   */
  async muteUser(
    message: Discord.Message,
    member: Discord.GuildMember,
    spamMessages: CachedMessage[]
  ): Promise<boolean> {
    if (this.options.removeMessages && spamMessages) {
      this.clearSpamMessages(spamMessages, message.client);
    }
    this.cache.messages = this.cache.messages.filter(
      (u) => u.authorID !== message.author.id
    );
    const userCanBeMuted =
      message.guild?.members.me?.permissions.has(
        Discord.PermissionFlagsBits.ModerateMembers
      ) &&
      message.guild.members.me.roles.highest.position >
        (message.member?.roles.highest?.position ?? -1) &&
      message.member?.id !== message.guild.ownerId;
    if (!userCanBeMuted) {
      if (this.options.verbose) {
        console.log(
          `DAntiSpam (kickUser#userNotMutable): ${message.author.tag} (ID: ${message.author.id}) could not be muted, improper permissions.`
        );
      }
      if (this.options.errorMessages) {
        const messageContext = {
          author: {
            toString: () => message.author.toString(),
            tag: message.author.tag,
          },
          guild: {
            name: message.guild ? message.guild.name : "No Guild",
          },
        };
        // Invoking this.format function correctly with the desired error message and context.
        // Note: this.options.muteErrorMessage should contain the key to your error message template.
        if (message.channel.type === Discord.ChannelType.GuildText) {
          await message.channel
            .send(this.format(this.options.muteErrorMessage, messageContext))
            .catch((e) => {
              if (this.options.verbose) {
                console.log(
                  `DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`
                );
              }
            });
        } else {
          if (this.options.verbose) {
            console.log(
              `DAntiSpam (muteUser#sendMissingPermMessage): The message channel is not a text channel.`
            );
          }
        }
      }
      return false;
    }
    if (message.member) {
      await message.member.timeout(this.options.unMuteTime, "Spamming");
    }
    this.sendActionMessage(message, "mute");
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
  async kickUser(
    message: Discord.Message,
    member: Discord.GuildMember,
    spamMessages: CachedMessage[]
  ): Promise<boolean> {
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
        const messageContext = {
          author: {
            toString: () => message.author.toString(),
            tag: message.author.tag,
          },
          guild: {
            name: message.guild ? message.guild.name : "No Guild",
          },
        };

        if (message.channel.type === Discord.ChannelType.GuildText) {
          await message.channel
            .send(this.format(this.options.muteErrorMessage, messageContext))
            .catch((e) => {
              if (this.options.verbose) {
                console.log(
                  `DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`
                );
              }
            });
        } else {
          if (this.options.verbose) {
            console.log(
              `DAntiSpam (kickUser#sendMissingPermMessage): The message channel is not a text channel.`
            );
          }
        }

        // Invoking this.format function correctly with the desired error message and context.
        // Note: this.options.muteErrorMessage should contain the key to your error message template.
      }
      return false;
    }
    await message.member?.kick("Spamming!");
    this.sendActionMessage(message, "kick");
    if (this.options.modLogsEnabled) {
      this.log(message, `kicked`, message.client);
    }
    this.emit("kickAdd", member, message.channel, message);
    return true;
  }

  /**
   * Warn a user.
   * @ignore
   * @param {Discord.Message} message Context message.
   * @param {Discord.GuildMember} member The member to warn.
   * @param {CachedMessage[]} [spamMessages] The spam messages.
   * @returns {Promise<boolean>} Whether the member could be warned.
   */
  async warnUser(
    message: Discord.Message,
    member: Discord.GuildMember,
    spamMessages: CachedMessage[]
  ): Promise<boolean> {
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
  async message(message: Discord.Message): Promise<boolean> {
    const { options } = this;

    // 期限切れメッセージを削除してキャッシュの無制限増加を防止
    const now = Date.now();
    const maxAge = Math.max(
      this.options.maxInterval || 2000,
      this.options.maxDuplicatesInterval || 2000
    );
    this.cache.messages = this.cache.messages.filter(
      (msg) => now - msg.sentTimestamp < maxAge
    );

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
        ? message.member
          ? options.ignoredMembers(message.member)
          : false
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

    const memberHasIgnoredRoles = (
      member: {
        roles: { cache: Discord.Collection<Discord.Snowflake, Discord.Role> };
      },
      options: AntiSpamClientOptions
    ): boolean => {
      if (!options.ignoredRoles) {
        return false;
      }

      if (typeof options.ignoredRoles === "function") {
        const ignoredRolesFunction = options.ignoredRoles as IgnoreRoleFunction;
        return member.roles.cache.some((role) => ignoredRolesFunction(role));
      } else {
        const ignoredRoleIds = options.ignoredRoles as Discord.Snowflake[];
        return ignoredRoleIds.some((roleId) => member.roles.cache.has(roleId));
      }
    };
    if (memberHasIgnoredRoles(member, options)) return false;

    // const memberHasIgnoredRoles =
    //   typeof options.ignoredRoles === "function"
    //     ? options.ignoredRoles(member.roles.cache.get(r))
    //     : options.ignoredRoles.some((r) => member.roles.cache.has(r));
    // if (memberHasIgnoredRoles) return false;

    if (
      options.ignoredPermissions.some((permission: PermissionFlags) =>
        // @ts-ignore
        // ! Ignore as the permission flags is always correct by typing
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
      (m) => m.authorID === message.author.id && m.guildID === message.guild?.id
    );

    const duplicateMatches = cachedMessages.filter(
      (m) =>
        m.content === message.content &&
        m.sentTimestamp >
          currentMessage.sentTimestamp - options.maxDuplicatesInterval
    );
    if (this.options.ipwarnEnabled == true) {
      const regex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
      if (message.content.match(regex)) {
        message.delete();
        if (message.channel.type === Discord.ChannelType.GuildText) {
          message.channel.send(`${message.author} Don't post IP's in chat!`);
        } else {
          if (this.options.verbose) {
            console.error(
              "DAntiSpam (sendActionMessage#noChannel#399): The message channel is not a text channel."
            );
          }
        }
      }
    } else {
      return false;
    }

    /**
     * Duplicate messages sent before the threshold is triggered
     * @type {CachedMessage[]}
     */
    const spamOtherDuplicates: CachedMessage[] = [];
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
      return true;
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
