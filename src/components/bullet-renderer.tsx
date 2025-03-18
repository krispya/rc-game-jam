import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useCallback } from 'react';
import * as THREE from 'three';
import { Bullet, Ref, Transform } from '../traits';

export function BulletView({ entity }: { entity: Entity }) {
	const setInitial = useCallback(
		(group: THREE.Group | null) => {
			if (!group) return;
			entity.add(Ref(group));
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
// const bulletColor = new THREE.Color('lime');

function HifiBulletView({ entity }: { entity: Entity }) {
	const setInitial = useCallback(
		(group: THREE.Group) => {
			if (!entity.isAlive()) return;
			entity.add(Ref(group));
			return () => entity.remove(Ref);
		},
		[entity]
	);

	return (
		<group ref={setInitial}>
			{/* <mesh scale={0.4} rotation-z={Math.PI / 2}> */}
			<mesh scale={0.4} rotation={[0, 0, Math.PI / 2]}>
				<capsuleGeometry args={[0.5, 1.5, 4, 4]} />
				<meshBasicMaterial color={bulletColor} />
			</mesh>
		</group>
	);
}

export function BulletRenderer() {
	const bullets = useQuery(Bullet, Transform);
	// @ts-expect-error - Sort by id to avoid an R3F v9 bug
	// https://github.com/pmndrs/react-three-fiber/pull/3488
	bullets.sort((a, b) => a.id() - b.id());
	return bullets.map((bullet) => <HifiBulletView key={bullet.id()} entity={bullet} />);
}
