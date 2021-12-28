import { Heap } from "./Heap";

type Quantity = number;
type Price = number;

type Side = "buy" | "sell";
const otherSide = (side: Side) => (side === "buy" ? "sell" : "buy");

type OrderId = number;

type Order =
	| { type: "limit"; side: Side; quantity: Quantity; limit: Price }
	| { type: "market"; side: Side; quantity: Quantity };
const getPriceLimit = (order: Order): Price => {
	switch (order.type) {
		case "limit":
			return order.limit;
		case "market":
			return order.side === "buy" ? Infinity : -Infinity;
	}
};

type OpenOrder = { id: OrderId; quantity: Quantity; limit: Price };
const compareOrder = (side: Side) => (a: OpenOrder, b: OpenOrder) => {
	if (a.limit === b.limit) {
		// FIFO when price is equal
		return a.id - b.id;
	}
	return side === "sell" ? a.limit - b.limit : b.limit - a.limit;
};

type Trade = {
	buyOrderId: OrderId;
	sellOrderId: OrderId;
	quantity: Quantity;
	price: Price;
};

type ProcessedOrder = {
	id: OrderId;
	executedTrades: Trade[];
};

export class Market {
	private nextOrderId = 1;
	private getNextOrderId() {
		return this.nextOrderId++;
	}

	private openOrders: {
		sell: Heap<OpenOrder>;
		buy: Heap<OpenOrder>;
	};

	constructor() {
		this.openOrders = {
			sell: new Heap([], compareOrder("sell")),
			buy: new Heap([], compareOrder("buy")),
		};
	}

	public processOrder(order: Order): ProcessedOrder {
		const executedTrades: Trade[] = [];

		const newOrder = {
			id: this.getNextOrderId(),
			quantity: order.quantity,
			limit: getPriceLimit(order),
		};

		const openOtherOrders = this.openOrders[otherSide(order.side)];
		while (newOrder.quantity) {
			const otherOrder = openOtherOrders.peekTop();
			if (!otherOrder) {
				break;
			}

			const [buyOrder, sellOrder] =
				order.side === "buy" ? [newOrder, otherOrder] : [otherOrder, newOrder];
			if (buyOrder.limit < sellOrder.limit) {
				break;
			}

			if (newOrder.quantity < otherOrder.quantity) {
				// Partially fill other with new order
				otherOrder.quantity -= newOrder.quantity;
				executedTrades.push({
					buyOrderId: buyOrder.id,
					sellOrderId: sellOrder.id,
					quantity: newOrder.quantity,
					price: otherOrder.limit,
				});
				newOrder.quantity = 0;
			} else {
				// Fill new order partially with other
				newOrder.quantity -= otherOrder.quantity;
				executedTrades.push({
					buyOrderId: buyOrder.id,
					sellOrderId: sellOrder.id,
					quantity: otherOrder.quantity,
					price: otherOrder.limit,
				});
				openOtherOrders.pop();
			}
		}

		if (order.type === "limit" && newOrder.quantity) {
			this.openOrders[order.side].push(newOrder);
		}

		return { id: newOrder.id, executedTrades };
	}
}
