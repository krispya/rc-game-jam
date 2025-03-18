// Originally by Hendrik Mans: https://github.com/hmans/miniplex/blob/main/apps/demo/src/systems/SpatialHashingSystem.tsx

type Cell<T> = Set<T>;

export class SpatialHashMap<T> {
	protected cells = new Map<string, Cell<T>>();
	protected itemToCell = new Map<T, Cell<T>>();

	constructor(public cellSize: number) {}

	set(item: T, x: number, y: number, z: number) {
		const cell = this.getCell(x, y, z);

		/* Remove from previous hash if known */
		const oldCell = this.itemToCell.get(item);

		if (oldCell) {
			/* If hash didn't change, do nothing */
			if (oldCell === cell) return;

			/* Remove from previous hash */
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
