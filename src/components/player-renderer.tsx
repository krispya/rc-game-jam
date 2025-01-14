import { useGLTF } from '@react-three/drei';
import { Entity } from 'koota';
import { useQueryFirst, useTraitEffect } from 'koota/react';
import { useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import src from '../assets/spacecraft.glb?url';
import { Input, Player, Transform } from '../traits';
import { ThrusterView } from './thruster-view';

// Position is now driven by Koota
export function PlayerView({ entity }: { entity: Entity }) {
	const ref = useRef<THREE.Mesh>(null!);

	// Sync traits
	// Use layout effect so syncing happens before other effects
	useLayoutEffect(() => {
		entity.set(Transform, {
			position: ref.current.position,
			rotation: ref.current.rotation,
			scale: ref.current.scale,
		});
	}, [entity]);

	return (
		<mesh ref={ref}>
			<boxGeometry />
			<meshBasicMaterial color="orange" wireframe />
		</mesh>
	);
}

export function HifiPlayerView({ entity }: { entity: Entity }) {
	const ref = useRef<THREE.Group>(null!);
	const { scene } = useGLTF(src);

	useLayoutEffect(() => {
		// Rotate the model to face forward and shrink it down
		const model = scene.children[0]! as THREE.Mesh;
		model.rotation.set(0, -Math.PI / 2, -Math.PI / 2);
		model.scale.set(0.5, 0.5, 0.5);

		entity.set(Transform, {
			position: ref.current.position,
			rotation: ref.current.rotation,
			scale: ref.current.scale,
		});
	}, [entity, scene]);

	const [isThrusting, setIsThrusting] = useState(false);

	useTraitEffect(entity, Input, (input) => {
		if (input && input.length() > 0) setIsThrusting(true);
		else setIsThrusting(false);
	});

	return (
		<group ref={ref}>
			<primitive object={scene} />
			{isThrusting && <ThrusterView position={[-1.5, -0.34, 0]} />}
			{isThrusting && <ThrusterView position={[-1.5, 0.34, 0]} />}
		</group>
	);
}

// Query for the first player entity and render it
export function PlayerRenderer() {
	const player = useQueryFirst(Player, Transform);
	return player ? <HifiPlayerView entity={player} /> : null;
}
