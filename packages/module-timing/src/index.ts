import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { GatewayIntentBits, Message } from "discord.js";

export class Timing extends BaseModule implements Module {
    name = "timing";
    intents = [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ];

    async messageCreate(
        [message]: [Message],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void> {
        console.time(`message ${message.id}`);
        await next();
        console.timeEnd(`message ${message.id}`);
    }
}
