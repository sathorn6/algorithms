# Algorithms

Various algorithms and data structures implemented for educational purposes.

## Heap ([Heap.ts](./src/Heap.ts))

A heap is a data structure for storing items while providing efficient access to the smallest element in it.

The order is specified by a compare function passed to the constructor.

See also: [Binary Heap](https://en.wikipedia.org/wiki/Binary_heap).

### Example

```ts
const minHeap = new Heap([2, 1, 3], compareNumbers);
minHeap.push(4);
minHeap.pop(); // -> 1
minHeap.replaceTop(5);
minHeap.peekTop(); // -> 3
minHeap.pushAndPop(6); // -> 3
```

## Quicksort ([quicksort.ts](./src/quicksort.ts))

A popular sorting algorithm.

See also: [Quicksort](https://en.wikipedia.org/wiki/Quicksort).

### Example

```ts
quicksort([2, 3, 1], compareNumbers); // -> [1, 2, 3]
```

## Quickselect ([quickselect.ts](./src/quickselect.ts))

A partitioning algorithm that will find the _k_-th smallest element in an array and place it at index _k_ in the array.
All elements before it will be smaller-or-equal and all elements after it will be larger-or-equal.

Therefore, the algorithm can be used to find the top _k_ elements.

See also: [Quickselect](https://en.wikipedia.org/wiki/Quickselect).

### Example

```ts
quickselect([5, 3, 1, 4, 2], compareNumbers, 2); // -> [2, 1, 3, 5, 4]
```

## Huffman Coding ([HuffmanTree.ts](./src/HuffmanTree.ts))

Huffman coding is a compression algorithm. It uses the frequency of bytes in the input data to establish a variable bit-width encoding, where more frequent bytes will have a shorter encoding than less frequent ones.

See also: [Huffman Coding](https://en.wikipedia.org/wiki/Huffman_coding).

### Example

```ts
const data = Uint8Array.from([1, 2, 3]);
const tree = new HuffmanTree(byteFrequencies(data));
const encoded = tree.encode(data); // -> DynamicBitArray 111100
const decoded = tree.decode(encoded); // Uint8Array [1, 2, 3]
```

## Least Recently Used Cache ([LRUCache.ts](./src/LRUCache.ts))

A cache with a fixed capacity. When the capacity is exceeded, it will evict the least recently used entry.

See also: [LRU Cache](https://www.geeksforgeeks.org/lru-cache-implementation/).

### Example

```ts
const cache = new LRUCache(1);
cache.set(1, "one");
cache.set(2, "two");
cache.get(1); // -> undefined
cache.get(2); // -> "two"
```

## Aho-Corasick ([AhoCorasick.ts](./src/AhoCorasick.ts))

A string search algorithm that is able to efficiently search for multiple strings at the same time.

See also: [Aho-Corasick algorithm](https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm).

### Example

```ts
const ahoCorasick = new AhoCorasick(["apple", "banana", "cherry"]);
ahoCorasick.search("pudding apple banana cherry the world wonders");
// -> [
//	{ index: 8, string: "apple" },
//	{ index: 14, string: "banana" },
//	{ index: 21, string: "cherry" },
// ];
```

## Market ([Market.ts](./src/Market.ts))

A market where buy and sell orders can be submitted and will be executed against each other.
It supports `limit` and `market` order types.

### Example

```ts
const market = new Market();
market.processOrder({
	type: "limit",
	side: "sell",
	quantity: 10,
	limit: 5,
});
const result = market.processOrder({
	type: "limit",
	side: "buy",
	quantity: 10,
	limit: 10,
});
result.executedTrades; // -> [{ sellOrderId: 1, buyOrderId: 2, quantity: 10, price: 5 }]
```
