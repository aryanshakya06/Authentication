import React from "react";
import { APP_NAME } from "../../config/env.js";

export const Footer = () => (
    <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. Built by Aryan Shakya.
        </div>
    </footer>
);

export default Footer;
