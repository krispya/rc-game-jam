import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { BulletRenderer } from './components/bullet-renderer';
import { CameraRenderer } from './components/camera-renderer';
import { EnemyRenderer } from './components/enemy-renderer';
import { GameOverText } from './components/game-over';
import { HealthTracker } from './components/health-tracker.tsx';
import { PlayerRenderer } from './components/player-renderer';
import { PostProcessing } from './components/postprcoessing';
import { FrameLoop } from './frameloop';
import { Startup } from './startup';
import { ExplosionRenderer } from './components/explosion-renderer.tsx';

export function App() {
	return (
		<>
			{/* <ScoreTracker /> */}
			<HealthTracker />
			<GameOverText />

			<Canvas>
				<Startup autoAimSpeed={100} initialEnemies={50} spawnRate={500} initialCameraPosition={[0, 0, 56]} />
				<FrameLoop />

				<CameraRenderer />
				<PlayerRenderer />
				<EnemyRenderer />
				<BulletRenderer />
				<ExplosionRenderer />

				<ambientLight intensity={1.02} />
				<directionalLight position={[10.41789, -5.97702, 10]} intensity={2.98} color={'#c31829'} />
				<directionalLight position={[10.55754, 5.89323, 9.99894]} intensity={4.88} color={'#ffffff'} />

				<Stars factor={10} radius={200} fade={false} />
				<PostProcessing />
			</Canvas>
		</>
	);
}
