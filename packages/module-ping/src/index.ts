import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { GatewayIntentBits, Message } from "discord.js";

export class Ping extends BaseModule implements Module {
    name = "ping";
    intents = [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ];

    async messageCreate(
        [message]: [Message],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void> {
        if (message.guild) {
            await message.reply("pong (guild message)");
        } else {
            await message.reply("pong (direct message)");
        }
        await next();
    }
}
