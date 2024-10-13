import { render } from "@testing-library/react";
import { Chart } from "./Chart";

describe("Chart", () => {
	test.skip("should render", () => {
		render(
			<Chart id="test" isLoading={false} onDateChange={() => {}} data={[]} />
		);
	});
});
