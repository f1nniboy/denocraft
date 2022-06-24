import { Location } from "../../world/location.ts";
import { ActionData } from "../../action.ts";

export interface SlotReferenceOptions {
	/* Where the container with this item is located */
	location: Location;

	/* Which slot the item is in */
	index: number;
}

export class SlotReference implements SlotReferenceOptions {
	/* Where the container with this item is located */
	public location: Location;

	/* Which slot the item is in */
	public index: number;

	constructor({ location, index }: SlotReferenceOptions) {
		this.location = location;
		this.index = index;
	}

	/**
	 * Convert the instance into a ReplCraft-usable format.
	 * @returns ReplCraft-usable item object
	 */
	public toObject(): ActionData {
		return {
			index: this.index,
			...this.location.toObject()
		};
	}
}