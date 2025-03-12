import { World } from 'koota';
import * as THREE from 'three';
import { IsEnemy, Movement, IsPlayer, Transform, FollowPlayer } from '../traits';

const acceleration = new THREE.Vector3();

export const flockEnemyToPlayer = (world: World) => {
	const player = world.queryFirst(IsPlayer, Transform);
	if (!player) return;

	const playerTransform = player.get(Transform)!;

	world.query(FollowPlayer, Transform, Movement).updateEach(([transform, { velocity, thrust }]) => {
		// Calculate and apply acceleration towards player
		acceleration.copy(playerTransform.position).sub(transform.position).normalize().multiplyScalar(thrust);

		velocity.add(acceleration);
	});
};
