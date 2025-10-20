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
  
  <div class='pl-5 pt-1'>
<div class="flex justify-center items-center text-lg text-white font-bold">
  <p class="tracking-widest text-xl ">注塑产品自检合格率</p>
</div>
    
    <ScrollBoard :config="config" style="width:97%;height:19vh;" @click='clickHandler'/>
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
import { getSelfCheck } from '@/api/getInjection';

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

const fetchData = async () => {
  try {
    isLoading.value = true;
    const res = await getSelfCheck();
    
    if (res && res.code === 200 && res.data && res.data.length > 0) {
      // 处理API返回的数据
      const processedData = res.data.map(item => {
        const productionQuantity = item.qty || 0;
        const scrapProducts = item.lot_att23 || 0;
        const defectiveProducts = item.lot_att24 || 0;
        const goodProducts = productionQuantity - scrapProducts - defectiveProducts;
        const passRate = productionQuantity > 0 ? ((goodProducts / productionQuantity) * 100).toFixed(1) : 0;
        
        return {
          machine: getMachineName(item.ty009),
          productionQuantity,
          goodProducts,
          defectiveProducts,
          scrapProducts,
          passRate: parseFloat(passRate)
        };
      });

      // 计算合计数据
      const totalProduction = processedData.reduce((sum, item) => sum + item.productionQuantity, 0);
      const totalGood = processedData.reduce((sum, item) => sum + item.goodProducts, 0);
      const totalDefective = processedData.reduce((sum, item) => sum + item.defectiveProducts, 0);
      const totalScrap = processedData.reduce((sum, item) => sum + item.scrapProducts, 0);
      const totalPassRate = totalProduction > 0 ? ((totalGood / totalProduction) * 100).toFixed(1) : 0;

      // 更新表格数据
      config.data = [
        ...processedData.map(item => [
          item.machine,
          item.productionQuantity.toString(),
          item.goodProducts.toString(),
          item.defectiveProducts.toString(),
          item.scrapProducts.toString(),
          item.passRate + '%'
        ]),
        [
          '合计',
          totalProduction.toString(),
          totalGood.toString(),
          totalDefective.toString(),
          totalScrap.toString(),
          totalPassRate + '%'
        ]
      ];

      isDataEmpty.value = false;
    } else {
      // 如果没有数据，显示暂无数据
      config.data = [
        ['HTF300注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
        ['HTF450注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
        ['HTF1600注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
        ['HTF2500注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
        ['合计', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
      ];
      isDataEmpty.value = true;
    }
  } catch (error) {
    console.error('获取注塑产品自检质量数据失败:', error);
    // 发生错误时显示暂无数据
    config.data = [
      ['HTF300注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
      ['HTF450注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
      ['HTF1600注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
      ['HTF2500注塑成型机', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据'],
      ['合计', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
    ];
    isDataEmpty.value = true;
  } finally {
    isLoading.value = false;
  }
};

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });


  const clickHandler = (row) => {
  selectedItem.value = row.row; // 直接保存整行
  dialogVisible.value = true;
};
</script>


<style scoped> 

:deep(.ScrollBoard .header) {
  background: rgba(79,142,247,0.3);
  font-size: 0.6vw;
  font-weight: bold;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item:hover) {
  background: rgba(79,142,247,0.1);
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
 