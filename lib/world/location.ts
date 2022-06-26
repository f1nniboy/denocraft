import { ActionData } from "../action.ts";

interface LocationOptions {
	/** X coordinate of the location */
	x: number;

	/** Y coordinate of the location */
	y: number;

	/** Z coordinate of the location */
	z: number;
}

type WorldLocationOptions = LocationOptions & {
	/** Name of the location's world */
	world: string;
}

export class Location implements LocationOptions {
	/** X coordinate of the location */
	public x: number;

	/** Y coordinate of the location */
	public y: number;

	/** Z coordinate of the location */
	public z: number;

	constructor({ x, y, z }: LocationOptions) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Check whether the locations are at the same location.
	 * @param location Location to compare against
	 * 
	 * @returns Whether they are the same location
	 */
	public equals(location: Location): boolean {
		return location.x === this.x && location.y === this.y && location.z === this.z;
	}

	/**
	 * Create a new location.
	 * @returns New location instance
	 */
	public static from(x: number, y: number, z: number): Location {
		return new Location({ x, y, z });
	}

	/**
	 * Convert the location instance into a ReplCraft-usable object.
	 * @returns ReplCraft-usable location object
	 */
	public toObject(prefix?: string): ActionData {
		return {
			[`${prefix ?? ""}x`]: this.x,
			[`${prefix ?? ""}y`]: this.y,
			[`${prefix ?? ""}z`]: this.z
		};
	}

	public toString() {
		return `${this.x},${this.y},${this.z}`;
	}
}

export class WorldLocation extends Location implements WorldLocationOptions {
	/* Name of the location's world */
	public world: string;

	constructor(options: WorldLocationOptions) {
		super(options);
		this.world = options.world;
	}

	public toString() {
		return `${this.world};${super.toString()}`;
	}
}