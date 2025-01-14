import { Canvas } from '@react-three/fiber';
import { BulletRenderer } from './components/bullet-renderer';
import { EnemyRenderer } from './components/enemy-renderer';
import { ExplosionRenderer } from './components/explosion-renderer';
import { Nebula } from './components/nebula';
import { PlayerRenderer } from './components/player-renderer';
import { HifiScoreTracker } from './components/score-tracker';
import { FrameLoop } from './frameloop';
import { Startup } from './startup';

export function App() {
	return (
		<Canvas camera={{ fov: 50, position: [0, 0, 50] }}>
			<Startup initialEnemies={20} spawnRate={3000} />
			<FrameLoop />

			<PlayerRenderer />
			<EnemyRenderer />
			<BulletRenderer />
			<ExplosionRenderer />

			<ambientLight intensity={1.02} />
			<directionalLight position={[10.41789, -5.97702, 10]} intensity={2.98} color={'#c31829'} />
			<directionalLight position={[10.55754, 5.89323, 9.99894]} intensity={4.88} color={'#ffffff'} />

			{/* <PostProcessing /> */}
			<Nebula speed={0.02} />

			<HifiScoreTracker />
		</Canvas>
	);
}
