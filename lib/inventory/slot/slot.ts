import { SlotReference, SlotReferenceOptions } from "./reference.ts";
import { Location } from "../../world/location.ts";
import { Client } from "../../client.ts";

export interface MoveItemOptions {
	/** Source container, where the item is located */
	source: Location;

	/** Index of the item inside the source container to move */
	index: number;

	/** How many items to move, by default all */
	amount?: number;

	/** Target container, where the item should be moved to */
	target: Location;

	/** Which index to move the item to in the target container */
	targetIndex?: number;
}

export type SlotOptions = SlotReferenceOptions & {
	/** Client in charge of the item slot */
	client: Client;
}

interface SlotData {
	/** Index of the item */
	index: number;
}

export class Slot extends SlotReference {
	/** ReplCraft client in charge of this item slot */
	public readonly client: Client;

	constructor(options: SlotOptions) {
		super(options);
		this.client = options.client;
	}

	/**
	 * Move the item to another container.
	 * 
	 * @param location Location of the targer container
	 * @param amount How many items to move
	 * @param index Which container index to move the items to
	 */
	public move(location: Location, amount?: number, index?: number): Promise<void> {
		return this.client.moveItem({
			source: this.location,
			target: location,
			index: this.index,
			targetIndex: index,
			amount
		});
	}

	public static from(client: Client, location: Location, { index }: SlotData): Slot {
		return new Slot({
			client, location, index
		});
	}
}