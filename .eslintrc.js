module.exports = {
  root: true,
  parser: 'babel-eslint',
  'extends': [
    'standard',
    'standard-react',
    'prettier',
    'prettier/react'
  ],
  plugins: [
    'babel',
    'react',
    'prettier'
  ],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  globals: {
    '__DEV__': false,
    '__COVERAGE__': false,
    '__TEST__': false,
    StackdriverErrorReporter: false,
    Raven: false
  },
  rules: {
    semi: [2,'never'],
    'no-console': 'error',
    'jsx-quotes': [
      'error',
      'prefer-double'
    ],
    'no-return-await': 2,
    'node/no-deprecated-api': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none',
        semi: false,
        bracketSpacing: true,
        jsxBracketSameLine: true,
        printWidth: 80,
        tabWidth: 2,
        useTabs: false
      }
    ]
  }
}