import { useQueryFirst, useWorld } from 'koota/react';
import { IsCamera, Ref, Transform } from '../traits';
import { PerspectiveCamera } from '@react-three/drei';
import { Entity } from 'koota';
import { ComponentRef, useCallback } from 'react';

function CameraView({ entity }: { entity: Entity }) {
	const world = useWorld();
	const setInitial = useCallback(
		(camera: ComponentRef<typeof PerspectiveCamera>) => {
			if (!world.has(entity)) return;
			entity.add(Ref(camera));
			return () => entity.remove(Ref);
		},
		[entity]
	);

	return <PerspectiveCamera ref={setInitial} makeDefault />;
}

export function CameraRenderer() {
	const camera = useQueryFirst(IsCamera, Transform);
	if (!camera) return null;
	return <CameraView entity={camera} />;
}
