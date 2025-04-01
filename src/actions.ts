import { createActions, World } from 'koota';
import * as THREE from 'three';
import {
	Avoidant,
	Bullet,
	IsEnemy,
	Input,
	Movement,
	IsPlayer,
	Transform,
	Health,
	MaxSpeed,
	IsCamera,
} from './traits';
import { between } from './utils/between';
import { FollowPlayer } from './traits/followPlayer';
import { AutoAim } from './traits/auto-aim';

export const actions = createActions((world) => ({
	spawnPlayer: () => world.spawn(IsPlayer, Transform, Input, Movement, AutoAim, Health({ amount: 100 })),
	spawnEnemy: () => {
		const r = between(0, 2);
		if (r < 1) {
			// console.log("slow")
			spawnSlowEnemy(world);
		} else {
			spawnFastEnemy(world);
			// console.log("fast")
		}
	},
	spawnBullet: (position: THREE.Vector3, rotation: THREE.Euler, direction?: THREE.Vector3) => {
		if (!direction) {
			// Create a forward vector and apply the rotation to get the bullet direction
			direction = new THREE.Vector3(1, 0, 0);
			direction.applyEuler(rotation);
		}

		return world.spawn(
			Transform({
				position: position.clone(),
				rotation: rotation.clone(),
			}),
			Bullet({ direction })
		);
	},
	spawnCamera: (position: [number, number, number]) => {
		return world.spawn(Transform({ position: new THREE.Vector3(...position) }), IsCamera);
	},
	destroyAll: () => {
		world.query().forEach((entity) => {
			entity.destroy();
		});
	},
}));

const spawnSlowEnemy = (world: World) => {
	// Create a random position and rotation
	const position = new THREE.Vector3(between(-50, 50), between(-50, 50), 0);
	const rotation = new THREE.Euler(0, between(0, Math.PI * 2), 0);

	// Spawn the enemy
	world.spawn(
		IsEnemy,
		Transform({ position, rotation }),
		Movement({ thrust: 0.5, damping: 1 }),
		Avoidant,
		FollowPlayer,
		MaxSpeed({ maxSpeed: 3 })
	);
};

const spawnFastEnemy = (world: World) => {
	// Create a random position and rotation
	const position = new THREE.Vector3(between(-50, 50), between(-50, 50), 0);
	const rotation = new THREE.Euler(0, between(0, Math.PI * 2), 0);

	// Spawn the enemy
	world.spawn(
		IsEnemy,
		Transform({ position, rotation }),
		Movement({ thrust: 0.15, damping: 1 }),
		Avoidant,
		FollowPlayer,
		MaxSpeed({ maxSpeed: 10 })
	);
};
