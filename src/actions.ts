import { createActions } from 'koota';
import * as THREE from 'three';
import { Avoidant, Bullet, Enemy, Input, Movement, Player, Transform } from './traits';
import { between } from './utils/between';

export const actions = createActions((world) => ({
	spawnPlayer: () => world.spawn(Player, Transform, Input, Movement),
	spawnEnemy: () => {
		const position = new THREE.Vector3(between(-50, 50), between(-50, 50), 0);
		const rotation = new THREE.Euler(0, between(0, Math.PI * 2), 0);
		world.spawn(Enemy, Transform({ position, rotation }), Movement, Avoidant);
	},
	spawnBullet: (position: THREE.Vector3, rotation: THREE.Euler) => {
		// Create a forward vector and apply the rotation to get the bullet direction
		const direction = new THREE.Vector3(1, 0, 0);
		direction.applyEuler(rotation);

		return world.spawn(
			Transform({
				position: position.clone(),
				rotation: rotation.clone(),
			}),
			Bullet({ direction })
		);
	},
}));
