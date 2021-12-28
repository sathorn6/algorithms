import { LRUCache } from "./LRUCache";

describe("LRUCache", () => {
	it("will not construct with a capacity of 0", () => {
		expect(() => new LRUCache(0)).toThrow();
	});

	it("returns undefined on non-existing key", () => {
		const lru = new LRUCache(3);

		expect(lru.get(1)).toBe(undefined);
	});

	it("returns stored items", () => {
		const lru = new LRUCache(2);

		lru.set(1, "one");
		lru.set(2, "two");

		expect(lru.get(1)).toBe("one");
		expect(lru.get(2)).toBe("two");
	});

	it("evicts the least recently inserted item", () => {
		const lru = new LRUCache(2);

		lru.set(1, "one");
		lru.set(2, "two");
		lru.set(3, "three");

		expect(lru.get(1)).toBe(undefined);
		expect(lru.get(2)).toBe("two");
		expect(lru.get(3)).toBe("three");
	});

	it("evicts the least recently used item", () => {
		const lru = new LRUCache(2);

		lru.set(1, "one");
		lru.set(2, "two");
		lru.get(1);
		lru.set(3, "three");

		expect(lru.get(1)).toBe("one");
		expect(lru.get(2)).toBe(undefined);
		expect(lru.get(3)).toBe("three");
	});

	it("can update an entry", () => {
		const lru = new LRUCache(2);

		lru.set(1, "one");
		lru.set(2, "two");
		lru.set(2, "twotwo");

		expect(lru.get(1)).toBe("one");
		expect(lru.get(2)).toBe("twotwo");
	});

	it("considers updating a use", () => {
		const lru = new LRUCache(2);

		lru.set(1, "one");
		lru.set(2, "two");
		lru.set(1, "oneone");
		lru.set(3, "three");

		expect(lru.get(1)).toBe("oneone");
		expect(lru.get(2)).toBe(undefined);
		expect(lru.get(3)).toBe("three");
	});
});
