import CoreTerrainEntity from "../../core/entities/TerrainEntity";

import Physics from "../../../apps/gaia/components/Physics";
import Animus from "../../../apps/gaia/components/Animus";

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