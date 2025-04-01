import { createRemoved, Or, World } from 'koota';
import { IsEnemy, IsPlayer, SpatialHashMap, Transform } from '../traits';

const Removed = createRemoved();

export const updateSpatialHashing = (world: World) => {
	const spatialHashMap = world.get(SpatialHashMap);

	// Add players or enemies to the spatial hash map
	world.query(Transform, Or(IsEnemy, IsPlayer)).updateEach(([{ position }], entity) => {
		spatialHashMap!.set(entity, position.x, position.y, position.z);
	});

	// Remove players or enemies from the spatial hash map
	world.query(Removed(Transform, IsEnemy)).forEach((entity) => {
		spatialHashMap!.remove(entity);
	});

	world.query(Removed(Transform, IsPlayer)).forEach((entity) => {
		spatialHashMap!.remove(entity);
	});
};
