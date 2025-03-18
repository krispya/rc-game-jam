import { trait } from 'koota';
import * as THREE from 'three';

export const Bullet = trait({
	speed: 40,
	direction: () => new THREE.Vector3(),
	lifetime: 2,
	timeAlive: 0,
});
