export type Language = string | symbol | number;
export type Token = string | symbol | number;
export type Table = {
    [key: Language]: Record<Token, string | ((params: any) => string)>;
};

export interface I18nOptions {
    fallback: string;
    table: Table;
    controller_prefix: string | null;
}

export interface I18nContext<
    T extends Table = Table,
    Fallback extends keyof T = "en",
    Keys extends Token = keyof T[Fallback],
> {
    t: <Key extends Keys>(
        key: Key,
        ...params: T[Fallback][Key] extends (params: infer P) => string ? [P] : [undefined?]
    ) => string;
    lang: () => string;
}
