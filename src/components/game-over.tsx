import '@fontsource/russo-one';
import { Html } from '@react-three/drei';
import { useWorld } from 'koota/react';
import { useEffect, useState } from 'react';
import { Health } from '../traits';
import { AnimatedCounter } from 'react-animated-counter';
import React from 'react';


export function GameOverText() {
	const world = useWorld();
	const [gameOver, setGameOver] = useState(false);

	useEffect(() => {
		const unsub = world.onChange(Health, (player) => {
			const playerHealth = player.get(Health);
            if (playerHealth) {
			    setGameOver(playerHealth.amount <= 0)
            }
		});
		return () => {
			unsub();
		};
	}, [world]);

	return gameOver ? (
		<Html fullscreen>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
                height: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%'
                }}>
			        <div
				        style={{
					        color: 'red',
					        fontSize: '3rem',
					        fontFamily: 'Russo One',
					        gap: '0.65rem',
				        }}
			        >
				        GAME OVER
			        </div>
                </div>
            </div>
		</Html>
	) : null;
}