import { useActions, useWorld } from 'koota/react';
import { useEffect } from 'react';
import { actions } from './actions';
import { AutoAim, Movement, SpatialHashMap } from './traits';

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
	const { spawnPlayer, spawnEnemy, spawnCamera, destroyAll } = useActions(actions);
	const world = useWorld();

	useEffect(() => {
		// Spawn camera
		spawnCamera(initialCameraPosition);

		// Spawn player
		const player = spawnPlayer();
		player.set(Movement, { thrust: 1 });
		player.set(AutoAim, { cooldown: autoAimSpeed });

		for (let i = 0; i < initialEnemies; i++) {
			spawnEnemy();
		}

		const enemySpawnInterval = setInterval(() => spawnEnemy(), spawnRate);

		return () => {
			// Destroy all entities including the player
			destroyAll();
			// Clear the spatial hash
			const spatialHashMap = world.get(SpatialHashMap);
			if (spatialHashMap) spatialHashMap.clear();
			clearInterval(enemySpawnInterval);
		};
	}, [spawnPlayer, spawnEnemy, spawnRate, initialEnemies, spawnCamera, initialCameraPosition, autoAimSpeed]);

	return null;
}
