import { useGLTF } from '@react-three/drei';
import { Entity } from 'koota';
import { useQueryFirst, useTraitEffect } from 'koota/react';
import { useCallback, useLayoutEffect, useState } from 'react';
import * as THREE from 'three';
import src from '../assets/spacecraft.glb?url';
import { Input, IsPlayer, Transform, View } from '../traits';
import { ThrusterView } from './thruster-view';

export function PlayerView({ entity }: { entity: Entity }) {
	// A ref callback is used so that it runs before effects
	const setInitial = useCallback(
		(mesh: THREE.Mesh) => {
			entity.add(View(mesh));
			entity.set(Transform, {
				position: mesh.position,
				rotation: mesh.rotation,
				scale: mesh.scale,
			});
		},
		[entity]
	);

	return (
		<mesh ref={setInitial}>
			<boxGeometry />
			<meshBasicMaterial color="orange" wireframe />
		</mesh>
	);
}

export function HifiPlayerView({ entity }: { entity: Entity }) {
	const { scene } = useGLTF(src);
	const [isThrusting, setIsThrusting] = useState(false);

	useTraitEffect(entity, Input, (input) => {
		if (input && input.length() > 0) setIsThrusting(true);
		else setIsThrusting(false);
	});

	useLayoutEffect(() => {
		// Rotate the model to face forward and shrink it down
		const model = scene.children[0]! as THREE.Mesh;
		model.rotation.set(0, -Math.PI / 2, -Math.PI / 2);
		model.scale.set(0.5, 0.5, 0.5);
	}, [entity, scene]);

	// A ref callback is used so that it runs before effects
	const setInitial = useCallback(
		(group: THREE.Group | null) => {
			// If the ref is null then it is being unmounted
			if (!group) return;
			entity.add(View(group));
		},
		[entity]
	);

	return (
		<group ref={setInitial}>
			<primitive object={scene} />
			{isThrusting && <ThrusterView position={[-1.5, -0.34, 0]} />}
			{isThrusting && <ThrusterView position={[-1.5, 0.34, 0]} />}
		</group>
	);
}

// Query for the first player entity and render it
export function PlayerRenderer() {
	const player = useQueryFirst(IsPlayer, Transform);
	return player ? <HifiPlayerView entity={player} /> : null;
}
