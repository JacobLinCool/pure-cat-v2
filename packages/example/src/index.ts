import { Bot, load_env_recursively } from "pure-cat";
import { MongoStore } from "pure-cat-store-mongo";
import { Ignore } from "pure-cat-module-ignore";
import { Echo } from "pure-cat-module-echo";
import { Terminal } from "pure-cat-module-terminal";
import { Subscription, SubscriptionChecker } from "pure-cat-module-subscription";
import { I18n } from "pure-cat-module-i18n";

load_env_recursively();

new Bot({ load_env: false })
    .use(new MongoStore(process.env.MONGODB || ""))
    .use(new Ignore())
    .use(new Subscription(["premium", "premium+", "test"]))
    .use(
        new I18n({
            fallback: "en",
            table: {
                en: {
                    hello: "Hello",
                    bye: "Bye",
                    time: ({ time = new Date(), lang = "" } = { lang: "" }) =>
                        `${time?.toLocaleString(lang)}`,
                },
                zh: {
                    hello: "你好",
                    bye: "掰掰",
                },
            },
        }),
    )
    .use(new SubscriptionChecker())
    // .use(new Echo())
    .use(new Terminal())
    .start()
    .then(() => console.log("Bot started!"));
