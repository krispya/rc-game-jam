import { useFrame } from '@react-three/fiber';
import { useWorld } from 'koota/react';
import { applyForce } from './systems/apply-force';
import { convertInputToMovement } from './systems/apply-input';
import { flockToPlayer } from './systems/follow-player';
import { handleShooting } from './systems/handle-shooting';
import { moveEntities } from './systems/move-entities';
import { pollInput } from './systems/poll-input';
import { pushEnemies } from './systems/push-enemies';
import { syncView } from './systems/sync-view';
import { tickExplosion } from './systems/tick-explosion';
import { avoidEachother } from './systems/update-avoidance';
import { updateBullets } from './systems/update-bullet';
import { collideBulletsWithEnemies } from './systems/update-bullet-collisions';
import { updateTime } from './systems/update-time';

export function FrameLoop() {
	const world = useWorld();

	useFrame(() => {
		updateTime(world);

		// Input
		pollInput(world);
		convertInputToMovement(world);

		// Enemy AI
		flockToPlayer(world);
		avoidEachother(world);

		// Movement
		pushEnemies(world);
		applyForce(world);
		moveEntities(world);

		// Shooting
		handleShooting(world);
		updateBullets(world);
		collideBulletsWithEnemies(world);

		// Explosions
		tickExplosion(world);

		// View
		syncView(world);
	});

	return null;
}
