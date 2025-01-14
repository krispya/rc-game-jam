import { Entity } from 'koota';
import { useQuery } from 'koota/react';
import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Bullet, Transform } from '../traits';

export function BulletView({ entity }: { entity: Entity }) {
	const ref = useRef<THREE.Mesh>(null!);

	useLayoutEffect(() => {
		// Copy current position
		const transform = entity.get(Transform)!;
		ref.current.position.copy(transform.position);
		ref.current.rotation.copy(transform.rotation);

		entity.set(Transform, {
			position: ref.current.position,
			rotation: ref.current.rotation,
			scale: ref.current.scale,
		});
	}, [entity]);

	return (
		<mesh ref={ref} scale={0.2}>
			<sphereGeometry />
			<meshBasicMaterial color="red" wireframe />
		</mesh>
	);
}

const bulletColor = new THREE.Color('green').multiplyScalar(40);

function HifiBulletView({ entity }: { entity: Entity }) {
	const ref = useRef<THREE.Group>(null!);

	useLayoutEffect(() => {
		// Copy current position
		ref.current.position.copy(entity.get(Transform)!.position);
		ref.current.rotation.copy(entity.get(Transform)!.rotation);

		entity.set(Transform, {
			position: ref.current.position,
			rotation: ref.current.rotation,
			scale: ref.current.scale,
		});
	}, [entity]);

	return (
		<group ref={ref}>
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
