import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../config/env.js";

export const Footer = () => (
    <footer className="footer">
        <div className="footer__inner">
            <div className="footer__cols">
                <div className="footer__col">
                    <div className="brand" style={{ marginBottom: 12 }}>
                        <span className="brand__mark">A</span>
                        <span>{APP_NAME}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--fg-faint)", margin: 0 }}>
                        Production-style authentication that ships secure by default.
                    </p>
                </div>
                <div className="footer__col">
                    <h4>Product</h4>
                    <Link to="/">Overview</Link>
                    <Link to="/register">Get started</Link>
                    <Link to="/login">Sign in</Link>
                </div>
                <div className="footer__col">
                    <h4>Resources</h4>
                    <a href="#">API reference</a>
                    <a href="#">Architecture</a>
                    <a href="#">Security notes</a>
                </div>
                <div className="footer__col">
                    <h4>Company</h4>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                    <a href="#">Privacy</a>
                </div>
            </div>
            <div className="footer__legal">
                <p>&copy; {new Date().getFullYear()} {APP_NAME}. Built by Aryan Shakya.</p>
                <p>MIT licensed. Educational project.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
