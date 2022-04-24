export type Bit = 0 | 1;

export class DynamicBitArray {
	private storage = new Uint8Array(1);
	private size = 0;

	public push(bit: Bit) {
		const requiredStorageSize = 1 + Math.floor(this.size / 8);
		if (requiredStorageSize > this.storage.length) {
			// Double capacity when storage is full for amortized constant time inserts
			const newStorage = new Uint8Array(this.storage.length * 2);
			newStorage.set(this.storage);
			this.storage = newStorage;
		}

		const index = this.size;
		this.size++;

		if (bit) {
			const byteIndex = Math.floor(index / 8);
			this.storage[byteIndex] |= 1 << index % 8;
		}
	}

	public append(other: DynamicBitArray) {
		for (const bit of other.bits()) {
			this.push(bit);
		}
	}

	public get(index: number): Bit {
		if (index > this.size - 1) {
			throw new Error(`Index ${index} out of range.`);
		}

		const byteIndex = Math.floor(index / 8);
		const byte = this.storage[byteIndex];
		const bit = 1 << index % 8;
		return bit & byte ? 1 : 0;
	}

	public getSize(): number {
		return this.size;
	}

	public *bits(): IterableIterator<Bit> {
		for (let i = 0; i < this.size; i++) {
			yield this.get(i);
		}
	}

	public toString(): string {
		return Array.from(this.bits()).join("");
	}
}
