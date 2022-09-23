module.exports = {
  "printWidth": 80,
  "importOrder": [
    "^@core/(.*)$",
    "^@server/(.*)$",
    "^@ui/(.*)$",
    "^[./]",
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  plugins: [
    require("prettier-plugin-tailwindcss"),
    require("@trivago/prettier-plugin-sort-imports"),
  ],
  tailwindConfig: "./tailwind.config.cjs",
};
