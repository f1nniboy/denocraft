import { ActionResponse, ActionType, ActionData, ResponseData } from "./action.ts";
import { BlockUpdateCause, BlockUpdateEvent } from "./block/block.ts";
import { CraftError, CraftRequestError } from "./error.ts";
import { EventType } from "./event.ts";
import { Token } from "./token.ts";

import { Entity, EntityData } from "./world/entity.ts";
import { Transaction } from "./transaction.ts";
import { Location } from "./world/location.ts";
import { Player } from "./world/player.ts";
import { Block } from "./block/block.ts";

import { StandardWebSocketClient, EventEmitter } from "../deps.ts";

interface ConnectionOptions {
	/** Token of the ReplCraft structure */
	token: Token;
}

/* Events for the client instance */
type ClientEvents = {
	/* A block has been updated */
	blockUpdate: [event: BlockUpdateEvent];

	/* A transaction has been initiated by a player */
	transaction: [transaction: Transaction];

	/* When the client has connected to the server */
	open: [];

	/* When the client has disconnected from the server */
	close: [];

	/* When an error occured with the connection */
	error: [error: Error];
}

/** Information about a ReplCraft event handler */
interface Handler {
	/* Callback to execute once this handler gets called */
	callback: (response: ActionResponse) => void;
}

export class Client extends EventEmitter<ClientEvents> {
	/* Token of the structure */
	public token: Token | null;

	/* WebSocket connection */
	private connection: StandardWebSocketClient | null;

	/* List of event handlers */
	private handlers: Map<number, Handler>;

	/* Current nonce identifier */
	private nonce: number;

	/** Whether the client is currently connected to the server */
	private get connected(): boolean {
		return this.connection !== null
			&& this.connection.webSocket !== undefined
			&& this.connection.webSocket.readyState === WebSocket.OPEN;
	}

	/** Create a new client, which can be connected to a server. */
	constructor() {
		super();

		/* Initialize the variables with empty values. */
		this.handlers = new Map<number, Handler>();
		this.connection = null;
		this.token = null;
		this.nonce = 0;
	}


	/**
	 * Wait until the server has responded to an event with the specified identifier.
	 * @param nonce Identifier of the event to wait for
	 * 
	 * @throws The occured error, if one has been thrown by the server
	 */
	private wait(action: ActionType, nonce: number): Promise<ActionData> {
		return new Promise((resolve, reject) => {
			this.handlers.set(nonce, {
				callback: response => {
					/* If the request has failed, reject the promise with an error. */
					if (!response.success) reject(new CraftRequestError(action, response.data.message as string));
					
					/* If the request has succeeded, resolve the promise with the response's data. */
					else resolve(response.data);
				}
			});
		});
	}

	/**
	 * Send a request to the ReplCraft server.
	 * You should not use this function directly.
	 * 
	 * @param action Action to execute
	 * @param data Data to send with the event
	 */
	public send(action: ActionType, data: ActionData = {}): Promise<ActionData> {
		/* If the client is not connected, throw an error and return. */
		if (!this.connected) throw new CraftError("The client is not connected");

		/* Unique identifier for the action */
		const nonce: string = (++this.nonce).toString();

		/* Send the request to the server. */
		this.connection!.send(JSON.stringify({
			/* Required data */
			action, nonce,

			/* Event data */
			...data
		}))

		/* Wait until the server has acknowledged the event. */
		return this.wait(action, this.nonce);
	}

	/**
	 * Get the size of the structure.
	 * @returns Size of the structure, as a location
	 */
	public getSize(): Promise<Location> {
		return this.send(ActionType.GetSize).then(({ x, y, z }) => (
			new Location({ x: x as number, y: y as number, z: z as number })
		));
	}

	/**
	 * Get the state of the block at the specified location inside of the structure.
	 * @param location Location of the block to get the state of
	 * 
	 * @returns State of the block
	 */
	public getBlock({ x, y, z }: Location): Promise<Block> {
		return this.send(ActionType.GetBlock, { x, y, z }).then(data => (
			Block.from(data.block as string)
		));
	}

	/**
	 * Set the state of the block at the specified location inside of the structure.
	 * 
	 * @param location Location of the block to set the state of
	 * @param block State of the new block
	 */
	public setBlock({ x, y, z }: Location, block: Block | null): Promise<void> {
		return this.send(ActionType.SetBlock, { x, y, z, blockData: (block ?? Block.from("minecraft:air")).toString() }).then(() => {});
	}

	/**
	 * Watch a block for updates. This may not catch all possible block updates.
	 * @param location Location of the block to watch for updates
	 * 
	 * @fires blockUpdate
	 */
	public watch({ x, y, z }: Location): Promise<void> {
		return this.send(ActionType.Watch, { x, y, z }).then(() => {});
	}

	/**
	 * Stop watching a block for updates.
	 * @param location Location of the block to stop watching for updates
	 */
	public unwatch({ x, y, z }: Location): Promise<void> {
		return this.send(ActionType.Watch, { x, y, z }).then(() => {});
	}

	/**
	 * Poll a block for updates. This is way slower than Client#watch(), and not as reliable.
	 * @param location Location of the block to poll for updates
	 * 
	 * @fires blockUpdate
	 */
	public poll({ x, y, z }: Location): Promise<void> {
		return this.send(ActionType.Poll, { x, y, z }).then(() => {});
	}

	/**
	 * Stop polling a block for updates.
	 * @param location Location of the block to stop polling for updates
	 */
	public unpoll({ x, y, z }: Location): Promise<void> {
		return this.send(ActionType.Unpoll, { x, y, z }).then(() => {});
	}

	/**
	 * Send the player a message privately.
	 * 
	 * @param player Player to send the message to
	 * @param message Message to send to the player
	 */
	 public tell(player: Player, message: string): Promise<void> {
		return this.send(ActionType.Tell, { target: player.toString(), message }).then(() => {});
	}

	/**
	 * Respond to a transaction request.
	 * 
	 * @param transaction Transaction to respond to
	 * @param status Whether to accept or deny the transaction
	 */
	 public transact(transaction: Transaction, status: boolean): Promise<void> {
		return this.send(ActionType.TransactionRespond, { queryNonce: transaction.nonce, accept: status }).then(() => {});
	}

	/**
	 * Get a list of entities inside of the structure.
	 */
	 public getEntities(): Promise<Entity[]> {
		return this.send(ActionType.GetEntities).then(data => (
			(data.entities as EntityData[]).map(data => Entity.from(data))
		));
	}

	/**
	 * Disconnect from the ReplCraft server, if the client is connected.
	 */
	public disconnect(): void {
		/* If the client is connected, try to close the connection. */
		if(this.connected) {
			this.connection!.close();
		} else throw new CraftError("The client is not connected");
	}

	/**
	 * Connect to a ReplCraft server.
	 * @param options Options to use for the connection
	 */
	public connect({ token }: ConnectionOptions): Promise<void> {
		/* If the client is already connected, throw an error and return. */
		if (this.connected) throw new CraftError("The client is already connected");

		/* Set the client's token. */
		this.token = token;

		/* Reset the client's settings, just in case. */
		this.handlers = new Map<number, Handler>();
		this.connection = null;
		this.nonce = 0;

		/* Create a new WebSocket connection. */
		this.connection = new StandardWebSocketClient(`ws://${token.host}/gateway`);

		/* Once the client gets disconnected, reject all queued events. */
		this.connection!.once("close", () => {
			this.handlers.forEach(({ callback }) => {
				callback({
					success: false, data: { error: "Connection closed" }
				});
			});

			/* Invalidate the WebSocket connection. */
			this.connection = null;
			this.emit("close");
		});

		/* If an error occurs, close the server connection. */
		this.connection!.on("error", () => this.disconnect());

		/* Once the client receives a message, call the corresponding handler. */
		this.connection!.on<"message">("message", (message: MessageEvent<string>) => {
			try {
				/* Try to parse the event data. */
				const event: ResponseData = JSON.parse(message.data) as ResponseData;

				/* Actual event data */
				const data: ActionData = {};

				/* Get the actual event data. */
				Object.keys(event)
					.filter(key => key !== "ok" && key !== "nonce")
					.forEach(key => data[key] = event[key]);

				/* Handler corresponding to the event response */
				const handler: Handler | null = this.handlers.get(parseInt(event.nonce)) ?? null;

				/* If an event handler exists, execute the callback and remove the handler from the queue. */
				if (handler) {
					handler.callback({
						success: event.ok,
						data
					});

					/* Remove the handler from the queue. */
					this.handlers.delete(parseInt(event.nonce));
				}

				/* If the response was triggered by an event, call the corresponding event handler. */
				if (data.type !== undefined) {
					/* Triggered event */
					const event: EventType = data.type as EventType;

					/* A block has been updated */
					if (event === EventType.BlockUpdate) {
						/* Extract the information from the event. */
						const { old_block, block, cause, x, y, z } = data;

						this.emit("blockUpdate", {
							/* Old & new block */
							old: Block.from(old_block as string),
							block: Block.from(block as string),

							/* Update cause */
							cause: cause as BlockUpdateCause,

							/* Location of the block */
							location: new Location({ x: x as number, y: y as number, z: z as number })
						});

					/* A transaction has been initiated by a player */
					} else if (event === EventType.Transaction) {
						/* Extract the information from the event. */
						const { amount, query, player, player_uuid, queryNonce } = data;

						this.emit("transaction", new Transaction(this, {
							amount: amount as number,
							nonce: queryNonce as number,
							player: new Player({ name: player as string, uuid: player_uuid as string }),
							query: query as string
						}));
					}
				}

			} catch (_) {
				/* If the event failed to be parsed, throw an error. */
				this.emit("error", new CraftError("Failed to parse event data"));
			}
		});

		/* Wait until the connection to the server has been established. */
		return new Promise(resolve => {
			this.connection!.on("open", () => {
				this.send(ActionType.Authenticate, {
					token: this.token!.raw
				}).then(() => {
					this.emit("open");
					resolve();
				});
			});
		});
	}
}