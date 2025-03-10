import { useFrame } from '@react-three/fiber';
import { useActions, useWorld } from 'koota/react';
import { useEffect } from 'react';
import { actions } from './actions';
import { updateSpatialHashing } from './systems/update-spatial-hashing';
import { AutoAim, Movement } from './traits';

export function Startup({
	initialEnemies = 20,
	spawnRate = 3000,
	initialCameraPosition = [0, 0, 50],
	autoAimSpeed = 1000,
}: {
	initialEnemies?: number;
	spawnRate?: number;
	initialCameraPosition?: [number, number, number];
	autoAimSpeed?: number;
}) {
	const { spawnPlayer, spawnEnemy, spawnCamera } = useActions(actions);

	useEffect(() => {
		// Spawn camera
		spawnCamera(initialCameraPosition);

		// Spawn player
		const player = spawnPlayer();
		player.set(Movement, { thrust: 2 });
		player.set(AutoAim, { cooldown: autoAimSpeed });

		// Spawn 20 enemies to start
		for (let i = 0; i < initialEnemies; i++) {
			spawnEnemy();
		}

		const enemySpawnInterval = setInterval(() => spawnEnemy(), spawnRate);

		return () => {
			player.destroy();
			clearInterval(enemySpawnInterval);
		};
	}, [spawnPlayer, spawnEnemy, spawnRate, initialEnemies, spawnCamera, initialCameraPosition, autoAimSpeed]);

	const world = useWorld();

	useFrame(() => {
		updateSpatialHashing(world);
	});

	return null;
}
