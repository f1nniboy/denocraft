import { Location } from "../../world/location.ts";
import { Slot, SlotOptions } from "./slot.ts";
import { Item, ItemData } from "../item.ts";
import { Client } from "../../client.ts";

type ItemSlotOptions = SlotOptions & {
	/* Item corresponding to this slot */
	item: Item;
}

export type ItemSlotData = ItemData & SlotOptions & {
	/* Item corresponding to this slot */
	item: Item;
}

export class ItemSlot extends Slot implements ItemSlotOptions {
	/* Item corresponding to this slot */
	public readonly item: Item;

	constructor(options: ItemSlotOptions) {
		super(options);
		this.item = options.item;
	}

	/**
	 * Create a new item instance from a ReplCraft format. 
	 * @returns A new item instance
	 */
	public static from(client: Client, location: Location, data: ItemSlotData): ItemSlot {
		return new ItemSlot({
			client, location,
			item: Item.from(data),
			index: data.index
		});
	}
}