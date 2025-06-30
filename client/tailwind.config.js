export default {
  purge: [],
  darkMode: 'media', // or 'media' or 'class'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // very important!
    "./@/**/*.{js,ts,jsx,tsx}", // very important!
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... other tokens
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // required by ShadCN

  ],
}