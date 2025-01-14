import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useCallback } from 'react';
import * as THREE from 'three';
import { Bullet, Transform, View } from '../traits';

export function BulletView({ entity }: { entity: Entity }) {
	const setInitial = useCallback(
		(group: THREE.Group | null) => {
			if (!group) return;
			entity.add(View(group));
		},
		[entity]
	);

	return (
		<group ref={setInitial}>
			<mesh scale={0.2}>
				<sphereGeometry />
				<meshBasicMaterial color="red" wireframe />
			</mesh>
		</group>
	);
}

const bulletColor = new THREE.Color('green').multiplyScalar(40);

function HifiBulletView({ entity }: { entity: Entity }) {
	const setInitial = useCallback(
		(group: THREE.Group | null) => {
			if (!group) return;
			entity.add(View(group));
		},
		[entity]
	);

	return (
		<group ref={setInitial}>
			<mesh scale={0.4} rotation-z={Math.PI / 2}>
				<capsuleGeometry args={[0.5, 1.5, 4, 4]} />
				<meshBasicMaterial color={bulletColor} />
			</mesh>
		</group>
	);
}

export function BulletRenderer() {
	const bullets = useQuery(Bullet, Transform);
	return bullets.map((bullet) => <HifiBulletView key={bullet.id()} entity={bullet} />);
}
