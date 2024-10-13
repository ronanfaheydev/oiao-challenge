import { Button, Card, CardActions, CardContent } from "@mui/material";
import React, { type ErrorInfo, type PropsWithChildren } from "react";
type ErrorBoundaryProps = PropsWithChildren<{ type: string; message: string }>;
const ErrorBoundary = class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
	state: { hasError: boolean; error?: Error };

	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(`[${this.props.type}]`, error, errorInfo);
		// logErrorToMyService(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Card>
					<CardContent data-testid="error-message">
						{this.props.message}
					</CardContent>
					<CardActions>
						<Button
							onClick={() => this.setState({ hasError: false })}
							data-testid="error-reset"
						>
							Try again
						</Button>
					</CardActions>
				</Card>
			);
		}

		return this.props.children;
	}
};

export default ErrorBoundary;
