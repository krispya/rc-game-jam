import { Canvas } from '@react-three/fiber';
import { BulletRenderer } from './components/bullet-renderer';
import { CameraRenderer } from './components/camera-renderer';
import { EnemyRenderer } from './components/enemy-renderer';
import { ExplosionRenderer } from './components/explosion-renderer';
import { GameOverText } from './components/game-over';
import { PlayerRenderer } from './components/player-renderer';
import { ScoreTracker } from './components/score-tracker';
import { FrameLoop } from './frameloop';
import { Startup } from './startup';
import { Stars } from '@react-three/drei';
import { PostProcessing } from './components/postprcoessing';
import { HealthTracker } from './components/health-tracker.tsx';

export function App() {
	return (
		<>
			<ScoreTracker />
			<HealthTracker />
			<GameOverText />

			<Canvas>
				<Startup
					autoAimSpeed={100}
					initialEnemies={100}
					spawnRate={1000}
					initialCameraPosition={[0, 0, 56]}
				/>
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
