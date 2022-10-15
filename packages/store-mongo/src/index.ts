import { ClientEvents } from "discord.js";
import { BaseModule, Module, StoreContext, id_resolver, CallNextModule } from "pure-cat";
import { MongoClient, Db } from "mongodb";
import Debug from "debug";

const debug = Debug("store:mongo");

export class MongoStore extends BaseModule implements Module {
    name = "mongo-store";
    private mongo: MongoClient;
    private db: Db;
    private _connected = Promise.resolve(false);

    /**
     * @param url The MongoDB connection URL
     * @param db The database to use
     */
    constructor(url: string, db = "pure-cat") {
        super();
        this.mongo = new MongoClient(url);
        this.db = this.mongo.db(db);
        this.connect();
    }

    private async connect() {
        if (await this._connected) {
            return this.mongo;
        }

        debug("Connecting to MongoDB");
        this._connected = new Promise((resolve, reject) => {
            this.mongo
                .connect()
                .then(() => {
                    debug("Connected to MongoDB");
                    resolve(true);
                })
                .catch(reject);
        });

        await this._connected;

        return this.mongo;
    }

    private async proxy<T>(
        type: "guilds" | "channels" | "users" | "global",
        key: string,
    ): Promise<T> {
        if (!(await this._connected)) {
            await this.connect();
        }

        debug("Proxying %s %s", type, key);
        const collection = this.db.collection(type);
        const doc = await collection.findOne({ _id: key });
        const data = doc ? doc.data : {};
        debug("Retrieved data for %s %s", type, key);

        return new Proxy(data, {
            set: (target, prop, value) => {
                if (typeof prop === "string") {
                    target[prop] = value;
                    collection.updateOne(
                        { _id: key },
                        { $set: { data: target } },
                        { upsert: true, promoteValues: true },
                    );
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
