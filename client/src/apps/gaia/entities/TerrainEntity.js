import CoreTileEntity from "../../../modules/core/entities/TileEntity";

import Physics from "../components/Physics";
import Animus from "../components/Animus";

export class TerrainEntity extends CoreTileEntity {
	constructor ({ animus, physics, ...props } = {}) {
		super({
			...props,
			physics: [ Physics, (physics ?? {}) ],
			animus: [ Animus, (animus ?? {}) ],
		});
	}
};

export default TerrainEntity;