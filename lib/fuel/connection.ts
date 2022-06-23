import { FuelInfoConnectionUsage, FuelInfoConnectionUsageOptions } from "./connectionUsage.ts";
import { Location } from "../world/location.ts";

export interface FuelInfoConnectionData {
	/** Location of the structure */
	x: number;
	y: number;
	z: number;

	/** Textual representation of the structure, subject to change */
	structure: string;

	/** Fuel used by the API routes */
	fuelUsage: { [route: string]: FuelInfoConnectionUsageOptions };
}

interface FuelInfoConnectionOptions {
	/** Location of the structure */
	location: Location;

	/** Textual representation of the structure, subject to change */
	structure: string;

	/** Fuel used by the API routes */
	usage: Map<string, FuelInfoConnectionUsage>;
}

export class FuelInfoConnection implements FuelInfoConnectionOptions {
	/** Location of the structure */
	public readonly location: Location;

	/** Textual representation of the structure, subject to change */
	public readonly structure: string;

	/** Fuel used by the API routes */
	public readonly usage: Map<string, FuelInfoConnectionUsage>;

	constructor({ location, structure, usage }: FuelInfoConnectionOptions) {
		this.location = location;
		this.structure = structure;
		this.usage = usage;
	}
	
	public static from({ x, y, z, structure, fuelUsage }: FuelInfoConnectionData): FuelInfoConnection {
		/* Fuel used by the API routes */
		const usage: Map<string, FuelInfoConnectionUsage> = new Map();

		/* Convert the Object into a JavaScript map. */
		Object.entries(fuelUsage).forEach(([route, routeUsage]) => {
			usage.set(route, new FuelInfoConnectionUsage(routeUsage));
		});

		return new FuelInfoConnection({
			location: Location.from(x, y, z),
			structure,
			usage
		});
	}
}