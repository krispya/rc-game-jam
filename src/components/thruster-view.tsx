import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export function ThrusterView({ position }: { position: [number, number, number] }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		if (!meshRef.current) return;
		// Create a pulsing effect by using sin wave
		const scale = 0.8 + Math.sin(clock.elapsedTime * 10) * 0.2;
		meshRef.current.scale.setY(scale);
		meshRef.current.position.y = -(1 - scale) / 2;
	});

	return (
		<group position={position} rotation={[0, 0, 3.14 / 2]}>
			<mesh ref={meshRef}>
				<coneGeometry args={[0.15, 1, 8]} />
				<meshBasicMaterial color={new THREE.Color(1, 0.5, 0).multiplyScalar(40)} />
			</mesh>
		</group>
	);
}
