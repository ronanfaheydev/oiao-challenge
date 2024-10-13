import { render } from "@testing-library/react";
import { useIsMobile } from "./useIsMobile";

const TestComponent = () => {
	const isMobile = useIsMobile();

	return <div>{isMobile ? "Mobile" : "Desktop"}</div>;
};
describe("useIsMobile", () => {
	test("should return true if window.innerWidth is less than 600", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 599,
		});

		const { getByText } = render(<TestComponent />);
		getByText("Mobile");
	});

	test("should return false if window.innerWidth is greater than 768", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 800,
		});

		const { getByText } = render(<TestComponent />);
		getByText("Desktop");
	});
});
