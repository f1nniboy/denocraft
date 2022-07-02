export enum ActionType {
	/** Authenticate to the ReplCraft server */
	Authenticate = "authenticate",

	/** Get the size of the structure */
	GetSize = "get_size",

	/** Get the world location of the structure */
	GetLocation = "get_location",

	/** Get a block within the structure */
	GetBlock = "get_block",

	/** Set a block within the structure */
	SetBlock = "set_block",

	/** Watch a block for updates */
	Watch = "watch",

	/** Stop watching a block for updates */
	Unwatch = "unwatch",

	/** Poll a block for updates */
	Poll = "poll",

	/** Stop polling a block for updates */
	Unpoll = "unpoll",

	/** Tell the player a message privately */
	Tell = "tell",

	/** Respond to a transaction */
	TransactionRespond = "respond",

	/** Get a list of entities */
	GetEntities = "get_entities",

	/** Get information about the current fuel usage */
	GetFuelInfo = "fuelinfo",

	/** Keep the connection alive */
	Heartbeat = "heartbeat",

	/** Update the text of a sign */
	SetSignText = "set_sign_text",

	/** Get the text of a sign */
	GetSignText = "get_sign_text",

	/** Get the contents of a container inside of the structure */
	GetInventory = "get_inventory",

	/** Move an item inside of a container to another slot */
	MoveItem = "move_item",

	/** Get the power level of a redstone source */
	GetPowerLevel = "get_power_level",

	/** Give money to another player */
	Pay = "pay",

	/** Craft an item using its recipe */
	Craft = "craft",

	/** Watch all of the structure's blocks at once */
	WatchAll = "watch_all",

	/** Unwatch all of the structure's blocks at once */
	UnwatchAll = "watch_all",

	/** Poll all of the structure's blocks at once */
	PollAll = "poll_all",

	/** Unpoll all of the structure's blocks at once */
	UnpollAll = "unpoll_all"
}

export type ActionData = { [key: string]: unknown }

export type ResponseData = ActionData & {
	/* Identifier of the action */
	nonce: string;

	/* Whether the action was successful */
	ok: boolean;
}

/** ReplCraft response to an action */
export interface ActionResponse {
	/* Whether the action was successful */
	success: boolean;

	/* Data of the response */
	data: ActionData;
}