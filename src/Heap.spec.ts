import { Heap } from "./Heap";

describe("Heap", () => {
	const compareNumbers = (a: number, b: number) => a - b;
	const largerArray = [9, 3, 6, 4, 7, 8, 2, 24, 2, 6, 7, 8, 3, 80];
	const largerArraySorted = [...largerArray].sort(compareNumbers);

	it("can create an empty heap", () => {
		const heap = new Heap([], compareNumbers);

		expect(heap.peekTop()).toBe(null);
		expect(heap.pop()).toBe(null);
	});

	it("takes elements off the heap in the right oder", () => {
		const heap = new Heap([], compareNumbers);
		heap.push(2);
		heap.push(3);
		heap.push(1);

		expect(heap.pop()).toBe(1);
		expect(heap.pop()).toBe(2);
		expect(heap.pop()).toBe(3);
		expect(heap.pop()).toBe(null);
	});

	it("works with duplicates", () => {
		const heap = new Heap([], compareNumbers);
		heap.push(2);
		heap.push(1);
		heap.push(2);
		heap.push(1);

		expect(heap.pop()).toBe(1);
		expect(heap.pop()).toBe(1);
		expect(heap.pop()).toBe(2);
		expect(heap.pop()).toBe(2);
	});

	it("works with a larger array", () => {
		const heap = new Heap([], compareNumbers);

		for (const v of largerArray) {
			heap.push(v);
		}

		for (let i = 0; i < largerArray.length; i++) {
			expect(heap.pop()).toBe(largerArraySorted[i]);
		}

		expect(heap.pop()).toBe(null);
	});

	it("can be initialized", () => {
		const heap = new Heap([2, 3, 1], compareNumbers);

		expect(heap.pop()).toBe(1);
		expect(heap.pop()).toBe(2);
		expect(heap.pop()).toBe(3);
	});

	it("can be initialized with a larger array", () => {
		const heap = new Heap(largerArray, compareNumbers);

		for (let i = 0; i < largerArray.length; i++) {
			expect(heap.pop()).toBe(largerArraySorted[i]);
		}
		expect(heap.pop()).toBe(null);
	});

	it("can peek the min elements", () => {
		const heap = new Heap([2, 3, 1], compareNumbers);

		expect(heap.peekTop()).toBe(1);
		expect(heap.peekTop()).toBe(1);
	});

	it("replace the top element", () => {
		const heap = new Heap([3, 2, 4], compareNumbers);

		heap.replaceTop(1);

		expect(heap.pop()).toBe(1);
		expect(heap.pop()).toBe(3);
	});

	it("can pushAndPop", () => {
		const heap = new Heap([4, 2, 5], compareNumbers);

		heap.pushAndPop(3);

		expect(heap.pop()).toBe(3);
	});

	it("can pushAndPop a smaller element", () => {
		const heap = new Heap([3, 2, 4], compareNumbers);

		heap.pushAndPop(1);

		expect(heap.pop()).toBe(2);
	});
});
