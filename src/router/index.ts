import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/index.vue';
import Screen from '../views/Screen/index.vue';
import Project from '../views/TotalScreen/ProdeucePlan/index.vue';
import Quality from '../views/TotalScreen/quality/index.vue';
import Injection from '@/views/Injection/views/index.vue'
import SCM from '@/views/SCM/views/index.vue'
import WMS from '@/views/WMS/index.vue'
import InComing from '@/views/Metalworking/index.vue' 
import  NEWSCM from '@/views/NewSCM/index.vue' // 这里是新 SCM 的路径
import ProducePlan from '@/views/ProducePlan/index.vue'
import PLM from '@/views/PLM/index.vue'
import MaterialManagement from '@/views/MaterialsManagement/index.vue'
import  PressBoard from '@/views/Stamp/management/index.vue'
import  paint from '@/views/Paint/management/index.vue'
import  welding2 from '@/views/Welding2/management/index.vue'
import StampManagement from '@/views/Welding/management/index.vue'
import FinicialKpi from '@/views/Finance/index.vue'
import Qualitykpi from '@/views/QualityKPIDashboard/index.vue'
import SalesPerformanceDashboard from '@/views/SalesPerformanceDashboard/index.vue'
import BudgetvsActualPerformanceDashboard from '@/views/BudgetvsActualPerformanceDashboard/index.vue'
import EnergyMonitoringDashboard from '@/views/EnergyMonitoringDashboard/index.vue'
import ManufacturingPerformanceManagementDashboard from '@/views/ManufacturingPerformanceManagementDashboard/index.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/home'
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
  {
    path: '/wms',
    name: 'WMS',
    component: WMS,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/incoming',
    name: 'InComing',
    component: InComing,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/newscm',
    name: 'NEWSCM',
    component: NEWSCM,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/produceplan',
    name: 'ProducePlan',
    component: ProducePlan,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/plm',
    name: 'PLM',
    component: PLM,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
    {
    path: '/materialmanagement',
    name: 'MaterialManagement',
    component: MaterialManagement,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/stampmanagement',
    name: 'StampManagement',
    component: StampManagement,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/welding2',
    name: 'welding2',
    component: welding2,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  // 冲压看板
  {
    path: '/pressboard',
    name: 'PressBoard',
    component: PressBoard,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/paint',
    name: 'paint',
    component: paint,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path:'/financialkpi',
    name:'FinicialKpi',
    component:FinicialKpi,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path:'/qualitykpidashboard',
    name:'Qualitykpi',
    component:Qualitykpi,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/SalesPerformanceDashboard',
    name: 'SalesPerformanceDashboard',
    component: SalesPerformanceDashboard,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/SalesPerformanceDashboard',
    name: 'SalesPerformanceDashboard',
    component: SalesPerformanceDashboard,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/BudgetvsActualPerformanceDashboard',
    name: 'BudgetvsActualPerformanceDashboard',
    component: BudgetvsActualPerformanceDashboard,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/EnergyMonitoringDashboard',
    name: 'EnergyMonitoringDashboard',
    component: EnergyMonitoringDashboard,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
  {
    path: '/ManufacturingPerformanceManagementDashboard',
    name: 'ManufacturingPerformanceManagementDashboard',
    component: ManufacturingPerformanceManagementDashboard,
    props: (route) => ({ prodLine: route.query.prodLine }) // 通过 query 获取 prodLine
  },
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
