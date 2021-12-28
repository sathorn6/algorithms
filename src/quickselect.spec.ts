import { quickselect } from "./quickselect";

describe("quickselect", () => {
	const compareNumbers = (a: number, b: number) => a - b;

	const exhaustivelyTestArray = (values: number[]) => {
		const sorted = [...values].sort(compareNumbers);

		// Test every single index
		for (let i = 0; i < values.length; i++) {
			const array = [...values];
			const result = quickselect(array, compareNumbers, i);
			expect(result).toEqual(sorted[i]);
		}
	};

	it("throws if k is out of bounds", () => {
		expect(() => quickselect([], compareNumbers, 0)).toThrow();
		expect(() => quickselect([1], compareNumbers, 1)).toThrow();
		expect(() => quickselect([1], compareNumbers, -1)).toThrow();
	});

	it("selects the kth smallest value", () => {
		exhaustivelyTestArray([1]);
		exhaustivelyTestArray([2, 3, 1]);
		exhaustivelyTestArray([94, 21, 6, 5, 2, -6354, 0, 456, -2, 120, 3, 7, 1]);
		exhaustivelyTestArray([5, 1, 5, 6, 2, 6, 4, 5, 5, 5, 1, 5, 2, 5, 6, 1]);
	});

	it("works with duplicated entries", () => {
		exhaustivelyTestArray([2, 2, 3, 1, 3, 4, 5, 2, 3, 1, 1]);
	});
});
