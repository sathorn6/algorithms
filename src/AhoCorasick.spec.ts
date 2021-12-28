import { AhoCorasick } from "./AhoCorasick";

describe("AhoCorasick", () => {
	it("finds matches", () => {
		const ac = new AhoCorasick(["apple", "banana", "cherry"]);
		expect(ac.search("pudding apple banana cherry the world wonders")).toEqual([
			{ index: 8, string: "apple" },
			{ index: 14, string: "banana" },
			{ index: 21, string: "cherry" },
		]);
	});

	it("finds multiple matches", () => {
		const ac = new AhoCorasick(["apple", "banana", "cherry"]);
		expect(ac.search("pudding apple banana apple the world wonders")).toEqual([
			{ index: 8, string: "apple" },
			{ index: 14, string: "banana" },
			{ index: 21, string: "apple" },
		]);
	});

	it("works with prefixes", () => {
		const ac = new AhoCorasick(["apple", "app", "ap"]);
		expect(ac.search("pudding apple wonders")).toEqual([
			{ index: 8, string: "ap" },
			{ index: 8, string: "app" },
			{ index: 8, string: "apple" },
		]);
	});

	it("works with suffixes", () => {
		const ac = new AhoCorasick(["apple", "ple", "le"]);
		expect(ac.search("pudding apple wonders")).toEqual([
			{ index: 8, string: "apple" },
			{ index: 10, string: "ple" },
			{ index: 11, string: "le" },
		]);
	});

	it("works with infixes", () => {
		const ac = new AhoCorasick(["apple", "ppl"]);
		expect(ac.search("pudding apple wonders")).toEqual([
			{ index: 9, string: "ppl" },
			{ index: 8, string: "apple" },
		]);
	});

	it("handles empty dictionary", () => {
		const ac = new AhoCorasick([]);
		expect(ac.search("pudding apple banana apple the world wonders")).toEqual(
			[]
		);
	});

	it("handles empty haystack", () => {
		const ac = new AhoCorasick(["apple"]);
		expect(ac.search("")).toEqual([]);
	});

	it("handles empty dict entry", () => {
		const ac = new AhoCorasick([""]);
		expect(ac.search("apple")).toEqual([]);
	});

	it("handles duplicate dict entry", () => {
		const ac = new AhoCorasick(["apple", "apple"]);
		expect(ac.search("pudding apple")).toHaveLength(1);
	});
});
