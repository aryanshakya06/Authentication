import React from "react";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../config/env.js";

export const Footer = () => (
    <footer className="mt-auto border-t border-line bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="grid gap-8 md:grid-cols-4">
                <div>
                    <div className="flex items-center gap-2 font-semibold text-fg">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand text-on-brand text-sm font-bold">A</span>
                        {APP_NAME}
                    </div>
                    <p className="mt-3 text-sm text-fg-faint">
                        Production-style authentication that ships secure by default.
                    </p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Product</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li><Link to="/" className="text-fg-muted hover:text-fg">Overview</Link></li>
                        <li><Link to="/register" className="text-fg-muted hover:text-fg">Get started</Link></li>
                        <li><Link to="/login" className="text-fg-muted hover:text-fg">Sign in</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Resources</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li><a href="#" className="text-fg-muted hover:text-fg">API reference</a></li>
                        <li><a href="#" className="text-fg-muted hover:text-fg">Architecture</a></li>
                        <li><a href="#" className="text-fg-muted hover:text-fg">Security notes</a></li>
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-fg-faint">Company</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li><a href="#" className="text-fg-muted hover:text-fg">About</a></li>
                        <li><a href="#" className="text-fg-muted hover:text-fg">Contact</a></li>
                        <li><a href="#" className="text-fg-muted hover:text-fg">Privacy</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-line pt-4 text-xs text-fg-faint sm:flex-row">
                <p>&copy; {new Date().getFullYear()} {APP_NAME}. Built by Aryan Shakya.</p>
                <p>MIT licensed. Educational project.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
