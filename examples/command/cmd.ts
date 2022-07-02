import { Transaction } from "../../mod.ts";

export interface StructureCommand {
    /** Name of the command */
    readonly name: string;

    /** Callback of the command */
    readonly callback: (transaction: Transaction, args: string[]) => Promise<void>;
}