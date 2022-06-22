import { Client, Token } from "../mod.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("<your token>")
});

/* Print a list of entities within the structure every five seconds. */
setInterval(async () => {
	/**
	 * Example output:
	 * 
	 * [
	 *		Entity {
	 *			type: "PLAYER",
	 *			name: "f1nniboy",
	 *			player: Player { name: "f1nniboy", uuid: "52e75143-a651-4755-b216-0497683f53bc" },
	 *			health: 20,
	 *			maxHealth: 20,
	 *			location: Location { x: 1.69..., y: -1, z: 3.77... }
	 *		}
	 * ]
	 */
	console.log(
		(await client.getEntities())
			.map(entity => `${entity.type} ${entity.name} - ${entity.location.toString()}`)
			.join(", ")
	);
}, 5000);