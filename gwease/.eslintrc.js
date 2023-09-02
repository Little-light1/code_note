module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: [
    //   "eslint:recommended", "plugin:@typescript-eslint/recommended"
    'airbnb',
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    'import/extensions': ['warn', {json: 'always', css: 'always'}],
    'react/prop-types': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/prefer-default-export': ['off'],
    'no-param-reassign': ['off'], // immer
    'func-names': ['off'],
    'react/display-name': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'jsx-a11y/interactive-supports-focus': ['off'], // html ele 语义不明
    'jsx-a11y/no-static-element-interactions': ['off'], // html ele 语义不明
    'no-lonely-if': ['off'], // 不能单独
    'prefer-destructuring': ['off'], // 不能使用array[index]
    'no-restricted-syntax': ['off'],
    'react/jsx-props-no-spreading': ['off'],
    '@typescript-eslint/no-unused-expressions': ['off'],
    'no-prototype-builtins': ['off'],
    'react/require-default-props': ['off'],
    'react/function-component-definition': [2, {namedComponents: 'arrow-function'}],
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
