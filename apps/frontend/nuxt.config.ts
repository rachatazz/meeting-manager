import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@primevue/nuxt-module"],

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".dark",
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
    },
  },

  typescript: {
    strict: true,
  },
});
