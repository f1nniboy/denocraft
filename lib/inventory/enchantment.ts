import { Identifier } from "../block/identifier.ts";

export interface ItemEnchantmentData {
    /** Level of the enchantment */
    lvl: number;

    /** Identifier of the enchantment */
    id: string;
}

export interface ItemEnchantment {
    /** Level of the enchantment */
    level: number;

    /** Identifier of the enchantment */
    identifier: Identifier;
}