import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 引入 vue-router 配置文件
import DataVVue3 from '@kjgl77/datav-vue3'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/style.css'
import { createPinia } from 'pinia'


createApp(App)
  .use(router)
  .use(createPinia()) // 注册 pinia
  .use(DataVVue3) // 注册 vue-router
  .use(ElementPlus)
  .mount('#app');
