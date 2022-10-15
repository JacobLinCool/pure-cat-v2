import { createInterface } from "node:readline";
import { BaseModule, Bot, Module } from "pure-cat";
import { NodeVM } from "vm2";

export class Terminal extends BaseModule implements Module {
    name = "terminal";
    intents = [];

    async init(bot?: Bot): Promise<void> {
        const io = createInterface({ input: process.stdin, output: process.stdout });
        io.on("close", () => {
            process.exit();
        });

        const vm = new NodeVM({ sandbox: { bot } });

        function ask() {
            io.question("(Bot) $ ", (input) => {
                if (input.trim()) {
                    try {
                        vm.run(input);
                    } catch (err) {
                        console.error(err);
                    }
                }
                ask();
            });
        }

        ask();
        return super.init(bot);
    }
}
