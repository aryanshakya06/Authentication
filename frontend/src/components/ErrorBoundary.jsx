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
                <div className="center-screen center-screen--full">
                    <div className="form-card text-center">
                        <h1 className="form-card__title">Something went wrong</h1>
                        <p style={{ marginTop: 8, fontSize: 14, color: "var(--fg-muted)" }}>
                            An unexpected error occurred. Reloading the page usually fixes it.
                        </p>
                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="btn btn--primary"
                            style={{ marginTop: 24 }}
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
