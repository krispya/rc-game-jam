import { World } from 'koota';
import { ShootAt, Transform } from '../traits';
import { actions } from '../actions';
import * as THREE from 'three';

const tempMatrix = new THREE.Matrix4();
const rotation = new THREE.Euler(0, 0, 0);
const UP = new THREE.Vector3(0, 0, 1);
const ZERO = new THREE.Vector3(0, 0, 0);

export function updateAutoShoot(world: World) {
	const { spawnBullet } = actions(world);

	world.query(ShootAt('*')).updateEach((_, entity) => {
		const targets = entity.targetsFor(ShootAt);

		// Get the direction from the shooting entity to the target
		const shootingPosition = entity.get(Transform)!.position;

		for (const target of targets) {
			const targetPosition = target.get(Transform)!.position;

			const direction = targetPosition.clone().sub(shootingPosition).normalize();

			// Create rotation using Three.js lookAt
			tempMatrix.lookAt(ZERO, direction, UP);
			rotation.setFromRotationMatrix(tempMatrix);
			rotation.y -= Math.PI / 2;

			spawnBullet(shootingPosition, rotation, direction);

			entity.remove(ShootAt(target));
		}
	});
}
