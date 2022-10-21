import {
    BaseChannel,
    BaseInteraction,
    ClientEvents,
    Guild,
    GuildMember,
    Message,
} from "discord.js";
import { BaseModule } from "./module";
import { StoreContext, Module, CallNextModule } from "./types";

export class MemStore extends BaseModule implements Module {
    name = "mem-store";
    private guild_store = new Map<string, unknown>();
    private channel_store = new Map<string, unknown>();
    private user_store = new Map<string, unknown>();
    private global_store = new Map<string, unknown>();

    private proxy<T>(map: Map<string, unknown>, key: string): T {
        const data = (map.get(key) || {}) as Record<string, unknown>;

        return new Proxy(data, {
            set: (target, prop, value) => {
                if (typeof prop === "string") {
                    target[prop] = value;
                    map.set(key, target);
                    return true;
                } else {
                    return false;
                }
            },
            get: (target, prop) => {
                if (typeof prop === "string") {
                    return target[prop];
                } else {
                    return undefined;
                }
            },
        }) as T;
    }

    async ctx(
        args: ClientEvents[keyof ClientEvents],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void> {
        const resolved = id_resolver(args);

        const cache: Record<string, any> = {
            guild: null,
            channel: null,
            user: null,
            global: {},
        };

        ctx.guild = async () => {
            if (!resolved.guild) {
                return undefined;
            }

            if (!cache.guild) {
                cache.guild = this.proxy<Guild>(this.guild_store, resolved.guild);
            }

            return cache.guild;
        };

        ctx.channel = async () => {
            if (!resolved.channel) {
                return undefined;
            }

            if (!cache.channel) {
                cache.channel = this.proxy<BaseChannel>(this.channel_store, resolved.channel);
            }

            return cache.channel;
        };

        ctx.user = async () => {
            if (!resolved.user) {
                return undefined;
            }

            if (!cache.user) {
                cache.user = this.proxy<GuildMember>(this.user_store, resolved.user);
            }

            return cache.user;
        };

        ctx.global = async (key: string) => {
            if (!cache.global[key]) {
                cache.global[key] = this.proxy(this.global_store, key);
            }

            return cache.global[key];
        };

        await next();
    }
}

export function id_resolver(args: ClientEvents[keyof ClientEvents]): {
    guild?: string;
    channel?: string;
    user?: string;
} {
    const result: { guild?: string; channel?: string; user?: string } = {};

    for (const arg of args) {
        if (arg instanceof Message) {
            if (arg.guild?.id) {
                result.guild = arg.guild.id;
            }

            result.channel = arg.channel.id;

            if (arg.member?.id) {
                result.user = arg.member.id;
            }
        } else if (arg instanceof BaseInteraction) {
            if (arg.guild?.id) {
                result.guild = arg.guild.id;
            }

            if (arg.channel?.id) {
                result.channel = arg.channel.id;
            }

            if (arg.user?.id) {
                // @ts-expect-error member is not defined in APIInteractionGuildMember
                result.member = arg.user.id;
            }
        } else if (arg instanceof Guild) {
            result.guild = arg.id;
        } else if (arg instanceof GuildMember) {
            result.guild = arg.guild.id;
            result.user = arg.id;
        } else if (arg instanceof BaseChannel) {
            if (!arg.isDMBased()) {
                result.guild = arg.guild.id;
            }
            result.channel = arg.id;
        } else {
            // @ts-expect-error generic type call
            if (arg?.guild) {
                // @ts-expect-error generic type call
                result.guild = arg.guild.id;
            }
            // @ts-expect-error generic type call
            if (arg?.channel) {
                // @ts-expect-error generic type call
                result.channel = arg.channel.id;
            }
            // @ts-expect-error generic type call
            if (arg?.member) {
                // @ts-expect-error generic type call
                result.user = arg.member.id;
            }
        }
    }

    return result;
}
