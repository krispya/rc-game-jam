import { World } from 'koota';
import * as THREE from 'three';
import { Enemy, Movement, Player, Transform } from '../traits';

const acceleration = new THREE.Vector3();

export const flockToPlayer = (world: World) => {
	const player = world.queryFirst(Player, Transform);
	if (!player) return;

	const playerTransform = player.get(Transform)!;

	world.query(Enemy, Transform, Movement).updateEach(([transform, { velocity, thrust }]) => {
		// Calculate and apply acceleration towards player
		acceleration.copy(playerTransform.position).sub(transform.position).normalize().multiplyScalar(thrust);

		velocity.add(acceleration);
	});
};
