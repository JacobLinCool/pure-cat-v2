import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { Message, ClientEvents } from "discord.js";
import { I18nOptions, Table, I18nContext } from "./types";
import {
    internal_table,
    t_current_lang,
    t_lang_set,
    t_lang_not_found,
    t_test,
    t_help,
} from "./internal-table";

export class I18n extends BaseModule implements Module {
    name = "i18n";
    fallback: string;
    table: Table = {};
    controller_prefix: string | null;

    constructor({
        fallback = "en",
        table = {},
        controller_prefix = "!lang",
    }: Partial<I18nOptions> = {}) {
        super();
        this.fallback = fallback;
        this.load(internal_table);
        this.load(table);
        this.controller_prefix = controller_prefix;
    }

    /**
     * Load i18n table into i18n module.
     * @param table Translation table to load.
     */
    load(table: Table): void {
        for (const lang in table) {
            this.table[lang] = {
                ...this.table[lang],
                ...table[lang],
            };
        }
    }

    async ctx(
        args: ClientEvents[keyof ClientEvents],
        ctx: StoreContext & I18nContext<typeof internal_table>,
        next: CallNextModule,
    ): Promise<void> {
        const lang: string =
            ((await (ctx.user || ctx.channel || ctx.guild)())?.language as string) || this.fallback;

        // @ts-expect-error Generic type
        ctx.t = (key: keyof typeof internal_table["en"], params: Record<string, string> = {}) => {
            const str = this.table[lang]?.[key] || this.table[this.fallback]?.[key];
            return typeof str === "function" ? str(params) : str || key;
        };
        ctx.lang = () => lang;

        await next();
    }

    async messageCreate(
        [message]: [Message],
        ctx: StoreContext & I18nContext<typeof internal_table>,
        next: CallNextModule,
    ): Promise<void> {
        if (this.controller_prefix && message.content.startsWith(this.controller_prefix)) {
            const command = message.content.slice(this.controller_prefix.length).trim();
            if (command === "") {
                const user = await ctx.user<{ language?: string }>();
                const channel = await ctx.channel<{ language?: string }>();
                const guild = await ctx.guild<{ language?: string }>();
                await message.channel.send(
                    ctx.t(t_current_lang, {
                        user: user?.language || "none",
                        channel: channel?.language || "none",
                        guild: guild?.language || "none",
                        fallback: this.fallback,
                    }),
                );
            } else if (command === "test") {
                await message.channel.send(ctx.t(t_test));
            } else if (command === "list") {
                await message.channel.send("```\n" + Object.keys(this.table).join("\n") + "\n```");
            } else if (command === "help") {
                await message.channel.send(ctx.t(t_help, { prefix: this.controller_prefix }));
            } else {
                const lang = command.split(" ")[0];
                if (this.table[lang]) {
                    const user = await ctx.user<{ language?: string }>();
                    if (user) {
                        user.language = lang;
                    }
                    await message.channel.send(ctx.t(t_lang_set, { lang }));
                } else {
                    await message.channel.send(ctx.t(t_lang_not_found, { lang }));
                }
            }
        } else {
            await next();
        }
    }
}
