module.exports = {
  extends: "productsway/react",
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'prettier.config.cjs'],
  rules: {
    "react/jsx-filename-extension": 0,
    "import/extensions": 0,
    "import/no-extraneous-dependencies": 0,
  },
};
