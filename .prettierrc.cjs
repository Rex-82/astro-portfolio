/** @type {import('prettier').Config} */
module.exports = {
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	useTabs: true,

	plugins: [require.resolve("prettier-plugin-astro")],

	overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
