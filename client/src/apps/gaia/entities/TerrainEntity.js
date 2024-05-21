import CoreTerrainEntity from "../../../modules/core/entities/TerrainEntity";

import Physics from "../components/Physics";
import Animus from "../components/Animus";

export class TerrainEntity extends CoreTerrainEntity {
	constructor ({ animus, physics, ...props } = {}) {
		super({
			...props,
			physics: [ Physics, (physics ?? {}) ],
			animus: [ Animus, (animus ?? {}) ],
		});
	}
};

export default TerrainEntity;