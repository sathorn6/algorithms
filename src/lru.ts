interface KeyValuePair<K, V> {
	key: K;
	value: V;
}

export class LRUCache<K, V> {
	private queue = new DoublyLinkedDeque<KeyValuePair<K, V>>();
	private nodes = new Map<K, Node<KeyValuePair<K, V>>>();

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

		this.queue.moveToEnd(node);

		return node.data.value;
	}

	public set(key: K, value: V) {
		if (this.nodes.has(key)) {
			// Just update the node
			const node = this.nodes.get(key)!;
			node.data.value = value;
			this.queue.moveToEnd(node);
			return;
		}

		const node = this.queue.append({ key, value });
		this.nodes.set(key, node);

		if (this.nodes.size > this.capacity) {
			// Evict LRU
			const evicted = this.queue.dequeue()!;
			this.nodes.delete(evicted.data.key);
		}
	}
}

interface Node<T> {
	prev?: Node<T>;
	next?: Node<T>;
	data: T;
}

class DoublyLinkedDeque<T> {
	private head?: Node<T>;
	private tail?: Node<T>;

	public append(data: T): Node<T> {
		const node: Node<T> = {
			data,
		};

		if (!this.tail) {
			// First insert
			this.head = node;
		} else {
			// Append node to end of queue
			this.tail.next = node;
			node.prev = this.tail;
		}
		this.tail = node;

		return node;
	}

	public dequeue(): Node<T> | null {
		if (!this.head) {
			return null;
		}

		const head = this.head;
		if (this.head.next) {
			this.head.next.prev = undefined;
		}
		this.head = this.head.next;

		return head;
	}

	public moveToEnd(node: Node<T>) {
		if (!node.next) {
			// Node is already at the end
			return;
		}

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
}
