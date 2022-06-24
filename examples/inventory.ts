import { Client, Token, Location } from "../mod.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("<your token>")
});

/* Location of the source & target container */
const source = Location.from(0, 0, 0);
const target = Location.from(1, 0, 0);

setInterval(async () => {
	/* Get the inventory of the chest. */
	const inventory = await client.getInventory(source);

	/* Move all of the items inside of the inventory into the target container. */
	inventory.forEach(item => {
		item.move(target);
	});
}, 1000);