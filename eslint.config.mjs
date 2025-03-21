// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config';

export default createConfigForNuxt({
    features: {
        stylistic: {
            indent: 4,
            semi: true,
        },
    },
}).overrideRules({
    'vue/multi-word-component-names': 'off',
});
