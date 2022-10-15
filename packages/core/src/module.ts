import Debug from "debug";
import { GatewayIntentBits } from "discord.js";
import { Bot } from "./bot";
import { Module } from "./types";

export class BaseModule implements Module {
    /** The name of the module */
    name = "base";
    /** The intents that the module requires */
    intents: GatewayIntentBits[] = [];
    bot?: Bot;
    private _debug?: Debug.Debugger;

    /**
     * Print debug message if environment variable `DEBUG` is set.
     * @param formatter The formatter.
     * @param args The arguments to pass to the formatter.
     */
    debug(formatter: unknown, ...args: unknown[]): void {
        if (!this._debug) {
            this._debug = Debug(`module:${this.name}`);
        }

        this._debug(formatter, ...args);
    }

    async init(bot?: Bot): Promise<void> {
        if (bot) {
            this.bot = bot;
        }

        this.debug(`initialized.`);
    }
}
