<!-- <template>
  <div class='pl-5 pt-1'>
<div class="flex justify-center items-center text-lg text-white font-bold">
  <p class="tracking-widest text-xl">历史不良信息看板</p>
</div>
    
    <ScrollBoard :config="config" style="width:97%;height:19vh;" />
  </div> 
</template>
<script lang="ts" setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { getabnormalInfo } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';

// 初始化 配置对象
const config = reactive({
  header: ['工单单号','不良原因','责任部门', '责任人','时间', '品名','品号','规格'],
  data: [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']],
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [],
  headerHeight: 20,
  showTooltip: true
})

// 获取数据
const fetchData = async () => {
  try {
    const res = await getabnormalInfo(); // 获取接口数据
    if (res && res.data && res.data.length > 0) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.ta002 || '暂无数据',
        item.ngName || '暂无数据',
        item.admin_UNIT_NAME || '暂无数据',
        item.ngResponPeople || '暂无数据',
        item.createDate ? item.createDate.slice(0,16) : '暂无数据',
        item.mb002 || '暂无数据',
        item.ta006 || '暂无数据',
        item.mb003 || '暂无数据'
      ]);
    } else {
      config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
  }
}
// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});


  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });// 在组件挂载时获取数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
:deep(.ScrollBoard .header) {
  background: rgba(79,142,247,0.3);
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.6vw;
}

</style> -->

<template>
  <div class='pl-5 pt-1 h-full flex flex-col'>
    <!-- 标题 -->
    <div class="flex justify-center items-center text-lg text-white font-bold mb-2 ">
      <p class="tracking-widest text-xl">注塑产品质量监控</p>
    </div>
    
    <!-- 今日/本月检验指标 -->
    <div class="stats-row mb-2">
      <div class="stat-item">
        <div class="stat-label">今日检验工单数</div>
        <div class="stat-value">{{ todayStats.total }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">今日合格工单数</div>
        <div class="stat-value">{{ todayStats.hg }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">今日合格率</div>
        <div class="stat-value">{{ todayStats.rate }}%</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">本月检验工单数</div>
        <div class="stat-value">{{ monthStats.total }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">本月合格工单数</div>
        <div class="stat-value">{{ monthStats.hg }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">本月合格率</div>
        <div class="stat-value">{{ monthStats.rate }}%</div>
      </div>
    </div>
    
    <!-- 机台自检合格率表格 -->
    <!-- <div class="flex-1 mb-2 flex flex-col" style="overflow: hidden;">
      <ScrollBoard :config="config" style="width:97%;height:100%;" @click='clickHandler'/>
    </div> -->

    <!-- 不合格工单明细 -->
    <div class="flex-1 flex flex-col" style="overflow: hidden;">
      <div class="text-white font-bold mb-1 text-sm">不合格工单明细:</div>
      <div class="flex-1" >
        <ScrollBoard :config="defectiveConfig" style="width:97%;height:100%;" />
      </div>
    </div>
  </div>

  <!-- 弹窗部分 -->
<el-dialog v-model="dialogVisible" title="详细信息" width="50%">
  <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
    <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
  </div>
</el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, nextTick ,onBeforeUnmount,reactive} from 'vue';
import ScrollBoard from '@/components/datav/ScrollBoard.vue'
import * as echarts from 'echarts';
import { fetchClosingRateData } from './fetchMesData';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';
// import { getSelfCheck, getabnormalInfo } from '@/api/getInjection';
// import { getabnormalInfo } from '@/api/getInjection'; // 已注释，使用mock数据
import { getNgGdDetail } from '@/api/getInjection';
import { mockQualityStats, mockDefectiveData } from './mockData';
import { getZhsProductMonitoring } from '@/api/getInjection';

const dialogVisible = ref(false);//弹窗控制
const selectedItem = ref({});
const route = useRoute();
const prodLine = 'zhusu'
const monthlyIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const categories = ref([]); // X 轴数据
const values = ref([]); // Y 轴数据
let chartInstance = null;
const scrollBoardRef = ref(null);

// 今日/本月检验统计
const todayStats = ref({
  total: 0,
  hg: 0,
  rate: 0,
});

const monthStats = ref({
  total: 0,
  hg: 0,
  rate: 0,
});

const config = reactive({
  header: ['机台', '生产数量', '良品', '不良品', '废品', '自检合格率'],
  data: [
    ['HTF300注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
    ['HTF450注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
    ['HTF1600注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
    ['HTF2500注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
    ['合计', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
  ],
  index: true,
  columnWidth: [],
  align: ['center', 'center', 'center', 'center', 'center', 'center'],
  rowNum: 5,
  showTooltip: true,
})

// 不合格工单明细表格配置
const defectiveConfig = reactive({
  header: ['工单单号', '品名', '规格', '工单数', '不良数', '不良原因', '责任人'],
  data: [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']],
  index: true,
  columnWidth: [],
  align: ['center', 'center', 'center', 'center', 'center', 'center', 'center'],
  rowNum: 5,
  showTooltip: true,
})


// 机台ID到机台名称的映射
const getMachineName = (machineId) => {
  const machineMap = {
    '102050101001': 'HTF300注塑成型机',
    '102050101002': 'HTF450注塑成型机', 
    '102050101003': 'HTF1600注塑成型机',
    '102050101004': 'HTF2500注塑成型机'
  };
  return machineMap[machineId] || machineId;
};

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 获取不合格工单明细数据 - 本月数据
const fetchDefectiveData = async () => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDay = formatDate(startOfMonth);
    const endDay = formatDate(today);

    const res = await getNgGdDetail(startDay, endDay);
    if (res && res.code === 200 && Array.isArray(res.data) && res.data.length > 0) {
      defectiveConfig.data = res.data.map(item => [
        (item.ta002 && typeof item.ta002 === 'string') ? item.ta002.trim() : (item.ta002 || '暂无数据'), // 工单单号
        item.mb002 || '暂无数据', // 品名
        item.mb003 || '暂无数据', // 规格
        (item.plan_qty ?? item.ta015 ?? '暂无数据'), // 工单数
        (item.cjbhgNum ?? item.ngNO ?? '暂无数据'), // 不良数
        (item.ngName ?? item.ngReason ?? '暂无数据'), // 不良原因
        (item.ngResponPeople ?? item.peopleName ?? '暂无数据') // 责任人
      ]);
      return;
    }

    // 接口无数据时，回退到 mock 数据
    if (mockDefectiveData && mockDefectiveData.length > 0) {
      defectiveConfig.data = mockDefectiveData.map(item => [
        item.ta002 || '暂无数据',
        item.mb002 || '暂无数据',
        item.mb003 || '暂无数据',
        item.ta004 || '暂无数据',
        item.nums || '暂无数据',
        item.ngReason || '暂无数据',
        item.ngResponPeople || '暂无数据'
      ]);
    } else {
      defectiveConfig.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']];
    }
  } catch (error) {
    console.error('获取不合格工单明细失败:', error);
    defectiveConfig.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']];
  }
}

// 机台自检合格率表格数据获取函数（已注释，使用mock数据替代）
// const fetchData = async () => {
//   try {
//     isLoading.value = true;
//     const res = await getSelfCheck();
//     
//     if (res && res.code === 200 && res.data && res.data.length > 0) {
//       // 处理API返回的数据
//       const processedData = res.data.map(item => {
//         const productionQuantity = item.qty || 0;
//         const scrapProducts = item.lot_att23 || 0;
//         const defectiveProducts = item.lot_att24 || 0;
//         const goodProducts = productionQuantity - scrapProducts - defectiveProducts;
//         const passRate = productionQuantity > 0 ? ((goodProducts / productionQuantity) * 100).toFixed(1) : 0;
//         
//         return {
//           machine: getMachineName(item.ty009),
//           productionQuantity,
//           goodProducts,
//           defectiveProducts,
//           scrapProducts,
//           passRate: parseFloat(passRate)
//         };
//       });

//       // 计算合计数据
//       const totalProduction = processedData.reduce((sum, item) => sum + item.productionQuantity, 0);
//       const totalGood = processedData.reduce((sum, item) => sum + item.goodProducts, 0);
//       const totalDefective = processedData.reduce((sum, item) => sum + item.defectiveProducts, 0);
//       const totalScrap = processedData.reduce((sum, item) => sum + item.scrapProducts, 0);
//       const totalPassRate = totalProduction > 0 ? ((totalGood / totalProduction) * 100).toFixed(1) : 0;

//       // 更新表格数据
//       config.data = [
//         ...processedData.map(item => [
//           item.machine,
//           item.productionQuantity.toString(),
//           item.goodProducts.toString(),
//           item.defectiveProducts.toString(),
//           item.scrapProducts.toString(),
//           item.passRate + '%'
//         ]),
//         [
//           '合计',
//           totalProduction.toString(),
//           totalGood.toString(),
//           totalDefective.toString(),
//           totalScrap.toString(),
//           totalPassRate + '%'
//         ]
//       ];

//       // 计算合格检验工单数、合格工单数、合格率
//       const totalOrders = processedData.length;
//       const qualifiedOrders = processedData.filter(item => item.defectiveProducts === 0 && item.scrapProducts === 0).length;
//       const qualifiedRate = totalOrders > 0 ? ((qualifiedOrders / totalOrders) * 100).toFixed(1) : 0;
//       
//       qualityStats.value = {
//         qualifiedInspectionOrders: totalOrders,
//         qualifiedOrders: qualifiedOrders,
//         qualifiedRate: parseFloat(qualifiedRate)
//       };

//       isDataEmpty.value = false;
//     } else {
//       config.data = [
//         ['HTF300注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//         ['HTF450注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//         ['HTF1600注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//         ['HTF2500注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//         ['合计', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
//       ];
//       qualityStats.value = {
//         qualifiedInspectionOrders: 0,
//         qualifiedOrders: 0,
//         qualifiedRate: 0
//       };
//       isDataEmpty.value = true;
//     }
//   } catch (error) {
//     console.error('获取注塑产品自检质量数据失败:', error);
//     config.data = [
//       ['HTF300注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//       ['HTF450注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//       ['HTF1600注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//       ['HTF2500注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
//       ['合计', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
//     ];
//     qualityStats.value = {
//       qualifiedInspectionOrders: 0,
//       qualifiedOrders: 0,
//       qualifiedRate: 0
//     };
//     isDataEmpty.value = true;
//   } finally {
//     isLoading.value = false;
//   }
// };

// 获取今日检验统计（合格检验工单数、合格工单数、合格率）
const normalizeRate = (rate) => {
  if (rate === null || rate === undefined || rate === '') return 0;
  const num = Number(rate);
  if (Number.isNaN(num)) return 0;
  return Number(num.toFixed(1));
};

const deriveQualifiedRate = (total, hg, ngRate) => {
  const totalNum = Number(total);
  const hgNum = Number(hg);

  if (Number.isFinite(totalNum) && totalNum > 0 && Number.isFinite(hgNum) && hgNum >= 0) {
    return normalizeRate((hgNum / totalNum) * 100);
  }

  // 工单总数为 0 时直接返回 0%，避免显示 100%
  if (!totalNum) return 0;

  const ngRateNum = Number(ngRate);
  if (!Number.isFinite(ngRateNum)) return 0;

  if (ngRateNum <= 1) {
    return normalizeRate((1 - ngRateNum) * 100);
  }

  return normalizeRate(Math.max(0, 100 - ngRateNum));
};

const buildStatPayload = (data = {}) => {
  const total = data.total ?? 0;
  const hg = data.hg ?? 0;
  return {
    total,
    hg,
    rate: deriveQualifiedRate(total, hg, data.rate),
  };
};

const fetchQualityStats = async () => {
  try {
    const res = await getZhsProductMonitoring();
    if (res && res.code === 200 && res.data) {
      const { todayData = {}, monthData = {} } = res.data;

      todayStats.value = buildStatPayload(todayData);
      monthStats.value = buildStatPayload(monthData);
      return;
    }
  } catch (e) {
    console.error('获取今日检验统计失败:', e);
  }
  // 回退到 mock
  todayStats.value = buildStatPayload(mockQualityStats.today);
  monthStats.value = buildStatPayload(mockQualityStats.month);
};

// 统一的刷新函数
const refreshAllData = () => {
  // fetchData(); // 机台自检合格率表格数据获取（已注释）
  fetchQualityStats(); // 获取今日检验统计
  fetchDefectiveData(); // 获取不合格工单明细数据
};

// 在组件挂载时启动定时获取数据
onMounted(() => {
  refreshAllData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", refreshAllData); // 监听全局刷新事件
});

  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", refreshAllData); // 组件销毁时取消监听
  });


  const clickHandler = (row) => {
  selectedItem.value = row.row; // 直接保存整行
  dialogVisible.value = true;
};
</script>


<style scoped> 

/* :deep(.ScrollBoard .header) {
  background: rgba(79,142,247,0.3);
  font-size: 0.6vw;
  font-weight: bold;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item:hover) {
  background: rgba(79,142,247,0.1);
} */

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 0.8rem;
  /* height: clamp(90px, 8vh, 120px); */
  flex-wrap: wrap;
}

.stat-item {
  flex: 1 1 clamp(120px, 5vw, 220px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem 0.6rem;
  background: linear-gradient(180deg, rgba(0, 83, 159, 0.65), rgba(0, 36, 95, 0.65));
  border: 1px solid rgba(0, 174, 255, 0.4);
  border-radius: 6px;
  box-shadow: 0 0 12px rgba(0, 174, 255, 0.15);
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.55vw;
  color: rgba(255, 255, 255, 0.8);
}

.stat-value {
  font-size: 0.8vw;
  font-weight: bold;
  color: #00eaff;
  text-shadow: 0 0 12px rgba(0, 234, 255, 0.6);
}

h2 {
  top: 0.5vh;
  left: 1vw;
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
  color:white
}

</style>
 