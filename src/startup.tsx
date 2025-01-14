import { useFrame } from '@react-three/fiber';
import { useActions, useWorld } from 'koota/react';
import { useEffect } from 'react';
import { actions } from './actions';
import { updateSpatialHashing } from './systems/update-spatial-hashing';
import { Movement } from './traits';

export function Startup() {
	const { spawnPlayer, spawnEnemy } = useActions(actions);

	useEffect(() => {
		const player = spawnPlayer();
		player.set(Movement, { thrust: 2 });

		// Spawn 20 enemies to start
		// for (let i = 0; i < 20; i++) {
		// 	spawnEnemy();
		// }

		const enemySpawnInterval = setInterval(() => spawnEnemy(), 3000);

		return () => {
			player.destroy();
			clearInterval(enemySpawnInterval);
		};
	}, [spawnPlayer, spawnEnemy]);

	const world = useWorld();

	useFrame(() => {
		updateSpatialHashing(world);
	});

	return null;
}
