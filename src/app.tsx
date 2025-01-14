import { Canvas, useFrame } from '@react-three/fiber';
import { useWorld } from 'koota/react';
import { BulletRenderer } from './components/bullet-renderer';
import { EnemyRenderer } from './components/enemy-renderer';
import { ExplosionRenderer } from './components/explosion-renderer';
import { Nebula } from './components/nebula';
import { PlayerRenderer } from './components/player-renderer';
import { PostProcessing } from './components/postprcoessing';
import { HifiScoreTracker } from './components/score-tracker';
import { Startup } from './startup';
import { applyForce } from './systems/apply-force';
import { convertInputToMovement } from './systems/apply-input';
import { flockToPlayer } from './systems/follow-player';
import { handleShooting } from './systems/handle-shooting';
import { moveEntities } from './systems/move-entities';
import { pollInput } from './systems/poll-input';
import { pushEnemies } from './systems/push-enemies';
import { tickExplosion } from './systems/tick-explosion';
import { avoidEachother } from './systems/update-avoidance';
import { updateBullets } from './systems/update-bullet';
import { collideBulletsWithEnemies } from './systems/update-bullet-collisions';
import { updateTime } from './systems/update-time';

export function App() {
	return (
		<Canvas camera={{ fov: 50, position: [0, 0, 50] }}>
			<Startup />
			<FrameLoop />

			<PlayerRenderer />
			<EnemyRenderer />
			<BulletRenderer />
			<ExplosionRenderer />

			<ambientLight intensity={1.02} />
			<directionalLight position={[10.41789, -5.97702, 10]} intensity={2.98} color={'#c31829'} />
			<directionalLight position={[10.55754, 5.89323, 9.99894]} intensity={4.88} color={'#ffffff'} />

			<PostProcessing />
			<Nebula speed={0.02} />

			<HifiScoreTracker />
		</Canvas>
	);
}

function FrameLoop() {
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
	});

	return null;
}
