import { Client, Token } from "../mod.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("<your token>")
});

/* Print a summary of the fuel usage every five seconds. */
setInterval(async () => {
	console.log(await client.getFuelInfo());
}, 5000);