/** @type {import('prettier').Options} */

module.exports = {
  semi: false,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/index.css",
};
