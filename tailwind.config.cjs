/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './main.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        markdown: '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
      },
    },
  },
  plugins: [],
}
