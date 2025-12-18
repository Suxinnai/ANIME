/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                anime: {
                    bg: '#FAFCFF',      // [保持] 晴朗天空底色
                    pink: '#FF8FAB',    // [保持] 樱花粉
                    blue: '#4CC9F0',    // [保持] 夏日蓝
                    yellow: '#FFD166',  // [保持] 柠檬黄
                    dark: '#2B2D42',    // [保持] 墨色（轮廓线）
                    text: '#2B2D42',

                    /* === 新增：暗黑模式专用色板 (Cyberpunk Night) === */
                    'dark-bg': '#121212',       // 极夜黑
                    'dark-surface': '#1E1E1E',  // 悬浮层深灰
                    'dark-border': '#333333',   // 柔和边框
                    'dark-text': '#E0E0E0',     // 护眼灰白
                },
            },
            fontFamily: {
                sans: ['Nunito', 'ZCOOL KuaiLe', 'system-ui', 'sans-serif'],
                display: ['Fredoka One', 'ZCOOL KuaiLe', 'cursive'],
                body: ['Nunito', 'sans-serif'],
            },
            boxShadow: {
                'comic': '4px 4px 0px 0px #2B2D42',
                'comic-hover': '6px 6px 0px 0px #2B2D42',
                'comic-sm': '2px 2px 0px 0px #2B2D42',

                /* 暗黑模式阴影（使用黑色，更深沉） */
                'dark-comic': '4px 4px 0px 0px #000000',
            },
            backgroundImage: {
                'halftone': 'radial-gradient(circle, #2B2D42 1px, transparent 1px)',
                'halftone-dark': 'radial-gradient(circle, #444444 1px, transparent 1px)',
            },
            animation: {
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
