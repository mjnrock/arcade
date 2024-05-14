import RPGGame from "../../modules/rpg/Game";
import { Circle } from "../../modules/core/lib/geometry/Circle";

import { PlayerEntity } from "./entities/PlayerEntity";
import InputSystem from "./systems/InputSystem";
import PhysicsSystem from "./systems/PhysicsSystem";

import EnumResourceType from "../../modules/rpg/components/EnumResourceType";
import Resource from "../../modules/rpg/components/Resource";


export class Game extends RPGGame {
	constructor ({ config = {}, ...args } = {}) {
		super({
			...args,
		});

		this.mountSystems(
			InputSystem,
			PhysicsSystem,
		);

		this.mergeConfig({
			/* If enabled, locks facing to the joystick direction */
			arcadeMode: false,
			ui: {
				[ EnumResourceType.Health ]: {
					showBar: true,
					thresholds: [
						[ 0.8, "#306630" ],
						[ 0.65, "#339933" ],
						[ 0.35, "#FFCC33" ],
						[ 0.15, "#FF9933" ],
						[ 0, "#FF5555" ],
					],
					ox: 0,
					oy: -5,
					width: 24,
					height: 4,
				},
				[ EnumResourceType.Mana ]: {
					showBar: true,
					thresholds: [
						[ 0.75, "#333366" ],
						[ 0.5, "#555588" ],
						[ 0.25, "#9999CC" ],
						[ 0, "#CCCCFF" ],
					],
					ox: 0,
					oy: -2,
					width: 20,
					height: 3,
				},
			},
			world: {
				tileWidth: 32,
				tileHeight: 32,
				zoom: 4,
				viewport: {
					tx: 0,
					ty: 0,
					txr: 25,
					tyr: 25,
				},
			},
		}, config);



		//FIXME: This paradigm is currently insane, but it demonstrates each requirement
		// const abilities = new Abilities({
		// 	abilities: [
		// 		{
		// 			name: EnumAbility.DeathRay,
		// 			model: new Rectangle({ width: 4, height: 4 }),
		// 			actions: [
		// 				new ActionDamage({ amount: 0.1 }),
		// 			],
		// 		},
		// 	],
		// });
		// this.addComponent(abilities);

		this.player = {
			entity: PlayerEntity.Spawn({
				components: [
					new Resource({
						type: EnumResourceType.Health,
						current: 100,
						max: 100,
						step: 0.1,
						regenRate: 0.1,
					}),
					new Resource({
						type: EnumResourceType.Mana,
						current: 250,
						max: 250,
						step: 0.1,
						regenRate: 0.5,
					}),
				],
				physics: {
					speed: 4,
					model: new Circle({
						x: 0,
						y: 8,
						radius: 0.16,
					}),
				},
				animus: {
					color: "#3AF",
				},
			}),
			input: {
				mask: {},
			},
			...(args.player ?? {}),
		};
	}
};

export default Game;