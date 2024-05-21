import AtlasWorld from "../../../modules/core/worlds/AtlasWorld";

import { TerrainEntity } from "../entities/TerrainEntity";

export class World extends AtlasWorld {
	constructor ({ atlas, entities = [], ...args } = {}) {
		super({
			...args,
		});

		this.loadFromAtlas(atlas, TerrainEntity);
		this.addEntity(...entities);
	}
};

export default World;