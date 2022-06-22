import { WorldLocation } from "./world/location.ts";
import { Player } from "./world/player.ts";
import { CraftError } from "./error.ts";

interface TokenData {
	/** Dynamic IP of the host */
	host: string;

	/** Where the sign block is located in the world */
	world: string;
	x: number;
	y: number;
	z: number;

	/** Information about the owner of the structure */
	uuid: string;
	username: string;

	/** Permission level of the structure */
	permission: TokenPermission;
}

interface TokenOptions {
	/* Dynamic IP of the host */
	host: string;

	/* Where the sign block is located in the world */
	location: WorldLocation;

	/* Information about the owner of the structure */
	owner: Player;

	/* Permission level of the structure */
	permission: TokenPermission;
}

/** Token permission levels */
export enum TokenPermission {
	/* The structure is owned by a specific player */
	Player = "player",

	/* The structure can only be controlled by operators */
	Admin = "admin",

	/* The structure can be controlled by anyone */
	Public = "public",

	/* The type of permission is not known */
	Unknown = "unknown"
}

export class Token implements TokenOptions {
	/* Dynamic IP of the host */
	public readonly host: string;

	/* Where the sign block is located in the world */
	public readonly location: WorldLocation;

	/* Information about the owner of the structure */
	public readonly owner: Player;

	/* Permission level of the structure */
	public readonly permission: TokenPermission;

	/* Raw token data */
	public readonly raw: string;

	constructor(raw: string, { host, location, owner, permission }: TokenOptions) {
		this.host = host;
		this.location = location;
		this.owner = owner ?? null;

		this.permission = permission;
		this.raw = raw;
	}

	/**
	 * Parse a ReplCraft token from the specified string.
	 * @param token ReplCraft token to parse
	 * 
	 * @throws An error, if the token is invalid
	 * @returns Parsed ReplCraft token
	 */
	public static from(token: string): Token {
		/* Try to parse the specified token. */
		try {
			/* JWT token data */
			const data: unknown[] = token.split(".").slice(0, 2).map(part => JSON.parse(atob(part)));

			/* Data of the ReplCraft token */
			const { host, permission, username, uuid, world, x, y, z }: TokenData
				= data[1] as TokenData;

			/* Create a new token instance from the token's data. */
			return new Token(token, {
				host,
				location: new WorldLocation({ world, x, y, z }),
				owner: new Player({ name: !username.startsWith("@") ? username : undefined, uuid }),
				permission
			});
		} catch (_) {
			throw new CraftError("An invalid token was provided");
		}
	}
}