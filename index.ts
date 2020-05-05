import { Collection, Role, Snowflake, TextChannel, MessageEmbed, Message, User, GuildMember, Guild, Channel, PermissionString } from 'discord.js'

interface IgnoreUserFunction {
	(user: User): boolean;
};

interface IgnoreRoleFunction {
	(roles: Collection<Snowflake, Role>, member: GuildMember): boolean;
}

interface IgnoreGuildFunction {
	(guild: Guild): boolean;
}

interface IgnoreChannelFunction {
	(channel: Channel): boolean;
}

/**
 * Options for the AntiSpam client
 */
interface AntiSpamClientOptions {

	/**
	 * Amount of messages sent in a row that will cause a warning.
	 */
	warnThreshold: number;
	/**
	 * Amount of messages sent in a row that will cause a kick.
	 */
	kickThreshold: number;
	/**
	 * Amount of messages sent in a row that will cause a mute.
	 */
	muteThreshold: number;
	/**
	 * Amount of messages sent in a row that will cause a ban.
	 */
	banThreshold: number;

	/**
	 * Amount of time (ms) in which messages are considered spam.
	 */
	maxInterval: number;
	/**
	 * Amount of time (ms) in which duplicate messages are considered spam.
	 */
	maxDuplicatesInterval: number;

	/**
	 * Amount of duplicate messages that trigger a warning.
	 */
	maxDuplicatesWarn: number;
	/**
	 * Amount of duplicate messages that trigger a kick.
	 */
	maxDuplicatesKick: number;
	/**
	 * Amount of duplicate messages that trigger a mute.
	 */
	maxDuplicatesMute: number;
	/**
	 * Amount of duplicate messages that trigger a ban.
	 */
	maxDuplicatesBan: number;

	/**
	 * Role that will be added to users if they got muted.
	 */
	muteRoleName: string | Role | Snowflake;

	/**
	 * Channel in which moderation logs will be sent.
	 */
	modLogsChannel: string | TextChannel | Snowflake;
	/**
	 * Whether moderation logs are enabled.
	 */
	modLogsEnabled: boolean;

	/**
	 * Message that will be sent in chat when someone is warned.
	 */
	warnMessage: string | MessageEmbed;
	/**
	 * Message that will be sent in chat when someone is kicked.
	 */
	kickMessage: string | MessageEmbed;
	/**
	 * Message that will be sent in chat when someone is muted.
	 */
	muteMessage: string | MessageEmbed;
	/**
	 * Message that will be sent in chat when someone is banned.
	 */
	banMessage: string | MessageEmbed;

	/**
	 * Whether the bot should send a message in the channel when it doesn't have some required permissions, like it can't kick members.
	 */
	errorMessages: boolean;
	/**
	 * Message that will be sent in the channel when the bot doesn't have enough permissions to kick the member.
	 */
	kickErrorMessage: string;
	/**
	 * Message that will be sent in the channel when the bot doesn't have enough permissions to mute the member (to add the muted role).
	 */
	muteErrorMessage: string;
	/**
	 * Message that will be sent in the channel when the bot doesn't have enough permissions to ban the member.
	 */
	banErrorMessage: string;

	/**
	 * Array of user IDs that are ignored.
	 */
	ignoredUsers: (Snowflake|string)[]|IgnoreUserFunction;
	/**
	 * Array of role IDs or role names that are ignored. Members with one of these roles will be ignored.
	 */
	ignoredRoles: (Snowflake|string)[]|IgnoreRoleFunction;
	/**
	 * Array of guild IDs or guild names that are ignored.
	 */
	ignoredGuilds: (Snowflake|string)[]|IgnoreGuildFunction;
	/**
	 * Array of channel IDs or channel names that are ignored.
	 */
	ignoredChannels: (Snowflake|string)[]|IgnoreChannelFunction;
	/**
	 * Users with at least one of these permissions will be ignored.
	 */
	ignoredPermissions: PermissionString[];
	/**
	 * Whether bots are ignored.
	 */
	ignoreBots: boolean;

	/**
	 * Whether warn sanction is enabled.
	 */
	warnEnabled: boolean;
	/**
	 * Whether kick sanction is enabled.
	 */
	kickEnabled: boolean;
	/**
	 * Whether mute sanction is enabled.
	 */
	muteEnabled: boolean;
	/**
	 * Whether ban sanction is enabled.
	 */
	banEnabled: boolean;

	/**
	 * When a user is banned, their messages sent in the last x days will be deleted.
	 */
	deleteMessagesAfterBanForPastDays: number;
	/**
	 * Extended Logs from module (recommended).
	 */
	verbose: boolean;
	/**
	 * Whether to run the module in debug mode.
	 */
	debug: boolean;
	/**
	 * Whether to delete user messages after a sanction.
	 */
	removeMessages: boolean;
};

interface CachedMessage {
	/**
	 * The ID of the message.
	 */
	messageID: Snowflake;
	/**
	 * The content of the message.
	 */
	content: string;
	/**
	 * The ID of the author of the message.
	 */
	authorID: Snowflake;
	/**
	 * The timestamp the message was sent.
	 */
	sendAt: number;
	/**
	 * The ID of the guild where the message was sent.
	 */
	guildID: Snowflake;
};

/**
 * Cache data for the AntiSpamClient
 */
interface AntiSpamCache {
	/**
	 * Array of warned users.
	 */
	warnedUsers: Snowflake[];
	/**
	 * Array of kicked users.
	 */
	kickedUsers: Snowflake[];
	/**
	 * Array of muted users.
	 */
	mutedUsers: Snowflake[];
	/**
	 * Array of banned users.
	 */
	bannedUsers: Snowflake[];
	/**
	 * Cached messages, used to detect spam.
	 */
	messages: CachedMessage[];
};

const banUser = async (member: GuildMember): Promise<boolean> => {

};

/**
 * Main AntiSpam class
 */
export = class AntiSpamClient {
	/**
	 * The options for this AntiSpam client instance
	 */
	public options: AntiSpamClientOptions;
	/**
	 * The cache for this AntiSpam client instance
	 */
	public cache: AntiSpamCache;

	constructor (options: AntiSpamClientOptions) {
		this.options = {

			warnThreshold: options.warnThreshold || 3,
			kickThreshold: options.kickThreshold || 5,
			banThreshold: options.banThreshold || 7,
			muteThreshold: options.muteThreshold || 4,

			maxInterval: options.maxInterval || 2000,
			maxDuplicatesInterval: options.maxDuplicatesInterval || 2000,

			maxDuplicatesWarn: options.maxDuplicatesWarn || 7,
			maxDuplicatesKick: options.maxDuplicatesKick || 10,
			maxDuplicatesBan: options.maxDuplicatesBan || 10,
			maxDuplicatesMute: options.maxDuplicatesMute || 9,

			muteRoleName: options.muteRoleName || 'Muted',

			modLogsChannel: options.modLogsChannel || 'mod-logs',
			modLogsEnabled: options.modLogsEnabled || false,

			warnMessage: options.warnMessage || '{@user}, Please stop spamming.',
			muteMessage: options.muteMessage || '**{user_tag}** has been muted for spamming.',
			kickMessage: options.kickMessage || '**{user_tag}** has been kicked for spamming.',
			banMessage: options.banMessage || '**{user_tag}** has been banned for spamming.',

			errorMessages: options.errorMessages || true,
			kickErrorMessage: options.kickErrorMessage || 'Could not kick **{user_tag}** because of improper permissions.',
			banErrorMessage: options.banErrorMessage || 'Could not ban **{user_tag}** because of improper permissions.',
			muteErrorMessage: options.muteErrorMessage || 'Could not mute **{user_tag}** because of improper permissions or the mute role couldn\'t be found.',

			ignoredUsers: options.ignoredUsers || [],
			ignoredRoles: options.ignoredRoles || [],
			ignoredGuilds: options.ignoredGuilds || [],
			ignoredChannels: options.ignoredChannels || [],
			ignoredPermissions: options.ignoredPermissions || [],
			ignoreBots: options.ignoreBots || true,

			warnEnabled: options.warnEnabled || true,
			kickEnabled: options.kickEnabled || true,
			muteEnabled: options.muteEnabled || true,
			banEnabled: options.banEnabled || true,

			deleteMessagesAfterBanForPastDays: options.deleteMessagesAfterBanForPastDays || 1,
			verbose: options.verbose || false,
			debug: options.debug || false,
			removeMessages: options.removeMessages || true
		}

		this.cache = {
			messages: [],
			warnedUsers: [],
			kickedUsers: [],
			mutedUsers: [],
			bannedUsers: []
		}
	}

	/**
	 * Checks a message.
	 * @param {Message} message The message to check.
	 * @returns {boolean} Whether the message has triggered a threshold.
	 * @example
	 * client.on('message', (msg) => {
	 * 	antiSpam.message(msg);
	 * });
	 */
	async message (message: Message): Promise<boolean> {
		const { options } = this

		if (
			!message.guild ||
			message.author.id === message.client.user.id ||
			(message.guild.ownerID === message.author.id && !options.debug) ||
			(options.ignoreBots && message.author.bot)
		) {
			return false
		}

		const isUserIgnored = typeof options.ignoredUsers === 'function' ? options.ignoredUsers(message.author) : options.ignoredUsers.includes(message.author.id)
		if (isUserIgnored) return false

		const isGuildIgnored = typeof options.ignoredGuilds === 'function' ? options.ignoredGuilds(message.guild) : options.ignoredGuilds.includes(message.guild.id)
		if (isGuildIgnored) return false

		const isChannelIgnored = typeof options.ignoredChannels === 'function' ? options.ignoredChannels(message.channel) : options.ignoredChannels.includes(message.channel.id)
		if (isChannelIgnored) return false

		const member = message.member || await message.guild.members.fetch(message.author)

		const memberHasIgnoredRoles = typeof options.ignoredRoles === 'function' ? options.ignoredRoles(member.roles.cache, member) : options.ignoredRoles
		if (memberHasIgnoredRoles) return false

		if (options.ignoredPermissions.some((permission) => member.hasPermission(permission))) return false

		const currentMessage: CachedMessage = {
			messageID: message.id,
			guildID: message.guild.id,
			authorID: message.author.id,
			content: message.content,
			sendAt: message.createdTimestamp
		}
		this.cache.messages.push(currentMessage)

		const cachedMessages = this.cache.messages.filter((m) => m.authorID === message.author.id && m.guildID === message.guild.id)

		const duplicateMatches = cachedMessages.filter((m) => m.content === message.content && (m.sendAt > (currentMessage.sendAt - options.maxDuplicatesInterval))).length
		const spamMatches = cachedMessages.filter((m) => m.sendAt > (Date.now() - options.maxInterval)).length

		const userNeedWarn = options.warnEnabled && (spamMatches === options.warnThreshold || duplicateMatches === options.maxDuplicatesWarn) && !this.cache.warnedUsers.includes(message.author.id)
		if (userNeedWarn) {
		}

		return false
	}
}
