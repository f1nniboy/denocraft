interface LocationOptions {
	/** X coordinate of the location */
	x: number;

	/** Y coordinate of the location */
	y: number;

	/** Z coordinate of the location */
	z: number;
}

type WorldLocationOptions = LocationOptions & {
	/* Name of the location's world */
	world: string;
}

export class Location implements LocationOptions {
	/* X coordinate of the location */
	public x: number;

	/* Y coordinate of the location */
	public y: number;

	/* Z coordinate of the location */
	public z: number;

	constructor({ x, y, z }: LocationOptions) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Create a new location.
	 * @returns New location instance
	 */
	public static from(x: number, y: number, z: number): Location {
		return new Location({ x, y, z });
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