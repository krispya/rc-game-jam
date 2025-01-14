import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useWorld } from 'koota/react';
import { useRef } from 'react';
import { Movement, Player } from '../traits';

export function PrintVelocity() {
	const ref = useRef<HTMLDivElement>(null!);
	const world = useWorld();

	useFrame(() => {
		if (!ref.current) return;
		const player = world.queryFirst(Player);
		if (!player) return;

		const { velocity } = player.get(Movement)!;
		ref.current.textContent = `Velocity: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}`;
	});

	return (
		<Html
			fullscreen
			style={{
				color: 'cyan',
				fontSize: '20px',
				fontFamily: 'monospace',
				padding: 40,
			}}
		>
			<div ref={ref} />
		</Html>
	);
}
