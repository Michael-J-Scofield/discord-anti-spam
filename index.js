if (Number(process.version.split('.')[0].match(/[0-9]+/)) < 10)
	throw new Error('Node 10.0.0 or higher is required. Update Node on your system.');
const { RichEmbed } = require('discord.js');
const { EventEmitter } = require('events');
const defaultOptions = {
	warnThreshold: 3,
	banThreshold: 5,
	kickThreshold: 5,
	maxInterval: 2000,
	warnMessage: '{@user}, Please stop spamming.',
	banMessage: '**{user_tag}** has been banned for spamming.',
	kickMessage: '**{user_tag}** has been kicked for spamming.',
	maxDuplicatesWarning: 7,
	maxDuplicatesBan: 10,
	maxDuplicatesKick: 10,
	deleteMessagesAfterBanForPastDays: 1,
	exemptPermissions: [],
	ignoreBots: true,
	verbose: false,
	ignoredUsers: [],
	ignoredRoles: [],
	ignoredGuilds: [],
	ignoredChannels: [],
	warnEnabled: true,
	kickEnabled: true,
	banEnabled: true
};
class AntiSpam extends EventEmitter {
	constructor(options = {}) {
		super();
		for (const key in defaultOptions) {
			if (
				!options.hasOwnProperty(key) ||
				typeof options[key] === 'undefined' ||
				options[key] === null
			)
				options[key] = defaultOptions[key];
		}
		this.options = options;
		this.data = {
			messageCache: [],
			bannedUsers: [],
			kickedUsers: [],
			warnedUsers: [],
			users: []
		};
	}

	async message(message) {
		if (
			message.channel.type === 'dm' ||
			message.author.id === message.client.user.id ||
			message.guild.ownerID === message.author.id
		)
			return false;

		const { options, data } = this;
		if (!message.member) message.member = await message.guild.fetchMember(message.author);
		if (
			(options.ignoreBots && message.author.bot) ||
			options.exemptPermissions.some(permission => message.member.hasPermission(permission))
		)
			return false;

		if (
			message.member.roles.some(role =>
				typeof options.ignoredRoles === 'function'
					? options.ignoredRoles(role)
					: options.ignoredRoles.includes(role.id) || options.ignoredRoles.includes(role.name)
			) ||
			(typeof options.ignoredUsers === 'function'
				? options.ignoredUsers(message.author)
				: options.ignoredUsers.includes(message.author.id)) ||
			(typeof options.ignoredGuilds === 'function'
				? options.ignoredGuilds(message.guild)
				: options.ignoredGuilds.includes(message.guild.id)) ||
			(typeof options.ignoredChannels === 'function'
				? options.ignoredChannels(message.channel)
				: options.ignoredChannels.includes(message.channel.id))
		)
			return false;

		const banUser = async () => {
			data.messageCache = data.messageCache.filter(m => m.author !== message.author.id);
			data.bannedUsers.push(message.author.id);

			if (!message.member.bannable) {
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be banned, insufficient permissions.`
					);
				return false;
			}

			try {
				await message.member.ban({
					reason: 'Spamming!',
					days: options.deleteMessagesAfterBanForPastDays
				});
				if (options.banMessage)
					await message.channel.send(format(options.banMessage, message)).catch(e => {
						if (options.verbose) console.error(e);
					});
				this.emit('banAdd', message.member);
				return true;
			} catch (error) {
				const emitted = this.emit('error', message, error, 'ban');
				if (emitted) return false;
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be banned, ${error}.`
					);
				await message.channel
					.send(`Could not ban **${message.author.tag}** because of an error: \`${error}\`.`)
					.catch(e => {
						if (options.verbose) console.error(e);
					});
				return false;
			}
		};

		const kickUser = async () => {
			data.messageCache = data.messageCache.filter(m => m.author !== message.author.id);
			data.kickedUsers.push(message.author.id);

			if (!message.member.kickable) {
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be kicked, insufficient permissions.`
					);
				return false;
			}

			try {
				await message.member.kick('Spamming!');
				if (options.kickMessage)
					await message.channel.send(format(options.kickMessage, message)).catch(e => {
						if (options.verbose) console.error(e);
					});
				this.emit('kickAdd', message.member);
				return true;
			} catch (error) {
				const emitted = this.emit('error', message, error, 'kick');
				if (emitted) return false;
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be kicked, ${error}.`
					);
				await message.channel
					.send(`Could not kick **${message.author.tag}** because of an error: \`${error}\`.`)
					.catch(e => {
						if (options.verbose) console.error(e);
					});
				return false;
			}
		};

		const warnUser = async () => {
			data.warnedUsers.push(message.author.id);
			this.emit('warnAdd', message.member);

			if (options.warnMessage)
				await message.channel.send(format(options.warnMessage, message)).catch(e => {
					if (options.verbose) console.error(e);
				});

			return true;
		};

		data.users.push({
			time: Date.now(),
			id: message.author.id
		});

		data.messageCache.push({
			content: message.content,
			author: message.author.id
		});

		const messageMatches = data.messageCache.filter(
			m => m.content === message.content && m.author === message.author.id
		).length;
		const spamMatches = data.users.filter(
			u => u.time > Date.now() - options.maxInterval && u.id === message.author.id
		).length;

		if (
			!data.warnedUsers.includes(message.author.id) &&
			(spamMatches === options.warnThreshold || messageMatches === options.maxDuplicatesWarning)
		) {
			if (options.warnEnabled) warnUser(message);
			this.emit(
				'spamThresholdWarn',
				message.member,
				messageMatches === options.maxDuplicatesWarning
			);
			return true;
		}

		if (
			!data.kickedUsers.includes(message.author.id) &&
			(spamMatches === options.kickThreshold || messageMatches === options.maxDuplicatesKick)
		) {
			if (options.kickEnabled) await kickUser(message);
			this.emit('spamThresholdKick', message.member, messageMatches === options.maxDuplicatesKick);
			return true;
		}

		if (spamMatches === options.banThreshold || messageMatches === options.maxDuplicatesBan) {
			if (options.banEnabled) await banUser(message);
			this.emit('spamThresholdBan', message.member, messageMatches === options.maxDuplicatesBan);
			return true;
		}

		return false;
	}

	resetData() {
		this.data.messageCache = [];
		this.data.bannedUsers = [];
		this.data.kickedUsers = [];
		this.data.warnedUsers = [];
		this.data.users = [];
		return this.data;
	}
}

module.exports = AntiSpam;

/**
 * This function formats a string by replacing some keywords with variables
 * @param {string|RichEmbed} string The non-formatted string or RichEmbed
 * @param {object} message The Discord Message object
 * @returns {string|RichEmbed} The formatted string
 */
function format(string, message) {
	if (typeof string === 'string')
		return string
			.replace(/{@user}/g, message.author.toString())
			.replace(/{user_tag}/g, message.author.tag)
			.replace(/{server_name}/g, message.guild.name);
	const embed = new RichEmbed(string);
	if (embed.description) embed.setDescription(format(embed.description, message));
	if (embed.title) embed.setTitle(format(embed.title, message));
	if (embed.footer && embed.footer.text) embed.footer.text = format(embed.footer.text, message);
	if (embed.author && embed.author.name) embed.author.name = format(embed.author.name, message);
	return embed;
}
