import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { GatewayIntentBits, Message } from "discord.js";

export class Echo extends BaseModule implements Module {
    name = "echo";
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
        await message.reply(message.content);
        await next();
    }
}
