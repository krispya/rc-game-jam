import { Entity, trait } from 'koota';

export const Avoidant = trait({
	neighbors: [] as Entity[],
	range: 1.5,
});
