import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';  // 引入 vue-router 配置文件
import DataVVue3 from '@kjgl77/datav-vue3'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia'
import '@/styles/dialog-fix.css';
import Vue3Marquee from 'vue3-marquee'
import Title from './components/title.vue'
import ScrollBoard from './components/datav/ScrollBoard.vue'
import '@/style.css'
import '@/styles/theme.css'

import VueDOMPurifyHTML from "vue-dompurify-html"

// 设置全局错误处理器（必须在所有其他导入之前）
import './utils/globalErrorHandler.js'
// 修复ECharts重复注册错误（必须在其他组件之前）
import './utils/echartsFix.js'
// 修复Three.js材质错误（必须在其他组件之前）
import './utils/threeErrorHandler.js'
// 初始化ECharts（必须在其他组件之前）
import './utils/initEcharts.js'

// function setRootFontSize() {
//   const baseSize = 16; // 设计稿默认 100% 缩放时 html 的 font-size
//   const scale = 1 / window.devicePixelRatio;
//   document.documentElement.style.fontSize = `${baseSize * scale}px`;
// }

// // 初始化
// setRootFontSize();

// // 监听窗口缩放（可选）
// window.addEventListener('resize', setRootFontSize);


const app = createApp(App);

app.component('GlobalTitle', Title) // 注册全局组件（名字你可以改）
app.component('ScrollBoard', ScrollBoard) // 注册滚动面板组件

app
  .use(router)
  .use(createPinia())
  .use(DataVVue3)
  .use(ElementPlus)
  .use(Vue3Marquee)
  .use(VueDOMPurifyHTML)
  .mount('#app');
