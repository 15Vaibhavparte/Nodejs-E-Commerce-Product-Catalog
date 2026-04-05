import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
        },
        languageOptions: {
            globals: {
                // This tells ESLint we are in a Node.js environment
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly"
            }
        }
    }
];