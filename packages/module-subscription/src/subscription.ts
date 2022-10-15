import { BaseModule, CallNextModule, Module, StoreContext, id_resolver } from "pure-cat";
import { ClientEvents, GatewayIntentBits } from "discord.js";

export interface StoreSubContext {
    subs?: <T extends string>() => Promise<Map<T, Date>>;
}

export class Subscription extends BaseModule implements Module {
    name = "subscription";
    intents = [GatewayIntentBits.Guilds];
    initialized = new Set<string>();

    constructor(private plans = ["premium", "test"]) {
        super();
    }

    async all(
        args: ClientEvents[keyof ClientEvents],
        ctx: StoreContext,
        next: CallNextModule,
    ): Promise<void> {
        await this.attach(id_resolver(args), ctx);
        await next();
    }

    private async attach(
        id: { guild?: string; channel?: string; user?: string },
        ctx: StoreContext & StoreSubContext,
    ) {
        if (id.guild && !this.initialized.has(`g-${id.guild}`)) {
            const guild = await ctx.guild<{ subscription?: Record<string, Date> }>();
            if (guild) {
                guild.subscription = {
                    ...this.plans.reduce((acc, plan) => {
                        acc[plan] = new Date(0);
                        return acc;
                    }, {} as Record<string, Date>),
                    ...(guild.subscription || {}),
                };
            }

            this.initialized.add(`g-${id.guild}`);
        }

        let cache: unknown;
        ctx["subs"] = async <T extends string>() => {
            if (!cache) {
                cache = await this.subs<T>(ctx);
            }
            return cache as Map<T, Date>;
        };
    }

    async subs<T extends string>(ctx: StoreContext): Promise<Map<T, Date>> {
        const guild = await ctx.guild<{ subscription?: Record<string, Date> }>();
        if (guild && guild.subscription) {
            const subs = Object.entries(guild.subscription).filter(
                ([, exp]) => exp.getTime() > Date.now(),
            );
            return new Map(subs) as Map<T, Date>;
        }
        return new Map();
    }
}
