/** Generic library error */
export class CraftError extends Error {
	/* Stub */
}

/** An error occured with one of the requests to ReplCraft */
export class CraftRequestError extends CraftError {
	constructor(action: string, message: string) {
		super(`Failed to request '${action}': ${message}`);
	}
}