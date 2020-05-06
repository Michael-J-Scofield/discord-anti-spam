import { Collection, Role, Snowflake, TextChannel, MessageEmbed, Message, User, GuildMember, Guild, Channel, PermissionString, Client } from 'discord.js'
import { EventEmitter } from 'events'

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
	 * Name or ID of the role that will be added to users if they got muted.
	 */
	muteRoleName: string | Snowflake;

	/**
	 * Name or ID of the channel in which moderation logs will be sent.
	 */
	modLogsChannelName: string | Snowflake;
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
	 * The ID of the guild where the message was sent.
	 */
	guildID: Snowflake;
	/**
	 * The ID of the author of the message.
	 */
	authorID: Snowflake;
	/**
	 * The ID of the channel of the message.
	 */
	channelID: Snowflake;
	/**
	 * The content of the message.
	 */
	content: string;
	/**
	 * The timestamp the message was sent.
	 */
	sendAt: number;
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

/**
 * Main AntiSpam class
 */
export = class AntiSpamClient extends EventEmitter {
	/**
	 * The options for this AntiSpam client instance
	 */
	public options: AntiSpamClientOptions;
	/**
	 * The cache for this AntiSpam client instance
	 */
	public cache: AntiSpamCache;

	constructor (options: AntiSpamClientOptions) {
		super()
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

			modLogsChannelName: options.modLogsChannelName || 'mod-logs',
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

	private format (string: string|MessageEmbed, message: Message): string|MessageEmbed {
		if (typeof string === 'string') {
			return string
				.replace(/{@user}/g, message.author.toString())
				.replace(/{user_tag}/g, message.author.tag)
				.replace(/{server_name}/g, message.guild.name)
		} else {
			const embed = new MessageEmbed(string)
			if (embed.description) embed.setDescription(this.format(embed.description, message))
			if (embed.title) embed.setTitle(this.format(embed.title, message))
			if (embed.footer && embed.footer.text) embed.footer.text = this.format(embed.footer.text, message) as string
			if (embed.author && embed.author.name) embed.author.name = this.format(embed.author.name, message) as string
			return embed
		}
	}

	private log (message: string, client: Client) {
		if (this.options.modLogsEnabled) {
			const modLogChannel = client.channels.cache.get(this.options.modLogsChannelName) ||
			client.channels.cache.filter((channel) => channel.type === 'text').find((channel) => (channel as TextChannel).name === this.options.modLogsChannelName)
			if (modLogChannel) {
				(modLogChannel as TextChannel).send(message)
			}
		}
	}

	private async clearSpamMessages (messages: CachedMessage[], client: Client) {
		messages.forEach((message) => {
			const channel = (client.channels.cache.get(message.channelID) as TextChannel)
			if (channel) {
				const msg = channel.messages.cache.get(message.messageID)
				if (msg) msg.delete()
			}
		})
	}

	private async kickUser (message: Message, member: GuildMember, spamMessages?: CachedMessage[]): Promise<boolean> {
		if (this.options.removeMessages) {
			this.clearSpamMessages(spamMessages, message.client)
		}
		this.cache.messages = this.cache.messages.filter((u) => u.authorID !== message.author.id)
		this.cache.kickedUsers.push(message.author.id)
		if (!member.kickable) {
			if (this.options.verbose) {
				console.log(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions`)
			}
			if (this.options.errorMessages) {
				message.channel.send(this.format(this.options.kickMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`)
					}
				})
			}
			return false
		} else {
			await message.member.kick('Spamming!')
			if (this.options.kickMessage) {
				message.channel.send(this.format(this.options.kickMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`)
					}
				})
			}
			if (this.options.modLogsEnabled) {
				this.log(`Spam detected: ${message.author} got **kicked**`, message.client)
			}
			this.emit('kickAdd', member)
			return true
		}
	}

	private async warnUser (message: Message, member: GuildMember, spamMessages?: CachedMessage[]): Promise<boolean> {
		if (this.options.removeMessages) {
			this.clearSpamMessages(spamMessages, message.client)
		}
		this.cache.warnedUsers.push(message.author.id)
		this.log(`Spam detected: ${message.author.tag} got **warned**`, message.client)
		if (this.options.warnMessage) {
			message.channel.send(this.format(this.options.warnMessage, message)).catch((e) => {
				if (this.options.verbose) {
					console.error(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`)
				}
			})
		}
		this.emit('warnAdd', member)
		return true
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
	public async message (message: Message): Promise<boolean> {
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
			channelID: message.channel.id,
			content: message.content,
			sendAt: message.createdTimestamp
		}
		this.cache.messages.push(currentMessage)

		const cachedMessages = this.cache.messages.filter((m) => m.authorID === message.author.id && m.guildID === message.guild.id)

		const duplicateMatches = cachedMessages.filter((m) => m.content === message.content && (m.sendAt > (currentMessage.sendAt - options.maxDuplicatesInterval)))
		const spamMatches = cachedMessages.filter((m) => m.sendAt > (Date.now() - options.maxInterval))

		let sanctioned = false

		/* const userCanBeBanned = options.banEnabled && !this.cache.bannedUsers.includes(message.author.id) && !sanctioned
		if (userCanBeBanned && (spamMatches.length >= options.banThreshold)) {
			this.banUser(message, member, spamMatches)
			sanctioned = true
		} else if (userCanBeBanned && (duplicateMatches.length >= options.maxDuplicatesBan)) {
			this.banUser(message, member, duplicateMatches)
			sanctioned = true
		} */

		const userCanBeKicked = options.kickEnabled && !this.cache.kickedUsers.includes(message.author.id) && !sanctioned
		if (userCanBeKicked && (spamMatches.length >= options.kickThreshold)) {
			this.kickUser(message, member, spamMatches)
			sanctioned = true
		} else if (userCanBeKicked && (duplicateMatches.length >= options.maxDuplicatesKick)) {
			this.kickUser(message, member, duplicateMatches)
			sanctioned = true
		}

		const userCanBeWarned = options.warnEnabled && !this.cache.warnedUsers.includes(message.author.id) && !sanctioned
		if (userCanBeWarned && (spamMatches.length >= options.warnThreshold)) {
			this.warnUser(message, member, spamMatches)
			sanctioned = true
		} else if (userCanBeWarned && (duplicateMatches.length >= options.maxDuplicatesWarn)) {
			this.warnUser(message, member, duplicateMatches)
			sanctioned = true
		}

		return false
	}

	/**
	 * Reset the cache of this AntiSpam client instance.
	 */
	public reset () {
		this.cache = {
			messages: [],
			warnedUsers: [],
			kickedUsers: [],
			mutedUsers: [],
			bannedUsers: []
		}
	}
}
