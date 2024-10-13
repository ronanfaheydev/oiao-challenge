import { render } from "@testing-library/react";
import { Chart } from "./Chart";

describe("ChartNode", () => {
	test("should render", () => {
		render(<Chart />);
	});
});
