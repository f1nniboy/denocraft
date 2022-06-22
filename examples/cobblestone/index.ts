import { Client, Token, Location, Block } from "../../mod.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("<your token>")
});

/* Watch the cobblestone block for block updates. */
client.poll(Location.from(1, 0, 0));

/* Wait for the block to be updated inside of the structure. */
client.on("blockUpdate", ({ block, location }) => {
	/* If the new block is cobblestone, replace the block with `minecraft:air`, to remove it and add it to the chest. */
	if (block.equals(Block.from("minecraft:cobblestone"))) client.setBlock(location, null);
});