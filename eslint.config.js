    // eslint.config.js
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue
    },
    rules: {
      // 这里你可以自定义规则
    }
  },
  prettier // 使用 Prettier 做最后的格式统一
];
