import { Location } from "./location.ts";
import { Player } from "./player.ts";

/** Internal reprepresentation of an entity in ReplCraft */
export interface EntityData {
	/** Type of the entity */
	type: string;

	/** Name of the entity */
	name: string;

	/** UUID of the player this entity relates to */
	player_uuid?: string;

	/** Current health of the entity */
	health: number;

	/** Maximum health of the entity */
	max_health: number;

	/** Location of the entity */
	x: number;
	y: number;
	z: number;
}

interface EntityOptions {
	/** Type of the entity */
	type: string;

	/** Name of the entity */
	name: string;

	/** Player this entity relates to, if the entity is a player */
	player: Player | null;

	/** Current health of the entity */
	health: number;

	/** Maximum health of the entity */
	maxHealth: number;

	/** Location of the entity */
	location: Location;
}

export class Entity implements EntityOptions {
	/** Type of the entity */
	public readonly type: string;

	/** Name of the entity */
	public readonly name: string;

	/** Player this entity relates to, if the entity is a player */
	public readonly player: Player | null;

	/** Current health of the entity */
	public readonly health: number;

	/** Maximum health of the entity */
	public readonly maxHealth: number;

	/** Location of the entity */
	public readonly location: Location;

	constructor({ type, name, player, health, maxHealth, location }: EntityOptions) {
		this.type = type;
		this.name = name;
		this.player = player;
		this.health = health;
		this.maxHealth = maxHealth;
		this.location = location;
	}

	/**
	 * Create a new entity instance from a ReplCraft-usable entity format.
	 * @param data Data of the entity
	 * 
	 * @returns New entity instance
	 */
	public static from({ type, name, player_uuid, health, max_health, x, y, z }: EntityData): Entity {
		return new Entity({
			type,
			name,
			player: player_uuid !== null ? new Player({ name, uuid: player_uuid }) : null,
			maxHealth: max_health,
			health,
			location: Location.from(x, y, z)
		});
	}
}