// src/theme.js
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    tokens: {
      colors: {
        red: { value: "#EE0F0F" },
        "brand.50": { value: "#e3f2ff" },
        "brand.100": { value: "#b3d4ff" },
        "brand.500": { value: "#2563eb" },
        "brand.700": { value: "#1e40af" },
      },
      fonts: {
        heading: { value: "'Clash Display', sans-serif" },
        body: { value: "'Inter', sans-serif" }, // keep Inter or whatever body font you prefer
      },
    },
    semanticTokens: {
      colors: {
        danger: { value: "{colors.red}" },
        primary: { value: "{colors.brand.500}" },
      },
    },
  },
});

const theme = createSystem(defaultConfig, config);
export default theme;
