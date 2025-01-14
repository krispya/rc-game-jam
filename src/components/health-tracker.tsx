import '@fontsource/russo-one';
import { useWorld } from 'koota/react';
import { useEffect, useState } from 'react';
import { Health } from '../traits';

export function HealthTracker() {
	const world = useWorld();
	const [health, setHealth] = useState(100);

	useEffect(() => {
		const unsub = world.onChange(Health, (player) => {
			const playerHealth = player.get(Health);
			setHealth(playerHealth?.amount ?? 0);
		});

		return () => {
			unsub();
		};
	}, [world]);

	return (
		<div className="health-bar">
			{health <= 0 ? <div /> :
				<div className="remaining-health" style={{
					flexGrow: health / 100,
				}}>
					{health}
				</div>
			}
			<div className="lost-health" style={{
				flexGrow: (100 - health) / 100,
			}} />
		</div>
	);
}
