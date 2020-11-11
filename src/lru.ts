interface Node<K, V> {
	prev?: Node<K, V>;
	next?: Node<K, V>;
	key: K;
	value: V;
}

export class LRUCache<K, V> {
	private nodes = new Map<K, Node<K, V>>();
	private head?: Node<K, V>;
	private tail?: Node<K, V>;
	private size = 0;

	constructor(private capacity: number) {
		if (capacity < 1) {
			throw new Error("Invalid capacity");
		}
	}

	public get(key: K): V | undefined {
		const node = this.nodes.get(key);
		if (!node) {
			return undefined;
		}

		// If node is not last already
		if (node.next) {
			// Remove it from the queue
			node.next.prev = node.prev;
			if (node.prev) {
				node.prev.next = node.next;
			}
			if (node === this.head) {
				this.head = node.next;
			}

			// Move to the end
			node.prev = this.tail;
			node.next = undefined;
			this.tail!.next = node;
			this.tail = node;
		}

		return node.value;
	}

	public set(key: K, value: V) {
		if (this.nodes.has(key)) {
			// Just update the node
			this.nodes.get(key)!.value = value;
			return;
		}

		const node: Node<K, V> = {
			key,
			value,
		};
		this.nodes.set(key, node);

		// Handle first insert
		if (!this.tail) {
			this.head = node;
			this.tail = node;
			this.size = 1;
			return;
		}

		// Append node to end of queue
		this.tail.next = node;
		node.prev = this.tail;
		this.tail = node;
		this.size++;

		if (this.size > this.capacity) {
			// Evict LRU
			this.head!.next!.prev = undefined;
			this.nodes.delete(this.head!.key);
			this.head = this.head!.next;
			this.size--;
		}
	}
}
