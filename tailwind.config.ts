import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Tajawal", "system-ui", "sans-serif"] },
      colors: {
        navy: { 50:"#EEF4FB",100:"#D9E6F5",600:"#16406E",700:"#12325A",800:"#0F2A4A",900:"#0A1D36" },
        gold: { 400:"#D9B44A",500:"#C9A227",600:"#A98820" },
        whatsapp: "#25D366",
        bank: "#EFF6FF",
      },
      boxShadow: { soft: "0 10px 40px -12px rgba(15,42,74,.18)", card:"0 4px 24px -6px rgba(15,42,74,.12)" },
      borderRadius: { lg:"var(--radius)", md:"calc(var(--radius) - 2px)", sm:"calc(var(--radius) - 4px)" },
      keyframes: { "accordion-down":{from:{height:"0"},to:{height:"var(--radix-accordion-content-height)"}}, "accordion-up":{from:{height:"var(--radix-accordion-content-height)"},to:{height:"0"}} },
      animation: { "accordion-down":"accordion-down .2s ease-out", "accordion-up":"accordion-up .2s ease-out" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
