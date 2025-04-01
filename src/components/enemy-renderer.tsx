import { useFrame } from '@react-three/fiber';
import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { memo, Profiler, useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { IsEnemy, Ref, Transform } from '../traits';

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

const HifiEnemyView = memo(({ entity }: { entity: Entity }) => {
	const progressRef = useRef(0);
	const duration = 2.0;

	// A ref callback is used so that it runs before effects
	const setInitial = useCallback(
		(mesh: THREE.Mesh) => {
			if (!entity.isAlive()) return;
			entity.add(Ref(mesh));
			// Set initial scale to 0
			if (progressRef.current === 0) entity.set(Transform, { scale: new THREE.Vector3(0, 0, 0) });
			return () => entity.remove(Ref);
		},
		[entity]
	);

	// Scale into existence
	useFrame((_, delta) => {
		if (progressRef.current >= 1) return;

		const transform = entity.get(Transform);
		if (!transform) return;

		// Update progress based on fixed duration
		progressRef.current = Math.min(progressRef.current + delta / duration, 1);
		const eased = 1 - Math.pow(1 - progressRef.current, 3);

		entity.set(Transform, (prev) => ({ ...prev, scale: prev.scale.setScalar(eased) }));
	});

	return (
		<mesh name="enemy" ref={setInitial}>
			<dodecahedronGeometry />
			<meshStandardMaterial color="white" metalness={0.5} roughness={0.25} />
		</mesh>
	);
});

// Query for all enemies and render them
export function EnemyRenderer() {
	const enemies = useQuery(IsEnemy, Transform);
	return enemies.map((enemy) => <HifiEnemyView key={enemy.id()} entity={enemy} />);
}
