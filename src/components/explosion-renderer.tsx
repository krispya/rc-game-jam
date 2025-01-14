import { useFrame } from '@react-three/fiber';
import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Explosion, Transform } from '../traits';

export function ExplosionView({ entity }: { entity: Entity }) {
	const groupRef = useRef<THREE.Group>(null);
	const particleCount = entity.get(Explosion)!.count;

	useLayoutEffect(() => {
		if (!groupRef.current) return;

		// Position the explosion group
		groupRef.current.position.copy(entity.get(Transform)!.position);

		// Set particle velocities with random offset
		const velocities = entity.get(Explosion)!.velocities;
		const randomOffset = Math.random() * Math.PI * 2; // Random starting angle

		for (let i = 0; i < particleCount; i++) {
			const angle = randomOffset + (i / particleCount) * Math.PI * 2;
			velocities.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
		}

		return () => {
			velocities.length = 0;
		};
	}, [entity, particleCount]);

	useFrame((_, delta) => {
		if (!groupRef.current) return;

		const explosion = entity.get(Explosion);
		if (!explosion) return;

		const { duration, current } = explosion;
		const progress = current / duration;

		const velocities = entity.get(Explosion)!.velocities;
		const particles = groupRef.current.children as THREE.Mesh[];

		for (let i = 0; i < particleCount; i++) {
			const particle = particles[i];
			if (!particle || !velocities[i]) continue;
			particle.position.add(velocities[i].clone().multiplyScalar(delta * 40));

			// Update scale and opacity
			const scale = Math.max(0, 1 - progress);
			particle.scale.setScalar(scale);
			(particle.material as THREE.MeshBasicMaterial).opacity = scale;
		}
	});

	return (
		<group ref={groupRef}>
			{Array.from({ length: particleCount }).map((_, i) => {
				return (
					<mesh key={i}>
						<sphereGeometry args={[0.18, 8, 8]} />
						<meshBasicMaterial color={new THREE.Color(1, 0.5, 0).multiplyScalar(40)} transparent />
					</mesh>
				);
			})}
		</group>
	);
}

export function ExplosionRenderer() {
	const explosions = useQuery(Explosion, Transform);

	return (
		<>
			{explosions.map((explosion) => (
				<ExplosionView key={explosion.id()} entity={explosion} />
			))}
		</>
	);
}
