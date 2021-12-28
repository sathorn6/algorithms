import { DynamicBitArray } from "./DynamicBitArray";
import { Heap } from "./Heap";

class InternalNode {
	constructor(public zero: Node, public one: Node) {}
}

class LeafNode {
	constructor(public symbol: number) {}
}

type Node = InternalNode | LeafNode;

interface WeightedNode {
	weight: number;
	node: Node;
}

export class HuffmanTree {
	private root: InternalNode;
	private codeTable = new Array<DynamicBitArray>(256);

	constructor(weights: number[]) {
		// Put all symbols as leaf nodes into a priority queue
		const queue = new Heap<WeightedNode>([], (a, b) => a.weight - b.weight);
		for (let symbol = 0; symbol < 256; symbol++) {
			queue.push({
				weight: weights[symbol],
				node: new LeafNode(symbol),
			});
		}

		while (true) {
			const a = queue.pop()!;
			const b = queue.pop();

			if (b === null) {
				// If there is only one entry left, it's the root node
				this.root = a.node as InternalNode;
				break;
			}

			// We have chosen the 2 nodes with the lowest weights and merge them
			// This places them on the deepest level of all remaining nodes
			queue.push({
				weight: a.weight + b.weight,
				node: new InternalNode(a.node, b.node),
			});
		}

		// Build the code table with the bits for each symbol
		const dfs = (prefix: DynamicBitArray, node: Node) => {
			if (node instanceof LeafNode) {
				this.codeTable[node.symbol] = prefix;
			} else {
				const zero = new DynamicBitArray();
				zero.append(prefix);
				zero.push(0);
				dfs(zero, node.zero);

				const one = new DynamicBitArray();
				one.append(prefix);
				one.push(1);
				dfs(one, node.one);
			}
		};
		dfs(new DynamicBitArray(), this.root);
	}

	public encode(data: Uint8Array): DynamicBitArray {
		const output = new DynamicBitArray();

		// Simply replace each symbol with it's code
		for (const byte of data) {
			output.append(this.codeTable[byte]);
		}

		return output;
	}

	public decode(encoded: DynamicBitArray): Uint8Array {
		const output = [];

		// Follow the tree according to incoming bits
		let current = this.root;
		for (const bit of encoded.bits()) {
			const next = bit ? current.one : current.zero;

			if (next instanceof LeafNode) {
				output.push(next.symbol);
				current = this.root;
			} else {
				current = next;
			}
		}

		return Uint8Array.from(output);
	}
}

export const byteFrequencies = (data: Uint8Array): number[] => {
	const freq = new Array(256);
	freq.fill(0);

	for (const byte of data) {
		freq[byte]++;
	}

	return freq;
};
