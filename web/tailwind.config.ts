import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 🎨 Paleta principal */
        background: "var(--background)",
        foreground: "var(--foreground)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        /* Marca principal */
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },

        /* Marca secundária */
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },

        /* Destaques (ex: botões de ação, ícones ativos) */
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },

        /* Ações destrutivas */
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },

      /* 🧩 Raio de bordas e tipografia */
      borderRadius: {
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
      },

      /* 🔆 Sombra padrão */
      boxShadow: {
        soft: "0 6px 18px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
}

export default config
