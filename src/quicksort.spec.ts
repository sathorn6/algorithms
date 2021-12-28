import { quicksort } from "./quicksort";

describe("quicksort", () => {
	const compareNumbers = (a: number, b: number) => a - b;

	const testSort = (values: number[]) => {
		const array = [...values];
		const sorted = [...values].sort(compareNumbers);

		quicksort(array, compareNumbers);

		expect(array).toEqual(sorted);
	};

	it("leaves an empty array alone", () => {
		testSort([]);
	});

	it("leaves a one element array alone", () => {
		testSort([1]);
	});

	it("sorts arrays", () => {
		testSort([2, 3, 1]);
		testSort([3, 4, 2, 1]);
		testSort([94, 21, 6, 5, 2, -6354, 0, 456, -2, 120, 3, 7, 1]);
		testSort([5, 1, 5, 6, 2, 6, 4, 5, 5, 1, 5, 1, 5, 2, 5, 6, 1, 3, 4, 5, 1]);
	});
});
