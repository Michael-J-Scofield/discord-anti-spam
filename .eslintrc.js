module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "standard"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [ "error", "tab" ],
        "no-tabs": 0,
        "@typescript-eslint/no-unused-vars": [2, { args: "none" }]
    }
};