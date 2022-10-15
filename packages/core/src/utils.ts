import fs from "node:fs";
import path from "node:path";
import Debug from "debug";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

const debug = Debug("core:utils");

/**
 * Load environment variables from .env file recursively, from the current working directory to the root.
 * @param once Whether to load the .env file only once.
 */
export function load_env_recursively(once = false): void {
    const slices = process.cwd().split(path.sep);

    while (slices.length) {
        const envfile = [...slices, ".env"].join(path.sep);

        if (fs.existsSync(envfile)) {
            debug(`loading env vars from ${envfile}`);
            expand(config({ path: envfile }));
            debug(`loaded env vars from ${envfile}`);

            if (once) {
                break;
            }
        }

        slices.pop();
    }
}
