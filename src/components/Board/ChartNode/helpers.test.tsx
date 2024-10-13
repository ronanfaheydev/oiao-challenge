import { formatObservationDate, generateColor, getColor } from "./helpers";

describe("getColor", () => {
	it("should return a color", () => {
		const color = getColor("test");
		expect(color).toBe("#304");
	});
});

describe("generateColor", () => {
	it("should return a color", () => {
		const color = generateColor("test");
		expect(color).toBe("#304");
	});
});

describe("formatObservationDate", () => {
	it("should return a formatted date", () => {
		const date = formatObservationDate(1610962800000);
		expect(date).toBe("2021-01-18");
	});
});
