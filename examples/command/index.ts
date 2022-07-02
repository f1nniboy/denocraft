import { Client, Token } from "../../mod.ts";
import { commands } from "./commands.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("<token>")
});

/* Log the amount of registered commands. */
console.log(`Loaded ${commands.length} commands!`);

client.on("transaction", async transaction => {
	/* Split up the command arguments. */
	const args = transaction.query.split(" ");

	/* Get the command name. */
	const commandName = args.shift();
	if (!commandName) return;

	/* Find the corresponding command, to the name. */
	const command = commands.find(cmd => cmd.name === commandName);
	if (!command) return;

	/* If the transaction hasn't been responded to within five seconds, accept it by default. */
	setTimeout(() => !transaction.replied && transaction.accept(), 5000);

	/* Execute the command callback. */
	await command.callback(transaction, args);
})