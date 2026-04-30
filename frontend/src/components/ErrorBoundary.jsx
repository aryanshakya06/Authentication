import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught:", error, info);
    }

    handleReload = () => window.location.reload();

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-page p-6">
                    <div className="max-w-md rounded-2xl border border-line bg-card p-8 text-center shadow-sm">
                        <h1 className="text-xl font-semibold text-fg">Something went wrong</h1>
                        <p className="mt-2 text-sm text-fg-muted">
                            An unexpected error occurred. Reloading the page usually fixes it.
                        </p>
                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-on-brand hover:bg-brand-hover"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
