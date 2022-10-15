import EventEmitter from "node:events";
import Debug from "debug";
import { Client, GatewayIntentBits, Partials, Events, ClientEvents } from "discord.js";
import { BotConfig, Module } from "./types";
import { load_env_recursively } from "./utils";
import { MemStore } from "./mem-store";

const debug = Debug("core:bot");

export class Bot extends EventEmitter {
    client: Client = new Client({ intents: [], partials: [Partials.Channel] });
    modules: Module[] = [new MemStore()];
    pipeline: Partial<
        Record<
            Events | "ctx",
            (args: ClientEvents[keyof ClientEvents], ctx: Record<string, unknown>) => Promise<void>
        >
    > = {};
    private _events: Events[];

    constructor(
        {
            load_env = true,
            events = Object.values(Events).filter((evt) => !["raw"].includes(evt)),
        }: Partial<BotConfig> = {} as Partial<BotConfig>,
    ) {
        super();

        if (load_env) {
            load_env_recursively();
        }

        this._events = events;
        for (const event of this._events) {
            debug(`registering event handler for "${event}"`);
            this.client.on(event as string, async (...args: unknown[]) => {
                if (event === "debug") {
                    debug(`discord.js: ${args[0]}`);
                    return;
                }

                const ctx: Record<string, unknown> = {};
                await this.pipeline.ctx?.(args as ClientEvents[keyof ClientEvents], ctx);

                debug(`received event ${event}`);
                this.pipeline[event]?.(args as ClientEvents[keyof ClientEvents], ctx);
            });
        }
    }

    use(...modules: Module[]): this {
        this.modules.push(...modules);
        return this;
    }

    /**
     * Start (login) the bot.
     * @param token The bot token, if not set, it will be read from the environment variable `BOT_TOKEN`.
     * @returns
     */
    async start(token?: string): Promise<void> {
        this.client.options.intents = [
            ...new Set(this.modules.flatMap((module) => module.intents ?? [])),
        ];
        debug(
            `intents: ${this.client.options.intents.map((intent) =>
                typeof intent === "string"
                    ? intent
                    : GatewayIntentBits[intent as GatewayIntentBits] || intent,
            )}`,
        );

        await this.client.login(token || process.env.BOT_TOKEN);
        debug(`logged in, serving ${this.client.guilds.cache.size} guilds`);

        for (const module of this.modules) {
            await module.init?.(this);
        }
        debug("all modules initialized");

        const events = [...this._events, "ctx"] as const;
        for (const event of events) {
            if (event === "debug") {
                continue;
            }

            const modules = this.modules.filter(
                // @ts-expect-error Modules
                (module) => module[event],
            ) as Required<Module>[];
            if (modules.length !== 0) {
                debug(
                    `building pipeline for event "${event}" (${modules
                        .map((m) => m.name)
                        .join(" -> ")})`,
                );
                this.pipeline[event] = async (
                    args: ClientEvents[keyof ClientEvents],
                    ctx: Record<string, unknown>,
                ) => {
                    let idx = -1;

                    const execute = async (i: number): Promise<void> => {
                        if (i <= idx) {
                            throw new Error("handler already called.");
                        }
                        if (i >= (modules.length || -1)) {
                            return;
                        }
                        idx = i;

                        debug(
                            `executing message handler "${modules[i].name}" (${i + 1} of ${
                                modules.length
                            })`,
                        );

                        try {
                            // @ts-expect-error Modules
                            return await modules[i][event]?.(args, ctx, execute.bind(this, i + 1));
                        } catch (err) {
                            if (err instanceof Error) {
                                debug(
                                    `error in message handler (${modules[i].name}): ${err.stack}`,
                                );
                            }
                        }
                    };

                    return execute(0);
                };
            }
        }
    }
}
