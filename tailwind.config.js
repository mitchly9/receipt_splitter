/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        lightBackground: "#282828",
        darkBackground: "#121212",
        accent: "#878454",
      },
      textColor: {
        lightFont: "#F1F1ED",
        darkFont: "FFFFFF",
        darkBackground: "#121212",
        accent: "#878454",
        trueColor: "#5cb85c",
        falseColor: "#d9534f",
      },
      borderColor: {
        lightBackground: "#F1F1ED",
        darkBackground: "#454651",
        accent: "#878454",
        trueColor: "#5cb85c",
        falseColor: "#d9534f",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        title: 48,
        heading: 26,
        subheading: 18,
        text: 12,
      },
    },
  },
  plugins: [],
};
