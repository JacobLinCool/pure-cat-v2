import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { GatewayIntentBits, Message } from "discord.js";

export class Ignore extends BaseModule implements Module {
    name = "ignore";
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
        if (message.author.bot) {
            this.debug(`ignoring bot message from ${message.author.username}`);
            return;
        }
        await next();
    }
}
