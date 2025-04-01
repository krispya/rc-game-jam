// Originally by Hendrik Mans: https://github.com/hmans/miniplex/blob/main/apps/demo/src/systems/SpatialHashingSystem.tsx

type Cell<T> = Set<T>;

/**
 * Data for debugging and visualization of a single cell
 */
export type CellData = {
	/** The cell's hash key (e.g. "0:0:0") */
	key: string;
	/** X position of the cell's corner in world space */
	x: number;
	/** Y position of the cell's corner in world space */
	y: number;
	/** Z position of the cell's corner in world space */
	z: number;
	/** Size of the cell (width, height, depth) */
	size: number;
	/** Number of items in this cell */
	count: number;
};

export class SpatialHashMap<T> {
	protected cells = new Map<string, Cell<T>>();
	protected itemToCell = new Map<T, Cell<T>>();

	constructor(public cellSize: number) {}

	set(item: T, x: number, y: number, z: number) {
		const cell = this.getCell(x, y, z);

		// Remove from previous hash if known
		const oldCell = this.itemToCell.get(item);

		if (oldCell) {
			// If hash didn't change, do nothing
			if (oldCell === cell) return;

			// Remove from previous hash
			oldCell.delete(item);
		}

		cell.add(item);
		this.itemToCell.set(item, cell);
	}

	remove(item: T) {
		const cell = this.itemToCell.get(item);
		cell?.delete(item);
		this.itemToCell.delete(item);
	}

	query(x: number, y: number, z: number, radius: number, items: T[] = [], maxItems = Infinity) {
		let count = 0;
		items.length = 0;

		// Calculate the cell coordinates that contain the sphere defined by radius
		const minCellX = Math.floor((x - radius) / this.cellSize);
		const maxCellX = Math.floor((x + radius) / this.cellSize);
		const minCellY = Math.floor((y - radius) / this.cellSize);
		const maxCellY = Math.floor((y + radius) / this.cellSize);
		const minCellZ = Math.floor((z - radius) / this.cellSize);
		const maxCellZ = Math.floor((z + radius) / this.cellSize);

		// Iterate through all cells that might contain entities within the radius
		for (let cx = minCellX; cx <= maxCellX; cx++) {
			for (let cy = minCellY; cy <= maxCellY; cy++) {
				for (let cz = minCellZ; cz <= maxCellZ; cz++) {
					const cell = this.getCell(cx * this.cellSize, cy * this.cellSize, cz * this.cellSize);

					for (const item of cell) {
						items.push(item);
						count++;

						if (count >= maxItems) return items;
					}
				}
			}
		}

		return items;
	}

	/**
	 * Get data for all non-empty cells in the spatial hash map, useful for debug rendering
	 * @param plane Optional plane to filter cells by ('xy', 'xz', 'yz')
	 * @param planeValue Optional value for the fixed coordinate of the plane
	 * @returns Array of cell data objects
	 */
	getCellData(plane?: 'xy' | 'xz' | 'yz', planeValue: number = 0): CellData[] {
		const result: CellData[] = [];

		for (const [hash, items] of this.cells.entries()) {
			if (items.size === 0) continue;

			// Parse hash to get cell coordinates
			const [hx, hy, hz] = hash.split(':').map(Number);

			// Calculate world position
			const x = hx * this.cellSize;
			const y = hy * this.cellSize;
			const z = hz * this.cellSize;

			// If plane is specified, only include cells on that plane
			if (plane === 'xy' && Math.floor(z / this.cellSize) !== Math.floor(planeValue / this.cellSize))
				continue;
			if (plane === 'xz' && Math.floor(y / this.cellSize) !== Math.floor(planeValue / this.cellSize))
				continue;
			if (plane === 'yz' && Math.floor(x / this.cellSize) !== Math.floor(planeValue / this.cellSize))
				continue;

			result.push({
				key: hash,
				x,
				y,
				z,
				size: this.cellSize,
				count: items.size,
			});
		}

		return result;
	}

	/**
	 * Get the bounds of all non-empty cells
	 * @returns The min and max coordinates of the occupied area
	 */
	getBounds() {
		let minX = Infinity,
			minY = Infinity,
			minZ = Infinity;
		let maxX = -Infinity,
			maxY = -Infinity,
			maxZ = -Infinity;

		// If no cells, return default bounds
		if (this.cells.size === 0) {
			return { minX: 0, minY: 0, minZ: 0, maxX: 0, maxY: 0, maxZ: 0 };
		}

		for (const hash of this.cells.keys()) {
			const [hx, hy, hz] = hash.split(':').map(Number);
			const x = hx * this.cellSize;
			const y = hy * this.cellSize;
			const z = hz * this.cellSize;

			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			minZ = Math.min(minZ, z);
			maxX = Math.max(maxX, x + this.cellSize);
			maxY = Math.max(maxY, y + this.cellSize);
			maxZ = Math.max(maxZ, z + this.cellSize);
		}

		return { minX, minY, minZ, maxX, maxY, maxZ };
	}

	clear() {
		this.cells.clear();
		this.itemToCell.clear();
	}

	protected getCell(x: number, y: number, z: number) {
		const hash = this.calculateHash(x, y, z, this.cellSize);

		if (!this.cells.has(hash)) {
			this.cells.set(hash, new Set());
		}

		return this.cells.get(hash)!;
	}

	protected calculateHash(x: number, y: number, z: number, cellSize: number) {
		const hx = Math.floor(x / cellSize);
		const hy = Math.floor(y / cellSize);
		const hz = Math.floor(z / cellSize);

		return `${hx}:${hy}:${hz}`;
	}
}
