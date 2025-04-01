import { useFrame } from '@react-three/fiber';
import { useWorld } from 'koota/react';
import { applyForce } from './systems/apply-force';
import { convertInputToMovement } from './systems/apply-input';
import { cameraFollowPlayer } from './systems/camera-follow-player';
import { flockEnemyToPlayer } from './systems/flock-enemy-to-player';
import { handleShooting } from './systems/handle-shooting';
import { limitSpeed } from './systems/limit-speed';
import { moveEntities } from './systems/move-entities';
import { pollInput } from './systems/poll-input';
import { pushEnemies } from './systems/push-enemies';
import { syncView } from './systems/sync-view';
import { tickExplosion } from './systems/tick-explosion';
import { updateAutoAim } from './systems/update-auto-aim';
import { updateAutoShoot } from './systems/update-auto-shoot';
import { avoidEachother } from './systems/update-avoidance';
import { updateBullets } from './systems/update-bullet';
import { collideBulletsWithEnemies } from './systems/update-bullet-collisions';
import { updateTime } from './systems/update-time';
import { updateSpatialHashing } from './systems/update-spatial-hashing';
import { takeOutTheDead } from './systems/take-out-the-dead';

export function FrameLoop() {
	const world = useWorld();

	useFrame(() => {
		// Start
		updateTime(world);

		// Input
		pollInput(world);
		convertInputToMovement(world);

		// Enemy AI
		flockEnemyToPlayer(world);
		avoidEachother(world);

		// Movement
		pushEnemies(world);
		applyForce(world);
		moveEntities(world);
		limitSpeed(world);

		// Shooting
		updateAutoAim(world);
		updateAutoShoot(world);
		handleShooting(world);
		updateBullets(world);
		collideBulletsWithEnemies(world);

		// Death
		takeOutTheDead(world);
		tickExplosion(world);

		// Syncing
		cameraFollowPlayer(world);
		syncView(world);
		updateSpatialHashing(world);
	});

	return null;
}
