import { ItemEnchantmentData, ItemEnchantment } from "./enchantment.ts";
import { Identifier } from "../block/identifier.ts";

/** Information about an item's maximum durability & durability */
export interface ItemDurability {
	/** Maximum possible durability */
	max: number;

	/** Current item durabillity */
	current: number;
}

export interface ItemData {
	/** Identifier of the item */
	type: string;

	/** Durability of the item */
	maxDurability: number;
	durability: number;

	/** How many of this item are in the stack */
	amount: number;

	/** Enchantments of the item */
	enchantments: ItemEnchantmentData[];

	/** Meta-data of the item */
	meta: { [key: string]: unknown };
}

interface ItemOptions {
	/** Identifier of the item */
	identifier: Identifier;

	/** Durability of the item */
	durability: ItemDurability;

	/** How many of this item are in the stack */
	amount: number;

	/** Enchantments of the item */
	enchantments: ItemEnchantment[];

	/** Meta-data of the item */
	meta: Map<string, unknown>;
}

export class Item implements ItemOptions {
	/** Identifier of the item */
	public readonly identifier: Identifier;

	/** Durability of the item */
	public readonly durability: ItemDurability;

	/** How many of this item are in the stack */
	public readonly amount: number;

	/** Enchantments of the item */
	public readonly enchantments: ItemEnchantment[];

	/* Meta-data of the item */
	public readonly meta: Map<string, unknown>;

	constructor({ identifier, durability, amount, enchantments, meta }: ItemOptions) {
		this.enchantments = enchantments;
		this.identifier = identifier;
		this.durability = durability;
		this.amount = amount;
		this.meta = meta;
	}

	/**
	 * Create a new item instance from a ReplCraft format. 
	 * @returns A new item instance
	 */
	public static from({ type, maxDurability, durability, amount, enchantments, meta }: ItemData): Item {
		/* Meta-data of the item */
		const data: Map<string, unknown> = new Map();

		/* Apply the meta-data to the new item instance. */
		Object.keys(meta)
			.filter(key => key !== "meta-type")
			.forEach(key => data.set(key, meta[key]));

		return new Item({
			identifier: Identifier.from(type),

			durability: {
				max: maxDurability,
				current: durability
			},

			enchantments: enchantments.map(data => ({
				level: data.lvl,
				identifier: Identifier.from(data.id)
			})),

			meta: data,
			amount
		});
	}
}