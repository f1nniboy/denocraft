export interface FuelInfoStrategyOptions {
	/* Name of the strategy */
	strategy: string;

	/* How much spare fuel this strategy has */
	spareFuel: number;
}

export class FuelInfoStrategy implements FuelInfoStrategyOptions {
	/* Name of the strategy */
	public readonly strategy: string;

	/* How much spare fuel this strategy has */
	public readonly spareFuel: number;

	constructor({ strategy, spareFuel }: FuelInfoStrategyOptions) {
		this.strategy = strategy;
		this.spareFuel = spareFuel;
	}
}