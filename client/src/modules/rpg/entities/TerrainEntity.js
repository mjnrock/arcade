import CoreTerrainEntity from "../../core/entities/TerrainEntity.js";
import Animus from "../../../apps/gaia/components/Animus.js";

export class TerrainEntity extends CoreTerrainEntity {
	constructor ({ animus, ...props } = {}) {
		super({
			...props,
			animus: [ Animus, (animus ?? {}) ],
		});
	}
};

export default TerrainEntity;