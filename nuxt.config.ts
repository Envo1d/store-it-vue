// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
  ],
  runtimeConfig: {
    appwriteKey: "",
    public: {
      appwriteEndpoint: "",
      appwriteProject: "",
      appwriteDatabase: "",
      appwriteUsersCollection: "",
      appwriteFilesCollection: "",
      appwriteBucket: "",
      url: "",
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/assets/icons/logo-brand.svg",
        },
      ],
    },
  },
  css: ["@/assets/css/main.css"],
  shadcn: {
    prefix: "Ui",
    componentDir: "./components/ui",
  },
  fonts: {
    families: [
      {
        name: "Poppins",
        provider: "google",
        subsets: ["latin"],
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
    ],
  },
});
