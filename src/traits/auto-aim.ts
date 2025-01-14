import { trait } from 'koota';

export const AutoAim = trait({
	cooldown: 1000, // In ms
	current: 0,
	radius: 10,
});
