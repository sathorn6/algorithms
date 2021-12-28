import { byteFrequencies, HuffmanTree } from "../HuffmanTree";

const data = Uint8Array.from([10, 20, 10, 20, 10, 20, 10, 20, 30, 10, 30]);

describe("byteFrequencies", () => {
	it("counts the frequencies of bytes", () => {
		const result = byteFrequencies(data);

		expect(result[0]).toBe(0);
		expect(result[10]).toBe(5);
		expect(result[20]).toBe(4);
		expect(result[30]).toBe(2);
	});
});

describe("HuffmanTree", () => {
	it("compresses data", () => {
		const tree = new HuffmanTree(byteFrequencies(data));

		const encoded = tree.encode(data);
		const decoded = tree.decode(encoded);

		expect(encoded.getSize() / 8).toBeLessThan(data.length);
		expect(decoded).toEqual(data);
	});
});
