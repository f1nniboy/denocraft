import { Player } from "./world/player.ts";
import { CraftError } from "./error.ts";
import { Client } from "./client.ts";

interface TransactionOptions {
	/** Unique identifier of the transaction */
	nonce: number;

	/** Player, who initiated the transaction */
	player: Player;

	/** How much money the player has deposited */
	amount: number;

	/** The text after the `/transact <amount>` command, given by the user */
	query: string;
}

export class Transaction implements TransactionOptions {
	/* Connected client, used to tell the player a message */
	private readonly client: Client;

	/* Unique identifier of the transaction */
	public readonly nonce: number;

	/* Player, who initiated the transaction */
	public readonly player: Player;

	/* How much money the player has deposited */
	public readonly amount: number;

	/* The text after the `/transact <amount>` command, given by the user */
	public readonly query: string;

	/* Whether this transaction has already been accepted or denied */
	private replied: boolean;

	constructor(client: Client, { nonce, player, amount, query }: TransactionOptions) {
		this.client = client;
		this.replied = false;

		this.nonce = nonce;
		this.player = player;
		this.amount = amount;
		this.query = query;
	}

	/**
	 * Tell the player a message privately.
	 * @param message Message to send to the player
	 * 
	 * @throws An error if the player is not inside of the structure or not online
	 */
	 public tell(message: string): Promise<void> {
		/* If this player has no assigned client, throw an error. */
		if (this.client === null) throw new CraftError("This player cannot be sent messages");
		return this.client.tell(this.player, `${message.split("\n").length > 1 ? "\n" : ""}${message.trim().replaceAll("\t", "")}`);
	}

	/**
	 * Respond to the transaction request.
	 * @param status Whether to accept or deny the transaction
	 * 
	 * @throws An error, if the transaction has already been replied to
	 */
	private respond(status: boolean): Promise<void> {
		/* If the transaction has already been replied to, throw an error. */
		if (this.replied) throw new CraftError("The transaction has already been replied to");
		this.replied = true;

		return this.client.transact(this, status);
	}

	/**
	 * Accept the transaction request.
	 * @throws An error, if the transaction has already been replied to
	 */
	public accept(): Promise<void> {
		return this.respond(true);
	}

	/**
	 * Deny the transaction request.
	 * @throws An error, if the transaction has already been replied to
	 */
	public deny(): Promise<void> {
		return this.respond(false);
	}
}