export function quicksort<V>(array: V[], compare: (a: V, b: V) => number) {
	const swap = (a: number, b: number) => {
		const tmp = array[a];
		array[a] = array[b];
		array[b] = tmp;
	};

	const sort = (start: number, end: number) => {
		let numElements = end - start + 1;
		if (numElements <= 1) {
			return;
		}

		// Choose random index as pivot
		const pivot = start + Math.floor(Math.random() * numElements);
		const pivotValue = array[pivot];

		// Move pivot to the end
		swap(pivot, end);

		// Go over the rest of the array and move values larger than pivot to the right
		let current = start;
		let nextDestForLarger = end - 1; // Where to move the next larger value

		while (current <= nextDestForLarger) {
			if (compare(array[current], pivotValue) > 0) {
				swap(current, nextDestForLarger);
				nextDestForLarger--;
			} else {
				current++;
			}
		}

		// Swap the first value larger than pivot with the pivot that we stored at the end
		// This is the final sorted position for the pivot element
		// Note: If all values are smaller than pivot this swaps end with itself
		const finalPivotPosition = nextDestForLarger + 1;
		swap(end, finalPivotPosition);

		// Check for bugs
		const smallerOrEqValues = array.slice(start, finalPivotPosition);
		const largerValues = array.slice(finalPivotPosition + 1, end + 1);
		for (const v of smallerOrEqValues) {
			if (v > pivotValue) {
				throw new Error(`Invalid partial sorting because ${v} > ${pivotValue}`);
			}
		}
		for (const v of largerValues) {
			if (v <= pivotValue) {
				throw new Error(
					`Invalid partial sorting because ${v} <= ${pivotValue}`
				);
			}
		}

		// Recursively sort the 2 halves
		sort(start, finalPivotPosition - 1);
		sort(finalPivotPosition + 1, end);
	};

	return sort(0, array.length - 1);
}
