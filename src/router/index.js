import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/index.vue';
import Screen from '../views/Screen/index.vue';
import Project from '../views/TotalScreen/ProdeucePlan/index.vue';
import Quality from '../views/TotalScreen/quality/index.vue';
import Injection from '@/views/Injection/views/index.vue'
import SCM from '@/views/SCM/views/index.vue'
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/screen',
    name: 'ProductionLine', // 修改为没有 :id 动态参数的路径
    component: Screen,
    props: (route) => ({ prodLine: route.query.prodLine }), // 传递查询参数 prodLine
  },
  {
    path: '/project',
    name: 'Project',
    component: Project,
    props: (route) => ({ prodLine: route.query.prodLine }), // 传递查询参数 prodLine
  },
  {
    path: '/quality',
    name: 'Quality',
    component: Quality,
    props: (route) => ({ prodLine: route.query.prodLine }), // 传递查询参数 prodLine
  },
  {
    path: '/injection',
    name: 'Injection',
    component: Injection,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/scm',
    name: 'SCM',
    component: SCM,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
