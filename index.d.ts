import { EventEmitter } from 'events';
import {
	PermissionResolvable,
	Snowflake,
	User,
	Guild,
	TextChannel,
	GuildMember,
	Message,
	DiscordAPIError,
	RichEmbed,
	MessageEmbed,
	Role
} from 'discord.js';
declare module 'discord-anti-spam' {
	class AntiSpam extends EventEmitter {
		constructor(options?: AntiSpamOptions);
		public options: AntiSpamOptions;
		public data: AntiSpamData;

		public message(message: Message): Promise<boolean>;
		public resetData(): AntiSpamData;

		public on(
			event: 'banAdd' | 'kickAdd' | 'warnAdd' | 'muteAdd',
			listener: (member: GuildMember) => any
		): this;
		public on(
			event: 'spamThresholdBan' | 'spamThresholdKick' | 'spamThresholdWarn' | 'spamThresholdMute',
			listener: (member: GuildMember, duplicateMessages: boolean) => any
		): this;
		public on(
			event: 'error',
			listener: (
				message: Message,
				error: DiscordAPIError,
				type: 'ban' | 'kick' | 'mute'
			) => any
		): this;
	}

	type AntiSpamData = {
		messageCache: {
			messageID: string;
			content: string;
			author: Snowflake;
			time: number;
		}[];
		bannedUsers: Snowflake[];
		kickedUsers: Snowflake[];
		warnedUsers: Snowflake[];
	};

	type AntiSpamOptions = {
		warnThreshold?: number;
		banThreshold?: number;
		kickThreshold?: number;
		muteThreshold?: number;
		maxInterval?: number;
		warnMessage?: string | RichEmbed | MessageEmbed;
		banMessage?: string | RichEmbed | MessageEmbed;
		kickMessage?: string | RichEmbed | MessageEmbed;
		muteMessage?: string | RichEmbed | MessageEmbed;
		maxDuplicatesWarning?: number;
		maxDuplicatesBan?: number;
		maxDuplicatesKick?: number;
		maxDuplicatesMute?: number;
		deleteMessagesAfterBanForPastDays?: number;
		exemptPermissions?: PermissionResolvable[];
		ignoreBots?: boolean;
		verbose?: boolean;
		debug?: boolean;
		ignoredMembers?: Snowflake[] | ((user: User) => boolean);
		ignoredRoles?: (Snowflake | string)[] | ((role: Role) => boolean);
		ignoredGuilds?: Snowflake[] | ((guild: Guild) => boolean);
		ignoredChannels?: Snowflake[] | ((channel: TextChannel) => boolean);
		warnEnabled?: boolean;
		kickEnabled?: boolean;
		banEnabled?: boolean;
		muteEnabled?: boolean;
		modLogsChannelName?: string;
		modLogsEnabled?: boolean;
		removeMessages?: boolean;
	};
	
	export default AntiSpam;
}
