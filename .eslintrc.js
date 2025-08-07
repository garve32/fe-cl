module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'prettier/prettier',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
  ],
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'prettier/prettier': [
      'off',
      {
        endOfLine: 'auto',
      },
    ],
    'react/prop-types': ['off'],
    'tailwindcss/classname-order': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    'import/no-unresolved': 'off',
  },
};
