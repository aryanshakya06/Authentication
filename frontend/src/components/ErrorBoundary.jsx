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
                <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
                    <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                        <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            An unexpected error occurred. Reloading the page usually fixes it.
                        </p>
                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="mt-6 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
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
