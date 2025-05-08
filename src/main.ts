import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 引入 vue-router 配置文件
import DataVVue3 from '@kjgl77/datav-vue3'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/style.css'
import { createPinia } from 'pinia'
import Vue3Marquee from 'vue3-marquee'
import Title from './components/title.vue'

const app = createApp(App);

app.component('GlobalTitle', Title) // 注册全局组件（名字你可以改）

app
  .use(router)
  .use(createPinia())
  .use(DataVVue3)
  .use(ElementPlus)
  .use(Vue3Marquee)
  .mount('#app');
