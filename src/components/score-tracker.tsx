import '@fontsource/russo-one';
import { useWorld } from 'koota/react';
import { useEffect, useState } from 'react';
import { IsEnemy } from '../traits';
// @ts-expect-error - react-animated-counter is not typed
import { AnimatedCounter } from 'react-animated-counter';

export function ScoreTracker() {
	const world = useWorld();
	const [score, setScore] = useState(99999);

	useEffect(() => {
		const unsub = world.onRemove([IsEnemy], () => {
			setScore((v) => v + 1);
		});

		setScore(0);

		return () => {
			unsub();
		};
	}, [world]);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				padding: 40,
				color: 'gold',
				fontSize: '3rem',
				fontFamily: 'Russo One',
				display: 'inline-flex',
				gap: '0.65rem',
				zIndex: 5,
			}}
		>
			Score:{' '}
			<AnimatedCounter
				value={score}
				fontSize="3rem"
				includeDecimals={false}
				color="gold"
				incrementColor="white"
			/>
		</div>
	);
}
