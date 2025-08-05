/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,css}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1850px',
      '4xl': '2500px',
    },
    extend: {
      colors: {
        // 确保所有颜色都可用
        red: {
          500: 'rgb(239, 68, 68)',
        },
        orange: {
          500: 'rgb(249, 115, 22)',
        },
        yellow: {
          500: 'rgb(234, 179, 8)',
        },
        green: {
          500: 'rgb(34, 197, 94)',
        },
        blue: {
          500: 'rgb(59, 130, 246)',
        },
        indigo: {
          500: 'rgb(99, 102, 241)',
        },
        purple: {
          500: 'rgb(168, 85, 247)',
        },
        pink: {
          500: 'rgb(236, 72, 153)',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // 确保这些类被生成
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'sm:bg-orange-500',
    'md:bg-yellow-500',
    'lg:bg-green-500',
    'xl:bg-blue-500',
    '2xl:bg-indigo-500',
    '3xl:bg-purple-500',
    '4xl:bg-pink-500',
  ],
}

