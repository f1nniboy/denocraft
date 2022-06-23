import { CraftError } from "../error.ts";

interface IdentifierOptions {
	/** Namespace of the identifier */
	namespace: string;

	/** Block or item identifier */
	identifier: string;
}

export class Identifier implements IdentifierOptions {
	/** Namespace of the identifier, e.g. `minecraft` */
	public readonly namespace: string;

	/** Block or item identifier, e.g. `stone_sword` */
	public readonly identifier: string;

	constructor({ namespace, identifier }: IdentifierOptions) {
		this.namespace = namespace;
		this.identifier = identifier;
	}
	
	/**
	 * Check whether the specified identifier is the same as this instance.
	 * @param identifier Identifier to compare against
	 * 
	 * @returns Whether they are the same identifier
	 */
	public equals(identifier: Identifier): boolean {
		return this.namespace === identifier.namespace && this.identifier === identifier.identifier;
	}

	/**
	 * Convert the identifier into a Minecraft-usable format.
	 * @returns Formatted identifier, with the namespace
	 */
	public toString() {
		return `${this.namespace}:${this.identifier}`;
	}

	/**
	 * Parse a Minecraft identifier from the specified string.
	 * @param name Minecraft identifier to parse
	 * 
	 * @throws An error, if the identifier is invalid
	 * @returns Parsed Minecraft identifier
	 */
	public static from(name: string): Identifier {
		/* Split the identifier into their two respective parts. */
		const data: string[] = name.split(":");

		/* If the length does not match, throw an error. */
		if (data.length !== 2) throw new CraftError("Invalid identifier");

		const [ namespace, identifier ] = data;
		return new Identifier({ namespace, identifier })
	}
}