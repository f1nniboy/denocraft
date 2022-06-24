import { Identifier } from "../block/identifier.ts";

/** Information about an item's maximum durability & durability */
export interface ItemDurability {
	/* Maximum possible durability */
	max: number;

	/* Current item durabillity */
	current: number;
}

export interface ItemData {
	/* Identifier of the item */
	type: string;

	/* Durability of the item */
	maxDurability: number;
	durability: number;

	/* How many of this item are in the stack */
	amount: number;
}

interface ItemOptions {
	/* Identifier of the item */
	identifier: Identifier;

	/* Durability of the item */
	durability: ItemDurability;

	/* How many of this item are in the stack */
	amount: number;
}

export class Item implements ItemOptions {
	/* Identifier of the item */
	public readonly identifier: Identifier;

	/* Durability of the item */
	public readonly durability: ItemDurability;

	/* How many of this item are in the stack */
	public readonly amount: number;

	constructor({ identifier, durability, amount }: ItemOptions) {
		this.identifier = identifier;
		this.durability = durability;
		this.amount = amount;
	}

	/**
	 * Create a new item instance from a ReplCraft format. 
	 * @returns A new item instance
	 */
	public static from({ type, maxDurability, durability, amount }: ItemData): Item {
		return new Item({
			identifier: Identifier.from(type),
			durability: {
				max: maxDurability,
				current: durability
			},
			amount
		});
	}
}