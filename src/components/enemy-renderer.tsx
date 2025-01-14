import { useFrame } from '@react-three/fiber';
import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { IsEnemy, Transform, Ref } from '../traits';

export function EnemyView({ entity }: { entity: Entity }) {
	// A ref callback is used so that it runs before effects
	const setInitial = useCallback(
		(mesh: THREE.Mesh | null) => {
			// If the ref is null then it is being unmounted
			if (!mesh) return;
			entity.add(Ref(mesh));
		},
		[entity]
	);

	return (
		<mesh ref={setInitial}>
			<dodecahedronGeometry />
			<meshBasicMaterial color="white" wireframe />
		</mesh>
	);
}

function HifiEnemyView({ entity }: { entity: Entity }) {
	const scaleRef = useRef(0);

	// A ref callback is used so that it runs before effects
	const setInitial = useCallback(
		(mesh: THREE.Mesh | null) => {
			// If the ref is null then it is being unmounted
			if (!mesh) return;
			entity.add(Ref(mesh));
			// Set initial scale to 0
			entity.set(Transform, { scale: new THREE.Vector3(0, 0, 0) });
		},
		[entity]
	);

	// Scale into existence
	useFrame((_, delta) => {
		const progress = Math.min(scaleRef.current + delta * 2, 1);
		// Apply easing - this uses cubic easing out
		const eased = 1 - Math.pow(1 - progress, 3);
		scaleRef.current = progress;
		// Update the transform trait
		entity.set(Transform, (prev) => {
			return { ...prev, scale: prev.scale.setScalar(eased) };
		});
	});

	return (
		<mesh ref={setInitial}>
			<dodecahedronGeometry />
			<meshStandardMaterial color="white" metalness={0.5} roughness={0.25} />
		</mesh>
	);
}

// Query for all enemies and render them
export function EnemyRenderer() {
	const enemies = useQuery(IsEnemy, Transform);
	return enemies.map((enemy) => <HifiEnemyView key={enemy.id()} entity={enemy} />);
}
