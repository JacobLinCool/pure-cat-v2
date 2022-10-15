import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { Message } from "discord.js";

export class WordCount extends BaseModule implements Module {
    name = "wordcount";

    async messageCreate(
        [message]: [Message],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void> {
        if (message.content.trim() === "!wc") {
            const guild = await ctx.guild<{ word_count?: number }>();
            const channel = await ctx.channel<{ word_count?: number }>();

            const wc_guild = guild ? guild.word_count || 0 : 0;
            const wc_channel = channel ? channel.word_count || 0 : 0;

            await message.reply(`Guild word count: ${wc_guild}\nChannel word count: ${wc_channel}`);
        } else {
            const guild = await ctx.guild<{ word_count?: number }>();
            const channel = await ctx.channel<{ word_count?: number }>();

            if (guild) {
                guild.word_count = (guild.word_count || 0) + message.content.length;
            }
            if (channel) {
                channel.word_count = (channel.word_count || 0) + message.content.length;
            }

            await next();
        }
    }
}
