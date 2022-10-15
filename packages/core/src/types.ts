import type { Events, ClientEvents, GatewayIntentBits } from "discord.js";
import type { Bot } from "./bot";

export type CallNextModule = () => Promise<void>;

export interface BotConfig {
    /** Auto load environment variables from .env files? */
    load_env: boolean;
    /** Events that the bot should listen to. */
    events: Events[];
}

export interface Module {
    name: string;
    intents?: GatewayIntentBits[];

    init?(bot: Bot): Promise<void>;
    messageCreate?(
        args: ClientEvents["messageCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageDelete?(
        args: ClientEvents["messageDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageDeleteBulk?(
        args: ClientEvents["messageDeleteBulk"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageReactionAdd?(
        args: ClientEvents["messageReactionAdd"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageReactionRemove?(
        args: ClientEvents["messageReactionRemove"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageReactionRemoveAll?(
        args: ClientEvents["messageReactionRemoveAll"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageReactionRemoveEmoji?(
        args: ClientEvents["messageReactionRemoveEmoji"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    messageUpdate?(
        args: ClientEvents["messageUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    channelCreate?(
        args: ClientEvents["channelCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    channelDelete?(
        args: ClientEvents["channelDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    channelPinsUpdate?(
        args: ClientEvents["channelPinsUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    channelUpdate?(
        args: ClientEvents["channelUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    ready?(args: ClientEvents["ready"], ctx: StoreContext, next: CallNextModule): Promise<void>;
    guildCreate?(
        args: ClientEvents["guildCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildDelete?(
        args: ClientEvents["guildDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildUnavailable?(
        args: ClientEvents["guildUnavailable"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildUpdate?(
        args: ClientEvents["guildUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    inviteCreate?(
        args: ClientEvents["inviteCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    inviteDelete?(
        args: ClientEvents["inviteDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildMemberAdd?(
        args: ClientEvents["guildMemberAdd"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildMemberAvailable?(
        args: ClientEvents["guildMemberAvailable"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildMemberRemove?(
        args: ClientEvents["guildMemberRemove"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildMembersChunk?(
        args: ClientEvents["guildMembersChunk"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildMemberUpdate?(
        args: ClientEvents["guildMemberUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    guildIntegrationsUpdate?(
        args: ClientEvents["guildIntegrationsUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    roleCreate?(
        args: ClientEvents["roleCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    roleDelete?(
        args: ClientEvents["roleDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    roleUpdate?(
        args: ClientEvents["roleUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    presenceUpdate?(
        args: ClientEvents["presenceUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    typingStart?(
        args: ClientEvents["typingStart"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    userUpdate?(
        args: ClientEvents["userUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    voiceStateUpdate?(
        args: ClientEvents["voiceStateUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    webhookUpdate?(
        args: ClientEvents["webhookUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    interactionCreate?(
        args: ClientEvents["interactionCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    shardDisconnect?(
        args: ClientEvents["shardDisconnect"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    shardError?(
        args: ClientEvents["shardError"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    shardReady?(
        args: ClientEvents["shardReady"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    shardReconnecting?(
        args: ClientEvents["shardReconnecting"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    shardResume?(
        args: ClientEvents["shardResume"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    invalidated?(
        args: ClientEvents["invalidated"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    emojiCreate?(
        args: ClientEvents["emojiCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    emojiDelete?(
        args: ClientEvents["emojiDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    emojiUpdate?(
        args: ClientEvents["emojiUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    stageInstanceCreate?(
        args: ClientEvents["stageInstanceCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    stageInstanceDelete?(
        args: ClientEvents["stageInstanceDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    stageInstanceUpdate?(
        args: ClientEvents["stageInstanceUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    threadCreate?(
        args: ClientEvents["threadCreate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    threadDelete?(
        args: ClientEvents["threadDelete"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    threadListSync?(
        args: ClientEvents["threadListSync"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    threadMembersUpdate?(
        args: ClientEvents["threadMembersUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    threadMemberUpdate?(
        args: ClientEvents["threadMemberUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    threadUpdate?(
        args: ClientEvents["threadUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
    applicationCommandPermissionsUpdate?(
        args: ClientEvents["applicationCommandPermissionsUpdate"],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;

    ctx?(
        args: ClientEvents[keyof ClientEvents],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void>;
}

export interface StoreContext {
    guild<T extends Record<string, unknown> = Record<string, unknown>>(): Promise<T | undefined>;
    channel<T extends Record<string, unknown> = Record<string, unknown>>(): Promise<T | undefined>;
    user<T extends Record<string, unknown> = Record<string, unknown>>(): Promise<T | undefined>;
    global<T extends Record<string, unknown> = Record<string, unknown>>(
        key: string,
    ): Promise<T | undefined>;

    [key: string]: unknown;
}
