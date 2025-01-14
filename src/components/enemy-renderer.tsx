import { useFrame } from '@react-three/fiber';
import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Enemy, Transform } from '../traits';

export function EnemyView({ entity }: { entity: Entity }) {
	const ref = useRef<THREE.Mesh>(null!);

	useLayoutEffect(() => {
		const transform = entity.get(Transform)!;
		ref.current.position.copy(transform.position);
		ref.current.rotation.copy(transform.rotation);
		ref.current.scale.copy(transform.scale);

		// Sync traits from mesh
		entity.set(Transform, {
			position: ref.current.position,
			rotation: ref.current.rotation,
			scale: ref.current.scale,
		});
	}, [entity]);

	return (
		<mesh ref={ref}>
			<dodecahedronGeometry />
			<meshBasicMaterial color="white" wireframe />
		</mesh>
	);
}

function HifiEnemyView({ entity }: { entity: Entity }) {
	const ref = useRef<THREE.Mesh>(null!);
	const scaleRef = useRef(0);

	useLayoutEffect(() => {
		const transform = entity.get(Transform)!;
		ref.current.position.copy(transform.position);
		ref.current.rotation.copy(transform.rotation);
		ref.current.scale.copy(transform.scale);

		// Sync traits from mesh
		entity.set(Transform, {
			position: ref.current.position,
			rotation: ref.current.rotation,
			scale: ref.current.scale,
		});
	}, [entity]);

	// Scale into existence
	useFrame((_, delta) => {
		if (!ref.current) return;
		const progress = Math.min(scaleRef.current + delta * 2, 1);
		// Apply easing - this uses cubic easing out
		const eased = 1 - Math.pow(1 - progress, 3);
		scaleRef.current = progress;
		ref.current.scale.setScalar(eased);
	});

	return (
		<mesh ref={ref}>
			<dodecahedronGeometry />
			<meshStandardMaterial color="white" metalness={0.5} roughness={0.25} />
		</mesh>
	);
}

// Query for all enemies and render them
export function EnemyRenderer() {
	const enemies = useQuery(Enemy, Transform);
	return enemies.map((enemy) => <HifiEnemyView key={enemy.id()} entity={enemy} />);
}
