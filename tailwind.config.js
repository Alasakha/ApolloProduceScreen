// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,css}', // ← 加入 .css
  ],
  theme: {
    extend: {
      screens: {
        hd: '1600px',
        fhd: '1920px',
        '2k': '2560px',
        '4k': '3840px',
      },
    },
  },
  plugins: [],
}

