import { Entity, trait } from 'koota';
import { SpatialHashMap as SpatialHashMapImpl } from '../utils/spatial-hash';

export const SpatialHashMap = trait(() => new SpatialHashMapImpl<Entity>(50));
