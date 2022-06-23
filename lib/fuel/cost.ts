export interface FuelInfoAPICostData {
	/** How much this API costs normally */
	baseFuelCost: number;

	/** How much this API costs currently */
	fuelCost: number;
}

interface FuelInfoAPICostOptions {
	/** How much this API costs normally */
	base: number;

	/** How much this API costs currently */
	current: number;
}

export class FuelInfoAPICost implements FuelInfoAPICostOptions {
	/* How much this API costs normally */
	public readonly base: number;

	/* How much this API costs currently */
	public readonly current: number;

	constructor({ base, current }: FuelInfoAPICostOptions) {
		this.base = base;
		this.current = current;
	}

	public static from({ baseFuelCost, fuelCost }: FuelInfoAPICostData): FuelInfoAPICost {
		return new FuelInfoAPICost({
			base: baseFuelCost,
			current: fuelCost
		});
	}
}