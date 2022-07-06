/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: "#ed4c49",
          secondary: "#071f77",
          accent: "#302ded",
          neutral: "#221D2B",
          "base-100": "#FDFCFD",
          info: "#5583D3",
          success: "#44DA96",
          warning: "#E69719",
          error: "#F25F7F",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
