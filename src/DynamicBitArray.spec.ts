import { Bit, DynamicBitArray } from "./DynamicBitArray";

describe("DynamicBitArray", () => {
	it("starts empty", () => {
		const array = new DynamicBitArray();

		expect([...array.bits()]).toEqual([]);
		expect(array.getSize()).toBe(0);
	});

	it("stores bits", () => {
		const array = new DynamicBitArray();

		array.push(1);
		array.push(0);
		array.push(1);

		expect(array.get(0)).toBe(1);
		expect([...array.bits()]).toEqual([1, 0, 1]);
		expect(array.getSize()).toBe(3);
	});

	it("throws an error if getting an index out of range", () => {
		const array = new DynamicBitArray();

		array.push(1);

		expect(() => array.get(2)).toThrow("Index 2 out of range.");
	});

	it("grows to store more bits", () => {
		const array = new DynamicBitArray();
		const bits = [];

		for (let i = 0; i < 10000; i++) {
			array.push((i % 2) as Bit);
			bits.push((i % 2) as Bit);
		}

		expect([...array.bits()]).toEqual(bits);
	});

	it("can append another array", () => {
		const a = new DynamicBitArray();
		const b = new DynamicBitArray();
		a.push(1);
		a.push(0);
		b.push(0);
		b.push(1);
		a.append(b);

		expect([...a.bits()]).toEqual([1, 0, 0, 1]);
	});

	it("can be turned into a string", () => {
		const array = new DynamicBitArray();

		array.push(1);
		array.push(0);
		array.push(1);

		expect(array.toString()).toBe("101");
	});
});
