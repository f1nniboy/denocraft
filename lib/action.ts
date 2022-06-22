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
	TransactionRespond = "respond"
}

export type ActionData = { [key: string]: unknown };

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