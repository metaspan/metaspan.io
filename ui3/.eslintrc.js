module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    'plugin:vue/base',
    'plugin:vuetify/base'
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
  },
}
