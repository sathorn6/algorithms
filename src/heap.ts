const parent = (index: number) => Math.floor((index - 1) / 2);
const leftChild = (index: number) => index * 2 + 1;
const rightChild = (index: number) => index * 2 + 2;

export class Heap<V> {
	private data: V[];

	constructor(init: V[], private compare: (a: V, b: V) => number) {
		this.data = [...init];
		this.heapify();
	}

	/**
	 * Add an element to the heap.
	 */
	public push(element: V) {
		this.data.push(element);
		this.siftUp(this.data.length - 1);

		this.checkHeapProperty();
	}

	/**
	 * Replaces the top element with a new element.
	 */
	public replaceTop(element: V): V | null {
		const top = this.data[0] ?? null;

		this.data[0] = element;
		this.siftDown(0);

		this.checkHeapProperty();
		return top;
	}

	/**
	 * Pushes an element to the heap, then pops off the smallest element.
	 * Note that this may pop the just pushed element.
	 */
	public pushAndPop(element: V): V {
		if (this.data.length > 0 && this.compare(element, this.data[0]) < 0) {
			// Element is smaller than the top
			return element;
		}

		return this.replaceTop(element)!;
	}

	public peekTop(): V | null {
		return this.data[0] ?? null;
	}

	/**
	 * Takes the smallest element off the heap.
	 */
	public pop(): V | null {
		const minElement = this.data[0] ?? null;

		const lastElement = this.data.pop();

		if (!this.data.length) {
			return minElement;
		}

		// Move last element to the top and let it sift down
		this.data[0] = lastElement!;
		this.siftDown(0);

		this.checkHeapProperty();
		return minElement;
	}

	private siftDown(index: number) {
		// Find index of the smallest value of us and our children
		let smallestAt = index;

		if (
			leftChild(index) < this.data.length &&
			this.compare(this.data[leftChild(index)], this.data[smallestAt]) < 0
		) {
			smallestAt = leftChild(index);
		}

		if (
			rightChild(index) < this.data.length &&
			this.compare(this.data[rightChild(index)], this.data[smallestAt]) < 0
		) {
			smallestAt = rightChild(index);
		}

		if (smallestAt !== index) {
			// Swap with the child that is smaller than us and repeat
			this.swap(index, smallestAt);
			this.siftDown(smallestAt);
		}
	}

	private siftUp(index: number) {
		// While our parent is smaller than us we want to swap with it
		while (
			index > 0 &&
			this.compare(this.data[parent(index)], this.data[index]) > 0
		) {
			this.swap(index, parent(index));
			index = parent(index);
		}
	}

	private swap(a: number, b: number) {
		const tmp = this.data[a];
		this.data[a] = this.data[b];
		this.data[b] = tmp;
	}

	/**
	 * Turn the array into a heap.
	 * The time complexity works out to O(N).
	 */
	private heapify() {
		if (this.data.length < 2) {
			return;
		}

		// Look at all parents from the bottom up
		const lastParent = parent(this.data.length - 1);
		for (let i = lastParent; i >= 0; i--) {
			this.siftDown(i);
		}

		this.checkHeapProperty();
	}

	/**
	 * Verify heap property for debugging purposes.
	 */
	private checkHeapProperty(index = 0) {
		this.checkHeapPropertyForChild(index, leftChild);
		this.checkHeapPropertyForChild(index, rightChild);
	}

	private checkHeapPropertyForChild(
		index: number,
		child: (index: number) => number
	) {
		if (child(index) < this.data.length) {
			if (this.compare(this.data[index], this.data[child(index)]) > 0) {
				console.log(this.data);
				throw new Error(
					`Heap property was violated because ${
						this.data[index]
					} is parent of ${this.data[child(index)]}.`
				);
			}
			this.checkHeapProperty(child(index));
		}
	}
}
