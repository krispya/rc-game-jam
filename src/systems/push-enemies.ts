import { Entity, World } from 'koota';
import * as THREE from 'three';
import { IsEnemy, Movement, IsPlayer, SpatialHashMap, Transform, Health } from '../traits';

const collisionRadius = 2.1;
// const pushStrength = 0.08;
const pushForce = new THREE.Vector3();

export function pushEnemies(world: World) {
	const spatialHashMap = world.get(SpatialHashMap)!;

	world.query(IsPlayer, Transform, Health, Movement).updateEach(([{ position }, health]) => {
		// Get nearby entities
		const nearbyEntities = spatialHashMap.query(position.x, position.y, position.z, collisionRadius);

		// Filter for enemies within collision range
		const collidingEnemies: Entity[] = nearbyEntities.filter((entity) => {
			return entity.has(IsEnemy) && entity.get(Transform)!.position.distanceTo(position) <= collisionRadius;
		});

		// Apply push force to colliding enemies
		for (const enemy of collidingEnemies) {
			const enemyTransform = enemy.get(Transform)!;
			const enemyMovement = enemy.get(Movement)!;

			// Calculate push direction (away from player)
			pushForce.copy(enemyTransform.position).sub(position).normalize().multiplyScalar(20);

			// Apply push force to enemy
			health.amount -= 1;
			// console.log(Health.amount)
			// enemyMovement.velocity.set(pushForce.x, pushForce.y, pushForce.z);
			enemyMovement.force.add(pushForce);
		}
	});
}
