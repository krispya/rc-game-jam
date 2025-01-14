import { World } from 'koota';
import { Transform, View } from '../traits';

export function syncView(world: World) {
	world.query(Transform, View).updateEach(([transform, view]) => {
		view.position.copy(transform.position);
		view.rotation.copy(transform.rotation);
		view.scale.copy(transform.scale);
	});
}
