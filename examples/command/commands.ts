import { StructureCommand } from "./cmd.ts";

/* List of commands */
export const commands: StructureCommand[] = [
	{
		name: "example",
		callback: async (transaction, args) => {
			await transaction.tell(`You ran the command with the arguments: ${args.toString()}`);
            await transaction.accept();
		}
	},

	{
		name: "rng",
		callback: async (transaction, args) => {
			await transaction.tell(Math.random().toString());
            await transaction.accept();
		}
	}
];
