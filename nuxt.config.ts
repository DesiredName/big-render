export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
    ssr: false,
    devtools: { enabled: true },
    future: { compatibilityVersion: 4 },
    compatibilityDate: '2024-11-01',
    eslint: {
        config: { stylistic: true },
    },
});
