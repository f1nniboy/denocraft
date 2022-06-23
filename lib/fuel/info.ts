import { FuelInfoConnection, FuelInfoConnectionData } from "./connection.ts";
import { FuelInfoStrategy, FuelInfoStrategyOptions } from "./strategy.ts";
import { FuelInfoAPICost, FuelInfoAPICostData } from "./cost.ts";

export interface FuelInfoData {
	/** List of active connections to the player's structures */
	connections: FuelInfoConnectionData[];

	/** List of strategies and how much fuel they have in reserve */
	strategies: FuelInfoStrategyOptions[];

	/** List of APIs to call and their fuel costs */
	apis: { [route: string]: FuelInfoAPICostData };
}

interface FuelInfoOptions {
	/** List of active connections to the player's structures */
	connections: FuelInfoConnection[];

	/** List of strategies and how much fuel they have in reserve */
	strategies: FuelInfoStrategy[];

	/** List of APIs to call and their fuel costs */
	apis: Map<string, FuelInfoAPICost>;
}

export class FuelInfo implements FuelInfoOptions {
	/** List of active connections to the player's structures */
	public readonly connections: FuelInfoConnection[];

	/** List of strategies and how much fuel they have in reserve */
	public readonly strategies: FuelInfoStrategy[];

	/** List of APIs to call and their fuel costs */
	public readonly apis: Map<string, FuelInfoAPICost>;

	constructor({ connections, strategies, apis }: FuelInfoOptions) {
		this.connections = connections;
		this.strategies = strategies;
		this.apis = apis;
	}
	
	public static from({ connections, strategies, apis }: FuelInfoData): FuelInfo {
		/* Fuel used by the API routes */
		const apiList: Map<string, FuelInfoAPICost> = new Map();

		/* Convert the Object into a JavaScript map. */
		Object.entries(apis).forEach(([route, cost]) => {
			apiList.set(route, FuelInfoAPICost.from(cost));
		});

		return new FuelInfo({
			connections: connections.map(connection => FuelInfoConnection.from(connection)),
			strategies: strategies.map(strategy => new FuelInfoStrategy(strategy)),
			apis: apiList
		});
	}
}