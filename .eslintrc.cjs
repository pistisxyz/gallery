module.exports = {
	root: true,
	extends: ['plugin:svelte/recommended'],
	parser: '@babel/eslint-parser',
	overrides: [{ files: ['*.svelte'], processor: 'svelte-eslint-parser' }],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
