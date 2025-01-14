import { World } from 'koota';
import { Bullet, Enemy, Explosion, SpatialHashMap, Transform } from '../traits';
import { between } from '../utils/between';

export const collideBulletsWithEnemies = (world: World) => {
	const spatialHashMap = world.get(SpatialHashMap)!;

	world
		.query(Bullet, Transform)
		.select(Transform)
		.updateEach(([{ position }], entity) => {
			const nearbyEntities = spatialHashMap.getNearbyEntities(position.x, position.y, position.z, 2);

			const hitEnemy = nearbyEntities.find(
				(entity) => entity.has(Enemy) && entity.get(Transform)!.position.distanceTo(position) < 1
			);

			if (hitEnemy !== undefined) {
				// Spawn explosion in enemy's position.
				world.spawn(
					Explosion({ count: Math.floor(between(12, 20)) }),
					Transform({
						position: hitEnemy.get(Transform)!.position.clone(),
					})
				);

				// Destroy bullet and enemy.
				hitEnemy.destroy();
				entity.destroy();
			}
		});
};
