import { EventEmitter } from 'events';
import {
	PermissionResolvable,
	Snowflake,
	User,
	Guild,
	TextChannel,
	Client,
	GuildMember,
	Message,
	DiscordAPIError
} from 'discord.js';

export class AntiSpam extends EventEmitter {
	constructor(options?: AntiSpamOptions);
	public options: AntiSpamOptions;
	public data: AntiSpamData;
	public client?: Client;

	public message(): Promise<boolean>;
	public resetData(): AntiSpamData;

	public on(
		event: 'banAdd' | 'kickAdd' | 'warnAdd',
		listener: (member: GuildMember) => any
	);
	public on(
		event: 'spamThresholdBan' | 'spamThresholdKick' | 'spamThresholdWarn',
		listener: (member: GuildMember, duplicateMessages: boolean) => any
	);
	public on(
		event: 'error',
		listener: (
			message: Message,
			error: DiscordAPIError,
			type: 'ban' | 'kick'
		) => any
	);
}

type AntiSpamData = {
	messageCache: {
		content: string;
		author: Snowflake;
	}[];
	users: {
		time: number;
		id: Snowflake;
	}[];
	bannedUsers: Snowflake[];
	kickedUsers: Snowflake[];
	warnedUsers: Snowflake[];
};

type AntiSpamOptions = {
	client?: Client;
	warnThreshold?: number;
	banThreshold?: number;
	kickThreshold?: number;
	maxInterval?: number;
	warnMessage?: string;
	banMessage?: string;
	kickMessage?: string;
	maxDuplicatesWarning?: number;
	maxDuplicatesBan?: number;
	maxDuplicatesKick?: number;
	deleteMessagesAfterBanForPastDays?: number;
	exemptPermissions?: PermissionResolvable[];
	ignoreBots?: boolean;
	verbose?: boolean;
	ignoredUsers?: Snowflake[] | ((user: User) => boolean);
	ignoredRoles?: (Snowflake | string)[] | ((role: Role) => boolean);
	ignoredGuilds?: Snowflake[] | ((guild: Guild) => boolean);
	ignoredChannels?: Snowflake[] | ((channel: TextChannel) => boolean);
	warnEnabled?: boolean;
	kickEnabled?: boolean;
	banEnabled?: boolean;
};
