import { World } from 'koota';
import { IsDead, IsEnemy } from '../traits';

export function takeOutTheDead(world: World) {
	world.query(IsDead, IsEnemy).forEach((entity) => {
		entity.destroy();
	});
}
