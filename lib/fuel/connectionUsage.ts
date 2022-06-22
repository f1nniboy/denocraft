export interface FuelInfoConnectionUsageOptions {
	/* The amount of fuel used in the past second */
	second: number;

	/* The amount of fuel used in the past minute */
	minute: number;
}

export class FuelInfoConnectionUsage implements FuelInfoConnectionUsageOptions {
	/* The amount of fuel used in the past second */
	public readonly second: number;

	/* The amount of fuel used in the past minute */
	public readonly minute: number;

	constructor({ second, minute }: FuelInfoConnectionUsageOptions) {
		this.second = second;
		this.minute = minute;
	}
}