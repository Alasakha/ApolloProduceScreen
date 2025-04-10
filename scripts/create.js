import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('__dirname:', __dirname); // 打印 __dirname，查看路径

const pageName = process.argv[2];
console.log('pageName:', pageName); // 打印传入的参数

if (!pageName) {
  console.error('❌ 请提供页面名，例如：node create.js 首页');
  process.exit(1);
}

// 使用 path.join() 拼接路径
const viewsDir = path.join(__dirname, '../src/views', pageName);
const componentsDir = path.join(__dirname, '../src/components', pageName);

// 打印出拼接后的路径来检查
console.log('viewsDir:', viewsDir);
console.log('componentsDir:', componentsDir);

if (fs.existsSync(viewsDir) || fs.existsSync(componentsDir)) {
  console.error('❌ 页面或组件已存在，请更换页面名');
  process.exit(1);
}

fs.mkdirSync(viewsDir, { recursive: true });
fs.mkdirSync(componentsDir, { recursive: true });
console.log(`📁 创建文件夹：views/${pageName} 和 components/${pageName}`);

const vueTemplate = `<template>
  <div class="${pageName}">
    ${pageName} 页面
  </div>
</template>

<script setup>
</script>

<style scoped>
.${pageName} {
  /* 样式写这里 */
}
</style>
`;

fs.writeFileSync(path.join(viewsDir, 'index.vue'), vueTemplate);
fs.writeFileSync(path.join(componentsDir, 'index.vue'), vueTemplate);

console.log('✅ 页面和组件 index.vue 生成完毕');