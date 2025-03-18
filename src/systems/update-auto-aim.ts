import { World } from 'koota';
import { AutoAim, ShootAt, SpatialHashMap, Time, Transform } from '../traits';
import { sortEntitiesByDistance } from '../utils/sort-entities-by-distance';

export function updateAutoAim(world: World) {
	const { delta } = world.get(Time)!;
	const spatialHashMap = world.get(SpatialHashMap)!;

	world.query(AutoAim, Transform).updateEach(([autoAim], entity) => {
		autoAim.current += delta * 1000;

		if (autoAim.current >= autoAim.cooldown) {
			autoAim.current = 0;

			const { position } = entity.get(Transform)!;

			const nearbyEntities = spatialHashMap
				.query(position.x, position.y, position.z, autoAim.radius)
				.filter((e) => e.id() !== entity.id());

			// Exit early if there are no nearby entities
			if (nearbyEntities.length === 0) return;

			// Sort entities by distance
			const sortedEntities = sortEntitiesByDistance(position, nearbyEntities);

			// Get the nearest entity
			const nearestEntity = sortedEntities[0];

			// Shoot at it!
			entity.add(ShootAt(nearestEntity));
		}
	});
}
