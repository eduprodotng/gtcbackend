// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
// import { fixupConfigRules } from "@eslint/compat";

// export default [
//   { files: ["**/*.{js,mjs,cjs,jsx}"] },
//   { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...fixupConfigRules(pluginReactConfig),
// ];

// eslint.config.js

// eslint.config.js

// eslint.config.js
const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginReactConfig = require("eslint-plugin-react/configs/recommended.js");
const { fixupConfigRules } = require("@eslint/compat");

module.exports = {
  files: ["**/*.{js,mjs,cjs,jsx}"],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  globals: {
    browser: true, // Adjust based on your globals needs
  },
  plugins: [pluginJs, "react"],
  extends: [pluginJs.configs.recommended, "plugin:react/recommended"],
  rules: {
    // Additional rules if needed
  },
};
