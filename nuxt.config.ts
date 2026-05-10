// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt"],
  devServer: {
    port: Number(process.env.VITE_PORT) || 3000
  },
  runtimeConfig: {
    public: {
      appPort: Number(process.env.VITE_PORT) || 3000
    }
  }
})