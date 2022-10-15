export const t_current_lang = Symbol("i18n:current-lang");
export const t_lang_set = Symbol("i18n:lang-set");
export const t_lang_not_found = Symbol("i18n:lang-not-found");
export const t_test = Symbol("i18n:test");
export const t_help = Symbol("i18n:help");

export const internal_table = {
    en: {
        [t_current_lang](a: {
            user: string;
            channel: string;
            guild: string;
            fallback: string;
        }): string {
            return `Current language:\n - User: **${a.user}**\n - Channel: **${a.channel}**\n - Guild: **${a.guild}**\n - Fallback: **${a.fallback}**`;
        },
        [t_lang_set](a: { lang: string }): string {
            return `User language set to **${a.lang}**`;
        },
        [t_lang_not_found](a: { lang: string }): string {
            return `Language **${a.lang}** not found`;
        },
        [t_test]: "Test",
        [t_help]: (a: { prefix: string }): string =>
            [
                `Usage: \`${a.prefix} test|[lang]\``,
                ` - \`${a.prefix} test\`: Request a test message.`,
                ` - \`${a.prefix}\`: Show the current language settings.`,
                ` - \`${a.prefix} <lang>\`: Set user language to <lang>.`,
                ` - \`${a.prefix} list\`: List all supported languages.`,
            ].join("\n"),
    },
    zh: {
        [t_current_lang](a: {
            user: string;
            channel: string;
            guild: string;
            fallback: string;
        }): string {
            return `目前語言設定:\n - 使用者: **${a.user}**\n - 頻道: **${a.channel}**\n - 伺服器: **${a.guild}**\n - 預設: **${a.fallback}**`;
        },
        [t_lang_set](a: { lang: string }): string {
            return `使用者語言設定為 **${a.lang}**`;
        },
        [t_lang_not_found](a: { lang: string }): string {
            return `找不到語言 **${a.lang}**`;
        },

        [t_test]: "測試",
        [t_help]: (a: { prefix: string }): string =>
            [
                `用法: \`${a.prefix} test|[lang]\``,
                ` - \`${a.prefix} test\`: 請機器人回傳一個測試訊息`,
                ` - \`${a.prefix}\`: 顯示目前的語言設定`,
                ` - \`${a.prefix} <lang>\`: 將使用者語言設定為 lang`,
                ` - \`${a.prefix} list\`: 列出所有支援的語言`,
            ].join("\n"),
    },
};
