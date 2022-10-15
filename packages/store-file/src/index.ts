import fs from "node:fs";
import path from "node:path";
import { ClientEvents } from "discord.js";
import { BaseModule, Module, StoreContext, id_resolver, CallNextModule } from "pure-cat";

export class FileStore extends BaseModule implements Module {
    name = "file-store";
    private root: string;
    private guilds: string;
    private channels: string;
    private users: string;

    /**
     * @param dir The directory to store data in
     */
    constructor(dir = ".store") {
        super();
        this.root = path.resolve(dir);
        this.guilds = path.join(this.root, ".guilds");
        this.channels = path.join(this.root, ".channels");
        this.users = path.join(this.root, ".users");

        if (!fs.existsSync(this.root)) {
            fs.mkdirSync(this.root, { recursive: true });
        }

        if (!fs.existsSync(this.guilds)) {
            fs.mkdirSync(this.guilds);
        }

        if (!fs.existsSync(this.channels)) {
            fs.mkdirSync(this.channels);
        }

        if (!fs.existsSync(this.users)) {
            fs.mkdirSync(this.users);
        }
    }

    private proxy<T>(type: "guilds" | "channels" | "users" | "global", key: string): T {
        let file: string;
        let data: Record<string, unknown>;

        if (type === "guilds") {
            file = path.join(this.guilds, key + ".json");
        } else if (type === "channels") {
            file = path.join(this.channels, key + ".json");
        } else if (type === "users") {
            file = path.join(this.users, key + ".json");
        } else {
            file = path.join(this.root, "global.json");
        }

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file, "utf-8"));
        } else {
            data = {};
        }

        return new Proxy(data, {
            set: (target, prop, value) => {
                if (typeof prop === "string") {
                    target[prop] = value;
                    fs.writeFileSync(file, JSON.stringify(target));
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
                cache.guild = this.proxy("guilds", resolved.guild);
            }

            return cache.guild;
        };

        ctx.channel = async () => {
            if (!resolved.channel) {
                return undefined;
            }

            if (!cache.channel) {
                cache.channel = this.proxy("channels", resolved.channel);
            }

            return cache.channel;
        };

        ctx.user = async () => {
            if (!resolved.user) {
                return undefined;
            }

            if (!cache.user) {
                cache.user = this.proxy("users", resolved.user);
            }

            return cache.user;
        };

        ctx.global = async (key: string) => {
            if (!cache.global[key]) {
                cache.global[key] = this.proxy("global", key);
            }

            return cache.global[key];
        };

        await next();
    }
}
