import { Client, Token, Location } from "../mod.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("<your token>")
});

/* Watch a block for various updates. */
await client.watch(Location.from(0, 0, 0));

/* Wait for a user to start a transaction. */
client.on("transaction", transaction => {
	/* Respond to a transaction with a message. */
	transaction.tell("Response to a transaction" + transaction.player.name);

	/* Transaction#accept or Transaction#deny the transaction. */
	if (transaction.query === "accept") transaction.accept();
	else transaction.deny();
});

/* Wait for a block to be updated inside of the structure. */
client.on("blockUpdate", event => {
	/* Replace the block with `minecraft:air`, to remove it. */
	client.setBlock(event.location, null);
});