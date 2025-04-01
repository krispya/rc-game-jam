import { useFrame } from '@react-three/fiber';
import { useTrait, useWorld } from 'koota/react';
import { useRef } from 'react';
import * as THREE from 'three';
import { SpatialHashMap } from '../traits/spatial-hash-map';

export function SpatialHashDebug({
	plane = 'xy',
	axisOffset = 0,
}: {
	plane?: 'xy' | 'xz' | 'yz';
	axisOffset?: number;
}) {
	const world = useWorld();
	const spatialHashMap = useTrait(world, SpatialHashMap);
	const linesRef = useRef<THREE.Group>(null);

	useFrame(() => {
		if (!spatialHashMap || !linesRef.current) return;

		// Clear previous lines
		while (linesRef.current.children.length > 0) {
			const child = linesRef.current.children[0];
			linesRef.current.remove(child);
			if (child instanceof THREE.LineSegments) {
				child.geometry.dispose();
				if (child.material instanceof THREE.Material) {
					child.material.dispose();
				}
			}
		}

		// Get cell data
		const cells = spatialHashMap.getCellData(plane, axisOffset);

		// Create 2D grid lines for each cell
		cells.forEach(({ x, y, z, size }) => {
			// Create line geometry for the cell based on which plane we're in
			const geometry = new THREE.BufferGeometry();
			const vertices = [];

			if (plane === 'xy') {
				// Create a square in the XY plane
				vertices.push(
					x,
					y,
					axisOffset,
					x + size,
					y,
					axisOffset,

					x + size,
					y,
					axisOffset,
					x + size,
					y + size,
					axisOffset,

					x + size,
					y + size,
					axisOffset,
					x,
					y + size,
					axisOffset,

					x,
					y + size,
					axisOffset,
					x,
					y,
					axisOffset
				);
			} else if (plane === 'xz') {
				// Create a square in the XZ plane
				vertices.push(
					x,
					axisOffset,
					z,
					x + size,
					axisOffset,
					z,

					x + size,
					axisOffset,
					z,
					x + size,
					axisOffset,
					z + size,

					x + size,
					axisOffset,
					z + size,
					x,
					axisOffset,
					z + size,

					x,
					axisOffset,
					z + size,
					x,
					axisOffset,
					z
				);
			} else if (plane === 'yz') {
				// Create a square in the YZ plane
				vertices.push(
					axisOffset,
					y,
					z,
					axisOffset,
					y + size,
					z,

					axisOffset,
					y + size,
					z,
					axisOffset,
					y + size,
					z + size,

					axisOffset,
					y + size,
					z + size,
					axisOffset,
					y,
					z + size,

					axisOffset,
					y,
					z + size,
					axisOffset,
					y,
					z
				);
			}

			geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

			const material = new THREE.LineBasicMaterial({
				color: 0x00ff00,
				transparent: true,
				opacity: 0.7,
			});

			const lines = new THREE.LineSegments(geometry, material);
			linesRef.current!.add(lines);
		});
	});

	return <group ref={linesRef} />;
}
