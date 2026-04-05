import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node, // This allows console, process, require, exports, etc.
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off", // We want to allow console.log for our server logs
            "no-undef": "error"
        },
    },
];