import { EventEmitter } from "events";
import {
  PermissionResolvable,
  Snowflake,
  User,
  Guild,
  TextChannel,
  GuildMember,
  Message,
  DiscordAPIError,
  Role,
} from "discord.js";
declare module "discord-anti-spam" {
  class AntiSpam extends EventEmitter {
    constructor(options?: AntiSpamOptions);
    public options: AntiSpamOptions;
    public data: AntiSpamData;

    public message(message: Message): Promise<boolean>;
    public resetData(): AntiSpamData;

    public on(
      event: "banAdd" | "kickAdd" | "warnAdd" | "muteAdd",
      listener: (member: GuildMember) => any
    ): this;
    public on(
      event:
        | "spamThresholdBan"
        | "spamThresholdKick"
        | "spamThresholdWarn"
        | "spamThresholdMute",
      listener: (member: GuildMember, duplicateMessages: boolean) => any
    ): this;
    public on(
      event: "error",
      listener: (
        message: Message,
        error: DiscordAPIError,
        type: "ban" | "kick" | "mute"
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
    modLogsChannelName?: string;
    modLogsEnabled?: boolean;
    modLogsMode?: "embed" | "message";

    warnMessage?: string;
    muteMessage?: string;
    kickMessage?: string;
    banMessage?: string;

    actionInEmbed?: boolean;
    actionEmbedIn?: "channel" | "dm";
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

    ignoredMembers?: Snowflake[] | ((user: User) => boolean);
    ignoredRoles?: (Snowflake | string)[] | ((role: Role) => boolean);
    ignoredGuilds?: Snowflake[] | ((guild: Guild) => boolean);
    ignoredChannels?: Snowflake[] | ((channel: TextChannel) => boolean);
    ignoredPermissions?: PermissionResolvable[];
    ignoreBots?: boolean;

    warnEnabled?: boolean;
    kickEnabled?: boolean;
    banEnabled?: boolean;
    muteEnabled?: boolean;

    deleteMessagesAfterBanForPastDays?: number;
    verbose?: boolean;
    debug?: boolean;
    removeMessages?: boolean;

    MultipleSanctions?: boolean;
  };

  export default AntiSpam;
}
