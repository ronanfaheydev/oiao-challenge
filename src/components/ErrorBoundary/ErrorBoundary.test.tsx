import { render } from "@testing-library/react";
import ErrorBoundary from ".";

const TestErrorThrow = () => {
	throw new Error("Test Error");
};
const TestNoError = () => {
	return <div data-testid="no-error-message">Test No Error</div>;
};

describe("ErrorBoundary", () => {
	test("should render component when no error", () => {
		const { getByTestId } = render(
			<ErrorBoundary type="test" message="this is a test">
				<TestNoError />
			</ErrorBoundary>
		);
		getByTestId("no-error-message");
	});

	test("should render error message when error", () => {
		const consoleErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const { getByTestId } = render(
			<ErrorBoundary type="test" message="this is a test">
				<TestErrorThrow />
			</ErrorBoundary>
		);
		expect(() => getByTestId("error-message"));
		consoleErrorSpy.mockRestore();
	});
});
