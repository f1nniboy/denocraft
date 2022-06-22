import { CraftError } from "../error.ts";

interface PlayerOptions {
	/** Name of the player */
	name?: string;

	/** UUID of the player */
	uuid?: string;
}

export class Player {
	/** Name of the player */
	public readonly name: string | null;

	/** UUID of the player */
	public readonly uuid: string | null;

	constructor({ name, uuid }: PlayerOptions) {
		/* If no name or UUID was specified, throw an error. */
		if (name === undefined && uuid === undefined) throw new CraftError("A name or UUID has to be given for a player");
		
		this.name = name ?? null;
		this.uuid = uuid ?? null;
	}

	/**
	 * Get the player's UUID or name, with the UUID taking priority.
	 * @returns Player's UUID or name
	 */
	public toString() {
		return this.uuid || this.name!;
	}
}