import { Entity, trait } from 'koota';
import * as THREE from 'three';
import { SpatialHashMap as SpatialHashMapImpl } from './utils/spatial-hash';

// No data makes it a tag
export const Player = trait();
export const Enemy = trait();
export const Bullet = trait({
	speed: 60,
	direction: () => new THREE.Vector3(),
	lifetime: 2,
	timeAlive: 0,
});

// A transform just like CSS!
export const Transform = trait({
	position: () => new THREE.Vector3(),
	rotation: () => new THREE.Euler(),
	scale: () => new THREE.Vector3(1, 1, 1),
});

export const Input = trait(() => new THREE.Vector2());

export const Movement = trait({
	velocity: () => new THREE.Vector3(),
	thrust: 1,
	damping: 0.95,
	force: () => new THREE.Vector3(),
});

export const Avoidant = trait({
	neighbors: [] as Entity[],
	range: 1.5,
});

export const Explosion = trait({
	duration: 500,
	current: 0,
	count: 12,
	velocities: () => [] as THREE.Vector3[],
});

// World traits
export const Time = trait({ delta: 0, current: 0 });
export const SpatialHashMap = trait(() => new SpatialHashMapImpl(50));
