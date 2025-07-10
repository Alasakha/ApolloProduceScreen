<template>
  <dv-border-box-1 class="box1 h-full">
    <div class="flex justify-between items-center px-4">
      <GlobalTitle title="当日小时产能" />
      <PlanSetting :prod-line="prodLine" @update-data="fetchData" />
    </div>

    <!-- 图表区域 -->
    <div class="h-[3%]"></div>
    <div ref="monthlyIndicators" class="w-full h-[95%]"></div>
  </dv-border-box-1>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getCapacityHour } from '@/api/getProduceinfo';
import { useEcharts } from '@/utils/useEcharts';
import { eventBus } from '@/utils/eventbus';
import { createChartOption } from './dailyCharts';
import PlanSetting from '@/views/TotalScreen/ProdeucePlan/Line2/components/PlanSetting.vue';

const route = useRoute();
const prodLine = route.query.prodLine;

const monthlyIndicators = ref(null);
const categories = ref([]);
const values = ref([]);
const standard = ref([]);
const alignedPlanNumbers = ref([]); // 用于存储对齐后的计划数据
const alignedRemarks = ref([]); // 添加备注数据
const alignedDuties = ref([]); // 添加责任人数据
const alignedCarModels = ref([]); // 添加车型数据

// 处理数组数据到对象格式
const processArrayToObject = (array, keyField = 'hour2', valueField = 'total') => {
  const obj = {};
  array.forEach(item => {
    obj[item[keyField]] = item[valueField];
  });
  return obj;
};

// 处理数组数据到对象格式（用于备注和责任人）
const processArrayToObjectWithReason = (array, keyField = 'hour2', valueField = 'reason') => {
  const obj = {};
  array.forEach(item => {
    obj[item[keyField]] = item[valueField] || '';
  });
  return obj;
};

// 更新计划数据
const updatePlanNumbers = (data) => {
  // 先重置所有数值为0
  const planNumbers = Array(24).fill(0);
  // 遍历对象，把值按键减一作为数组索引赋值
  for (const key in data) {
    const index = parseInt(key, 10) - 1;
    planNumbers[index] = parseInt(data[key], 10);
  }
  return planNumbers;
};

// 对齐计划数据与实际工作时间
const alignPlanNumbersWithCategories = (planNumbers) => {
  alignedPlanNumbers.value = categories.value.map(hour => {
    const hourNum = parseInt(hour);
    return planNumbers[hourNum - 1] || 0;
  });
};

// 对齐备注与实际工作时间
const alignRemarksWithCategories = (remarks) => {
  alignedRemarks.value = categories.value.map(hour => {
    const hourNum = parseInt(hour);
    return remarks[hourNum - 1] || '';
  });
};

// 对齐责任人与实际工作时间
const alignDutiesWithCategories = (duties) => {
  alignedDuties.value = categories.value.map(hour => {
    const hourNum = parseInt(hour);
    return duties[hourNum - 1] || '';
  });
};

// 对齐车型与实际工作时间
const alignCarModelsWithCategories = (carModels) => {
  alignedCarModels.value = categories.value.map(hour => {
    const hourNum = parseInt(hour);
    return carModels[hourNum - 1] || '';
  });
};

const processActualData = (hourData) => {
  const completeCategories = [];
  const completeValues = [];
  // 横坐标 7~23
  for (let hour = 8; hour <= 24; hour++) {
    completeCategories.push(hour.toString());
    completeValues.push(hourData[hour] || 0);
  }
  return { completeCategories, completeValues };
};  

// 请求数据 & 渲染图表
const fetchData = () => {
  getCapacityHour(prodLine)
    .then((res) => {
      const data = res.data;
      
      if (!data || !data.columnarHour || data.columnarHour.length === 0) {
        return;
      }

      // 处理实际产能数据（columnarHour）
      const actualData = processArrayToObject(data.columnarHour, 'hour2', 'total');
      const { completeCategories, completeValues } = processActualData(actualData);
      categories.value = completeCategories;
      values.value = completeValues;

      // 处理PMC排产数据（planHour）
      const planData = processArrayToObject(data.planHour, 'hour2', 'total');
      const planValues = [];
      for (let hour = 8; hour <= 24; hour++) {
        planValues.push(planData[hour] || 0);
      }
      standard.value = planValues;

      // 处理车间小时产量数据（reasonHour）- 生产排产
      const workshopData = processArrayToObject(data.reasonHour, 'hour2', 'total');
      const workshopValues = [];
      for (let hour = 8; hour <= 24; hour++) {
        workshopValues.push(workshopData[hour] || 0); // hour2="8" 已经代表 7-8 时段
      }
      alignedPlanNumbers.value = workshopValues;

      // 处理备注数据
      const remarkData = processArrayToObjectWithReason(data.reasonHour, 'hour2', 'reason');
      const remarks = Array(24).fill('');
      for (const key in remarkData) {
        const index = parseInt(key) - 1;
        if (!isNaN(index)) {
          remarks[index] = remarkData[key];
        }
      }
      alignRemarksWithCategories(remarks);

      // 处理责任人数据
      const dutyData = processArrayToObjectWithReason(data.reasonHour, 'hour2', 'duty');
      const duties = Array(24).fill('');
      for (const key in dutyData) {
        const index = parseInt(key) - 1;
        if (!isNaN(index)) {
          duties[index] = dutyData[key];
        }
      }
      alignDutiesWithCategories(duties);

      // 处理车型数据
      const carModelData = processArrayToObjectWithReason(data.planHour, 'hour2', 'description');
      const carModels = Array(24).fill('');
      for (const key in carModelData) {
        const index = parseInt(key) - 1;
        if (!isNaN(index)) {
          carModels[index] = carModelData[key];
        }
      }
      alignCarModelsWithCategories(carModels);

      // 等待 DOM 渲染后初始化图表
      nextTick(() => {
        initChart();
        const option = createChartOption({
          category: categories.value,
          value1: values.value,
          value2: standard.value,
          value3: alignedPlanNumbers.value,
          remarks: alignedRemarks.value,
          duties: alignedDuties.value,
          carModels: alignedCarModels.value
        });
        setOption(option);

        // 延迟 resize 等 DOM 宽高完全生效
        setTimeout(() => {
          resizeChart();
        }, 1000);
      });
    })
    .catch((err) => {
      console.error('数据请求失败：', err);
    });
};

// 引入 echarts 封装逻辑
const { initChart, setOption, resizeChart } = useEcharts(monthlyIndicators);

// 监听刷新事件
onMounted(() => {
  fetchData();
  eventBus.on('refreshData', fetchData);  
});

// 清理事件监听
onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
  .box1 {
  width: 50%;
  display: flex;
  flex-direction: column; /* 改为纵向排列 */
  font-size: 18px;
  color: aliceblue;
  min-height: 0 !important; /* 覆盖默认的最小高度 */
}

:deep(.dv-border-box-1) {
  min-height: 0 !important;
  height: 100% !important;
}

:deep(.dv-border-svg-container) {
  min-height: 0 !important;
  height: 100% !important;
}

:deep(.border-box-content) {
  min-height: 0 !important;
  height: 100% !important;
}

:deep(.el-button) {
  background: #1890ff;
  border: none;
  padding: 8px 15px;
  height: auto;
  font-size: 0.8vw;
}

/* :deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #303030;
} */
/* 
:deep(.el-dialog__title) {
  color: #fff;
}

:deep(.el-dialog__body) {
  color: #fff;
  max-height: 60vh;
  overflow-y: auto;
} */

:deep(.el-input-number) {
  width: 120px;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
