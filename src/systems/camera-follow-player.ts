import { World } from 'koota';
import { IsCamera, IsPlayer, Transform } from '../traits';

export const cameraFollowPlayer = (world: World) => {
	const player = world.queryFirst(IsPlayer, Transform);
	if (!player) return;

	const playerTransform = player.get(Transform)!;

	world.query(IsCamera, Transform).updateEach(([transform]) => {
		transform.position.x = playerTransform.position.x;
		transform.position.y = playerTransform.position.y;
	});
};
