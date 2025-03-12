import { useFrame } from '@react-three/fiber';
import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { Explosion, Transform, Ref } from '../traits';

const color = new THREE.Color(1, 0.5, 0).multiplyScalar(40);
// const color = new THREE.Color(1, 0.5, 0);

export function ExplosionView({ entity }: { entity: Entity }) {
	const groupRef = useRef<THREE.Group>(null!);
	const particleCount = entity.get(Explosion)!.count;

	const setInitial = useCallback(
		(group: THREE.Group | null) => {
			if (!group) return;
			entity.add(Ref(group));

			// Set particle velocities with random offset
			const velocities = entity.get(Explosion)!.velocities;
			const randomOffset = Math.random() * Math.PI * 2; // Random starting angle

			for (let i = 0; i < particleCount; i++) {
				const angle = randomOffset + (i / particleCount) * Math.PI * 2;
				velocities.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
			}

			groupRef.current = group;
		},
		[entity, particleCount]
	);

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
		<group ref={setInitial}>
			{Array.from({ length: particleCount }).map((_, i) => {
				return (
					<mesh key={i}>
						<sphereGeometry args={[0.18, 8, 8]} />
						<meshBasicMaterial color={color} transparent />
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
