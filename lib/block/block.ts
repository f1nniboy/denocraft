import { Location } from "../world/location.ts";
import { Identifier } from "./identifier.ts";
import { CraftError } from "../error.ts";

export interface BlockUpdateEvent {
	/** Location of the block, which was updated */
	location: Location;

	/** Cause of the block update trigger */
	cause: BlockUpdateCause;

	/** Previous block state */
	old: Block;

	/** Current, updated block state */
	block: Block;
}

/* List of possible block update causes for Client#watch() */
export enum BlockUpdateCause {
	Poll = "poll", Burn = "burn", Break = "break",
	Explode = "explode", Fade = "fade", Grow = "grow",
	Ignite = "ignite", PistonExtend = "piston_extend",
	PistonRetract = "piston_retract", Place = "place",
	Fluid = "fluid", Decay = "decay", Redstone = "redstone"
}

interface BlockOptions {
	/* Identifier of the block */
	identifier: Identifier;

	/* States of the block */
	states: Map<string, string>;
}

export class Block implements BlockOptions {
	/* Identifier of the block */
	public readonly identifier: Identifier;

	/* States of the block */
	public readonly states: Map<string, string>;

	constructor({ identifier, states }: BlockOptions) {
		this.identifier = identifier;
		this.states = states;
	}

	/**
	 * Check whether the specified string block identifer is the same as this instance.
	 * @param identifier Block identifier to compare against
	 * 
	 * @returns Whether they are the same block identifier
	 */
	public equals(block: Block): boolean {
		return this.identifier.equals(block.identifier) && this.states.size === block.states.size;
	}

	/**
	 * Convert the parsed block data into a ReplCraft-usable format.
	 * @returns ReplCraft-usable block data format
	 */
	public toString() {
		return `${this.identifier.toString()}${this.states.size > 0 ? `[${Array.from(this.states.entries()).map(([key, value]) => `${key}=${value}`).join(",")}]` : ""}`;
	}

	/**
	 * Parse the specified block data into a usable format.
	 * @param name ReplCraft-specific block string to parse
	 * 
	 * @throws An error, if an invalid block string was provided
	 * @returns Parsed block instance
	 */
	public static from(name: string): Block {
		/* Split the block identifier into various parts. */
		const data: string[] = name.split("[");

		/* If the block identifier has more than two parts, throw an error, as it is an invalid identifier. */
		if (data.length > 2) throw new CraftError("Invalid block identifier");

		/* Identifier of the block */
		const identifier: Identifier = Identifier.from(data[0]);
		
		/* If the block doesn't have any states, return. */
		if (data.length < 2) return new Block({ identifier, states: new Map() });

		/* States of the block */
		const rawStates: string[] = data[1].slice(undefined, -1).split(",");
		const states: Map<string, string> = new Map();
		
		/* Add the various states to the map. */
		rawStates.forEach(state => {
			/* Data of the state */
			const [ key, value ]: string[] = state.split("=");

			/* If either the key or value is undefined, ignore this state. */
			if (key === undefined || value === undefined) return;

			states.set(key, value);
		});

		return new Block({
			identifier, states
		});
	}
}