<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getGoodsRate } from '@/api/getScmInfo.js';
import { eventBus } from '@/utils/eventbus';

// 1. 响应式数据
const rawData = ref([]);
const qualityIndicators = ref(null);
let chartInstance = null;

// 3. 监听数据变化，确保获取数据后绘制
watch(rawData, () => {
  nextTick(() => drawIndicators()); 
}, { deep: true, immediate: true });

// 4. 获取 API 数据
const fetchData = () => {
  getGoodsRate()
    .then(res => {
      rawData.value = res.data;
    })
    .catch(() => {
    });
};

// 5. 初始化 ECharts
const drawIndicators = () => {
  if (!qualityIndicators.value) return;

  // 确保 ECharts 初始化时父容器已有大小
  chartInstance = echarts.init(qualityIndicators.value);
  updateChart();

  // 监听窗口大小变化，使图表自适应
  window.addEventListener('resize', resizeChart);
};

// 6. 图表更新
const updateChart = () => {
  if (!chartInstance) return;

  const option = {
    grid: {
      left: '3%',
      bottom: '3%',
      containLabel: true
    },
  color: ['#8F87F1', '#C68EFD'], // 不同颜色的条形
  title: {
    text: '到货及时率',
    top: '2%',
    left: '2%',
    textStyle: {
      color: '#ffffff',
      fontSize: 25,
      fontWeight: 'bold',
      fontFamily: 'Microsoft YaHei',
      letterSpacing: 2
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params) => {
      return `${params.name}: ${(params.value * 100).toFixed(2)}%`
    }
  },
  legend: {
    data: ['应到数量', '实到数量'],
    top: '10%',
    left: 'center',
    textStyle: {
      color: '#ffffff'
    }
  },
  xAxis: {
    type: 'category',
    data: rawData.value.map(item => item.purchaserName),
    axisLabel: {
      color: '#ffffff'
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: '#ffffff'
    }
  },
  series: [
  {
      name: '实到数量',
      type: 'bar',
      data: rawData.value.map(item => Number(item.total) - Number(item.bjsNum) || 0),
      barWidth: '35%',
      label: {
        show: true,
        position: 'top', // 放置在柱子顶部
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',

      }
    },
    {
      name: '应到数量',
      type: 'bar',
      data: rawData.value.map(item => item.total),
      barWidth: '35%',
      label: {
        show: true,
        position: 'top', // 放置在柱子顶部
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
  ]
};
chartInstance.setOption(option);
};

// 7. 监听窗口变化，自适应图表
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 8. 页面挂载时获取数据
onMounted(() => {
  fetchData();
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 9. 组件卸载时移除监听事件
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  window.removeEventListener('resize', resizeChart);
  
});
</script>

<template>
  <div class="Qualifiedrate">
    <dv-border-box8 :dur="5">
      <div class="dv-bg pt-2 flex">
         
        <div ref="qualityIndicators" class="chart-container flex-5 "></div>
                  <!-- 数值展示区域 -->
        <div class="flex-2 pr-8">
          <div v-if="rawData.length" class="data-list flex flex-col justify-around h-full">
            <div v-for="(item, index) in rawData" :key="index" class="data-item bg-[#8f88f7]  rounded-lg flex h-[10%] flex items-center pl-1">
              <div class="data-title text-white text-sm font-semibold flex-1">{{ item.purchaserName }}:</div>
              <div class="data-detail   text-white text-sm flex-4 flex justify-around flex">
                <span>应到: <span class="font-semibold flex-1">{{ item.total }} 件</span></span>
                <span>实到: <span class="font-semibold flex-1">{{ Number(item.total) - Number(item.bjsNum) }} 件</span></span>
                <span>及时率: <span class="font-semibold flex-1 text-cyan-300">{{ 100-item.ratio }}%</span></span>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="text-white">暂无数据</p>
          </div>
        </div>
        
      </div>
    </dv-border-box8>
  </div>
</template>

<style scoped>
/* dv-bg 作为父容器，确保它有大小 */
.dv-bg {
  width: 100%;
  height: 100%; /* 可调整 */

}

/* ECharts 图表容器 */
.chart-container {
  width: 100%;
  height: 100%;
}
.Qualifiedrate {
  width: 100%;
  height: 100%;
}

.dv-bg {
  display: flex;
  height: 100%;
}

</style>