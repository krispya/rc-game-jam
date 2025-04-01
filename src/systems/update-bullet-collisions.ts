import { World } from 'koota';
import { Bullet, IsDead, IsEnemy, SpatialHashMap, Transform } from '../traits';

export const collideBulletsWithEnemies = (world: World) => {
	const spatialHashMap = world.get(SpatialHashMap)!;

	world
		.query(Bullet, Transform)
		.select(Transform)
		.updateEach(([{ position }]) => {
			const nearbyEntities = spatialHashMap.query(position.x, position.y, position.z, 2);

			const hitEnemy = nearbyEntities.find(
				(entity) => entity.has(IsEnemy) && entity.get(Transform)!.position.distanceTo(position) < 1
			);

			if (hitEnemy) hitEnemy.add(IsDead);
		});
};
