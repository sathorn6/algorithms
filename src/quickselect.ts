/**
 * Returns the value that would be at the kth position in the sorted array, i.e. the kth smallest value.
 * Time complexity: O(N)
 */
export function quickselect<V>(
	array: V[],
	compare: (a: V, b: V) => number,
	k: number
): V {
	if (k < 0 || k > array.length - 1) {
		throw new Error(`Index ${k} is out of bounds.`);
	}

	const swap = (a: number, b: number) => {
		const tmp = array[a];
		array[a] = array[b];
		array[b] = tmp;
	};

	const select = (start: number, end: number): V => {
		let numElements = end - start + 1;

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
			if (compare(v, pivotValue) > 0) {
				throw new Error(`Invalid partial sorting because ${v} > ${pivotValue}`);
			}
		}
		for (const v of largerValues) {
			if (compare(v, pivotValue) <= 0) {
				throw new Error(
					`Invalid partial sorting because ${v} <= ${pivotValue}`
				);
			}
		}

		if (finalPivotPosition === k) {
			// We found k
			return array[finalPivotPosition];
		}

		// Select in the half that k falls into
		return finalPivotPosition > k
			? select(start, finalPivotPosition - 1)
			: select(finalPivotPosition + 1, end);
	};

	return select(0, array.length - 1);
}
