type Char = string;

interface Match {
	index: number;
	string: string;
}

class Node {
	/// If the node is in the dictionary, word is the dictionary entry
	public word: string | null = null;
	/// Child nodes we can reach by char
	public children = new Map<Char, Node>();
	/// Link to the longest suffix that is in the graph
	public longestSuffix?: Node;
	/// Link to the longest suffix that is also a dictionary entry
	public longestDictionarySuffix?: Node;

	constructor(public char?: Char, public parent?: Node, public dbg?: string) {}

	/// Iterate over suffixes from longest to shortest
	public *suffixes(): Generator<Node> {
		let current: Node | undefined = this;
		while ((current = current.longestSuffix)) {
			yield current;
		}
	}

	/// Iterate over dictionary suffixes from longest to shortest
	public *dictionarySuffixes(): Generator<Node> {
		let current: Node | undefined = this;
		while ((current = current.longestDictionarySuffix)) {
			yield current;
		}
	}
}

export class AhoCorasick {
	private root = new Node();

	constructor(dictionary: string[]) {
		// Construct trie
		for (const word of dictionary) {
			let current = this.root;
			for (let i = 0; i < word.length; i++) {
				const char = word[i];
				const isLast = i === word.length - 1;

				if (current.children.has(char)) {
					current = current.children.get(char)!;
				} else {
					// Create node if it doesn't exist
					const node = new Node(char, current, word.slice(0, i + 1));
					current.children.set(char, node);
					current = node;
				}

				if (isLast) {
					current.word = word;
				}
			}
		}

		// Use BFS to build the longestSuffix links
		const queue = [...this.root.children.values()];
		let node;
		while ((node = queue.shift())) {
			let current: Node | undefined = node.parent!;

			// Traverse the suffixes of the parent (already built due to BFS)
			while (current !== this.root) {
				current = current.longestSuffix ?? this.root; // Root is implicit suffix of all nodes

				// Try to extend the parent's suffix with our char
				if (current.children.has(node.char!)) {
					// If so it's the longest suffix
					node.longestSuffix = current.children.get(node.char!);
					break;
				}
			}

			queue.push(...node.children.values());
		}

		// Use DFS to traverse all nodes and build longestDictionarySuffix
		const dfs = (node: Node) => {
			// Find the longest (first) suffix that has is in the dictionary
			for (const suffix of node.suffixes()) {
				if (suffix.word !== null) {
					node.longestDictionarySuffix = suffix;
					break;
				}
			}

			node.children.forEach(dfs);
		};
		dfs(this.root);
	}

	public search(input: string): Match[] {
		let matches: Match[] = [];

		let current: Node | undefined = this.root;
		position: for (let pos = 0; pos < input.length; pos++) {
			const char = input[pos];

			do {
				if (current!.children.has(char)) {
					current = current!.children.get(char)!;
					if (current.word) {
						matches.push({
							index: pos - current.word.length + 1,
							string: current.word,
						});
					}
					for (const dictionarySuffix of current.dictionarySuffixes()) {
						matches.push({
							index: pos - dictionarySuffix.word!.length + 1,
							string: dictionarySuffix.word!,
						});
					}
					continue position;
				}
			} while ((current = current!.longestSuffix));

			current = this.root;
		}

		return matches;
	}
}
