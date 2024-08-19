import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
    theme: {
    extend: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        colors: {
            'branco': '#f9fafb',
            'cinza-claro': '#4b5563',
            'cinza': '#1f2937',
            'cinza-escuro': '#030712',
            'azul': '#1fb6ff',
            'roxo': '#7e5bef',
            'rosa': '#ff49db',
            'laranja': '#ff7849',
            'verde': '#13ce66',
            'amarelo': '#ffc82c'
        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
            mono: ['Inconsolata', 'SFMono-Regular'],
        },
        extend: {
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            maxHeight: {
                '128': '32rem',
            }
        }
    }
  }
}