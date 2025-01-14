import { useFrame } from '@react-three/fiber';
import { useActions, useWorld } from 'koota/react';
import { useEffect } from 'react';
import { actions } from './actions';
import { updateSpatialHashing } from './systems/update-spatial-hashing';
import { Movement } from './traits';

export function Startup({
	initialEnemies = 20,
	spawnRate = 3000,
}: {
	initialEnemies?: number;
	spawnRate?: number;
}) {
	const { spawnPlayer, spawnEnemy } = useActions(actions);

	useEffect(() => {
		const player = spawnPlayer();
		player.set(Movement, { thrust: 2 });

		// Spawn 20 enemies to start
		for (let i = 0; i < initialEnemies; i++) {
			spawnEnemy();
		}

		const enemySpawnInterval = setInterval(() => spawnEnemy(), spawnRate);

		return () => {
			player.destroy();
			clearInterval(enemySpawnInterval);
		};
	}, [spawnPlayer, spawnEnemy, spawnRate, initialEnemies]);

	const world = useWorld();

	useFrame(() => {
		updateSpatialHashing(world);
	});

	return null;
}
