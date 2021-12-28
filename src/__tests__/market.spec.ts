import { Market } from "../market";

describe("Market", () => {
	describe("buy limit order", () => {
		it("fills a sell order with a buy order at sellers price", () => {
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

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 1, buyOrderId: 2, quantity: 10, price: 5 },
			]);
		});
		it("partially fills a sell order with a buy order", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});
			const result1 = market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 5,
				limit: 10,
			});
			const result2 = market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 20,
				limit: 10,
			});

			expect(result1.executedTrades).toEqual([
				{ sellOrderId: 1, buyOrderId: 2, quantity: 5, price: 5 },
			]);
			expect(result2.executedTrades).toEqual([
				{ sellOrderId: 1, buyOrderId: 3, quantity: 5, price: 5 },
			]);
		});
		it("fills a buy order with multiple sell orders", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 10,
			});
			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});
			const result = market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 15,
				limit: 10,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 2, buyOrderId: 3, quantity: 10, price: 5 },
				{ sellOrderId: 1, buyOrderId: 3, quantity: 5, price: 10 },
			]);
		});
		it("keeps a partially filled buy order", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});
			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 15,
				limit: 10,
			});
			const result = market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 10,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 3, buyOrderId: 2, quantity: 5, price: 10 },
			]);
		});

		it("fills buy orders at same price using FIFO", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 5,
				limit: 5,
			});
			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 5,
				limit: 5,
			});
			const result = market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 3, buyOrderId: 1, quantity: 5, price: 5 },
				{ sellOrderId: 3, buyOrderId: 2, quantity: 5, price: 5 },
			]);
		});
	});

	describe("buy market order", () => {
		it("fills orders at any price", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});
			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 10,
			});
			const result = market.processOrder({
				type: "market",
				side: "buy",
				quantity: 15,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 1, buyOrderId: 3, quantity: 10, price: 5 },
				{ sellOrderId: 2, buyOrderId: 3, quantity: 5, price: 10 },
			]);
		});

		it("ignores market orders that cant be filled", () => {
			const market = new Market();

			const result1 = market.processOrder({
				type: "market",
				side: "buy",
				quantity: 15,
			});
			const result2 = market.processOrder({
				type: "market",
				side: "sell",
				quantity: 100,
			});

			expect(result1.executedTrades).toEqual([]);
			expect(result2.executedTrades).toEqual([]);
		});

		it("will partially fill market orders", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});
			const result1 = market.processOrder({
				type: "market",
				side: "buy",
				quantity: 15,
			});
			const result2 = market.processOrder({
				type: "market",
				side: "sell",
				quantity: 100,
			});

			expect(result1.executedTrades).toEqual([
				{ sellOrderId: 1, buyOrderId: 2, quantity: 10, price: 5 },
			]);
			expect(result2.executedTrades).toEqual([]);
		});
	});

	describe("sell limit order", () => {
		it("fills a buy order with a sell order at buyers price", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 10,
			});
			const result = market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 10,
				limit: 5,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 2, buyOrderId: 1, quantity: 10, price: 10 },
			]);
		});
		it("partially fills a buy order with a sell order", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 10,
			});
			const result1 = market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 5,
				limit: 5,
			});
			const result2 = market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 20,
				limit: 10,
			});

			expect(result1.executedTrades).toEqual([
				{ sellOrderId: 2, buyOrderId: 1, quantity: 5, price: 10 },
			]);
			expect(result2.executedTrades).toEqual([
				{ sellOrderId: 3, buyOrderId: 1, quantity: 5, price: 10 },
			]);
		});
		it("fills a sell order with multiple buy orders", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 10,
			});
			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 5,
			});
			const result = market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 15,
				limit: 5,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 3, buyOrderId: 1, quantity: 10, price: 10 },
				{ sellOrderId: 3, buyOrderId: 2, quantity: 5, price: 5 },
			]);
		});
		it("keeps a partially filled sell order", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 10,
			});
			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 15,
				limit: 5,
			});
			const result = market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 10,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 2, buyOrderId: 3, quantity: 5, price: 5 },
			]);
		});
		it("fills sell orders at same price using FIFO", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 5,
				limit: 5,
			});
			market.processOrder({
				type: "limit",
				side: "sell",
				quantity: 5,
				limit: 5,
			});
			const result = market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 5,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 1, buyOrderId: 3, quantity: 5, price: 5 },
				{ sellOrderId: 2, buyOrderId: 3, quantity: 5, price: 5 },
			]);
		});
	});

	describe("sell market order", () => {
		it("fills orders at any price", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 10,
			});
			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 5,
			});
			const result = market.processOrder({
				type: "market",
				side: "sell",
				quantity: 15,
			});

			expect(result.executedTrades).toEqual([
				{ sellOrderId: 3, buyOrderId: 1, quantity: 10, price: 10 },
				{ sellOrderId: 3, buyOrderId: 2, quantity: 5, price: 5 },
			]);
		});

		it("ignores market orders that cant be filled", () => {
			const market = new Market();

			const result1 = market.processOrder({
				type: "market",
				side: "sell",
				quantity: 15,
			});
			const result2 = market.processOrder({
				type: "market",
				side: "buy",
				quantity: 100,
			});

			expect(result1.executedTrades).toEqual([]);
			expect(result2.executedTrades).toEqual([]);
		});

		it("will partially fill market orders", () => {
			const market = new Market();

			market.processOrder({
				type: "limit",
				side: "buy",
				quantity: 10,
				limit: 5,
			});
			const result1 = market.processOrder({
				type: "market",
				side: "sell",
				quantity: 15,
			});
			const result2 = market.processOrder({
				type: "market",
				side: "buy",
				quantity: 100,
			});

			expect(result1.executedTrades).toEqual([
				{ sellOrderId: 2, buyOrderId: 1, quantity: 10, price: 5 },
			]);
			expect(result2.executedTrades).toEqual([]);
		});
	});
});
