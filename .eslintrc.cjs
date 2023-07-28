// process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  root: true,
  extends: ['@antfu'],
  ignorePatterns: [
    '!*.d.ts',
    '!*.cjs',
  ],
  rules: {
    'no-console': 'off',
  },
}
