import { BaseModule, CallNextModule, Module, StoreContext } from "pure-cat";
import { GatewayIntentBits, Message } from "discord.js";
import { StoreSubContext } from "./subscription";

export class SubscriptionChecker extends BaseModule implements Module {
    name = "subscription-checker";
    intents = [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ];

    async messageCreate(
        args: [message: Message<boolean>],
        ctx: StoreContext & StoreSubContext,
        next: CallNextModule,
    ): Promise<void> {
        const [message] = args;

        if (message.content !== "!sub") {
            await next();
            return;
        }

        const subs = await ctx.subs?.();
        if (!subs || subs.size === 0) {
            await message.reply("This server has no active subscriptions.");
            return;
        } else {
            await message.reply(
                `This server has the following active subscriptions: \n${[...subs.entries()]
                    .map(([plan, exp]) => `- **${plan}** (Until ${exp.toLocaleString()})`)
                    .join("\n")}`,
            );
            return;
        }
    }
}
