import { Component } from "react";
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("ATSlay crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "#fecaca",
          padding: "24px",
          fontFamily: "monospace",
          fontSize: "14px",
          whiteSpace: "pre-wrap",
        }}>
          <h2 style={{ color: "#fca5a5", marginBottom: "12px" }}>ATSlay hit an error</h2>
          <p>{String(this.state.error.message || this.state.error)}</p>
          <p style={{ marginTop: "16px", color: "#94a3b8", fontSize: "12px" }}>
            {this.state.error.stack}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
