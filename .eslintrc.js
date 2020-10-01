module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	'env': {
		'es2017': true,
		'node': true
	},
	rules: {
		'semi': ['error', 'never'],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'no-trailing-spaces': ['warn',],
		'quotes': ['warn', 'single',],
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', },],
	},
}