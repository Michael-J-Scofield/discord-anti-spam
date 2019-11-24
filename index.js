if (Number(process.version.split('.')[0].match(/[0-9]+/)) < 10)
	throw new Error(
		'Node 10.0.0 or higher is required. Update Node on your system.'
	);

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
	exemptRole: null,
	exemptUser: null,
	exemptGuild: null,
	exemptChannel: null,
	exemptPermissions: [],
	ignoreBots: true,
	verbose: false,
	ignoredUsers: [],
	ignoredRoles: [],
	ignoredGuilds: [],
	ignoredChannels: [],
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
		const { options, data } = this;
		if (
			message.guild.ownerID === message.author.id ||
			(options.ignoreBots && message.author.bot) ||
			message.author.id === message.client.user.id
		)
			return;
		if (
			options.ignoredGuilds.includes(message.guild.id) ||
			options.ignoredUsers.includes(message.author.id)
		)
			return;
		if (options.ignoredChannels.includes(message.channel.id)) return;
		if (message.channel.type === 'dm') return;
		if (message.guild && !message.member)
			message.member = await message.guild.fetchMember(message.author);
		if (
			message.member.roles.some(
				role =>
					options.ignoredRoles.includes(role.id) ||
					options.ignoredRoles.includes(role.name)
			)
		)
			return;
		if (
			options.exemptPermissions.some(permission =>
				message.member.hasPermission(permission)
			)
		)
			return;

		if (
			typeof options.exemptRole === 'function' &&
			message.member.roles.some(role => options.exemptRole(role))
		)
			return;
		if (
			typeof options.exemptUser === 'function' &&
			options.exemptUser(message.author)
		)
			return;
		if (
			typeof options.exemptGuild === 'function' &&
			options.exemptGuild(message.guild)
		)
			return;
		if (
			typeof options.exemptChannel === 'function' &&
			options.exemptChannel(message.channel)
		)
			return;

		const banUser = async () => {
			data.messageCache = data.messageCache.filter(
				m => m.author !== message.author.id
			);
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
				this.emit('banAdd', message.member);
			} catch (e) {
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be banned, ${e}.`
					);
				await message.channel
					.send(
						`Could not ban **${message.author.tag}** because of an error: \`${e}\`.`
					)
					.catch(e => {
						if (options.verbose) console.error(e);
					});
				return false;
			}

			let msgToSend = formatString(options.banMessage, message);

			await message.channel.send(msgToSend).catch(e => {
				if (options.verbose) console.error(e);
			});
			return true;
		};

		const kickUser = async () => {
			data.messageCache = data.messageCache.filter(
				m => m.author !== message.author.id
			);
			data.kickedUsers.push(message.author.id);

			if (!message.member.kickable) {
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be kicked, insufficient permissions.`
					);
				await message.channel
					.send(
						`Could not kick **${message.author.tag}** because of inpropper permissions.`
					)
					.catch(e => {
						if (options.verbose) console.error(e);
					});
				return false;
			}

			try {
				await message.member.kick('Spamming!');
				this.emit('kickAdd', message.member);
			} catch (e) {
				if (options.verbose)
					console.log(
						`**${message.author.tag}** (ID: ${message.author.id}) could not be kicked, ${e}.`
					);
				await message.channel
					.send(
						`Could not kick **${message.author.tag}** because of an error: \`${e}\`.`
					)
					.catch(e => {
						if (options.verbose) console.error(e);
					});
				return false;
			}

			let msgToSend = formatString(options.kickMessage, message);

			await message.channel.send(msgToSend).catch(e => {
				if (options.verbose) console.error(e);
			});
			return true;
		};

		const warnUser = async () => {
			// Mark the user as warned
			data.warnedUsers.push(message.author.id);
			this.emit('warnAdd', message.member);

			let msgToSend = formatString(options.warnMessage, message);

			await message.channel.send(msgToSend).catch(e => {
				if (options.verbose) console.error(e);
			});

			return true;
		};

		data.users.push({
			time: Date.now(),
			author: message.author.id
		});

		data.messageCache.push({
			content: message.content,
			author: message.author.id
		});

		let messageMatches = data.messageCache.filter(
			m => m.content === message.content && m.author === message.author.id
		).length;
		let spamMatches = data.users.filter(
			u =>
				u.time > Date.now() - options.maxInterval &&
				u.author === message.author.id
		).length;

		if (
			!data.warnedUsers.includes(message.author.id) &&
			(spamMatches === options.warnThreshold ||
				messageMatches === options.maxDuplicatesWarning)
		) {
			warnUser(message);
			this.emit('warnEmit', message.member);
		}

		if (
			options.kickEnabled &&
			!data.kickedUsers.includes(message.author.id) &&
			(spamMatches === options.kickThreshold ||
				messageMatches === options.maxDuplicatesKick)
		) {
			await kickUser(message);
			this.emit('kickEmit', message.member);
		}

		if (
			(options.banEnabled && spamMatches === options.banThreshold) ||
			messageMatches === options.maxDuplicatesBan
		) {
			await banUser(message);
			this.emit('banEmit', message.member);
		}
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
 * @param {string} string The non-formatted string
 * @param {object} message The Discord Message object
 * @returns {string} The formatted string
 */
function formatString(string, message) {
	return string
		.replace(/{@user}/g, message.author.toString())
		.replace(/{user_tag}/g, message.author.tag)
		.replace(/{server_name}/g, message.guild.name);
}
