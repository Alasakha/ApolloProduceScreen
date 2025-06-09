<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { nextTick } from 'vue';
import { getWarningNextDay } from '@/api/getScmInfo.js';
import {getNextDay} from './nextday'
import { eventBus } from '@/utils/eventbus';
import * as echarts from 'echarts';

const rawData = ref([[], []]);  // 使用一个数组来保存两份数据
const name = ref<any[]>([[], []]);  // 使用二维数组
const config1 = reactive({
  header: ['排产时间', '客户单号','供应商代号','品号','品名','采购员','欠料数量'],
  data: [],
  index: true,
  align: ['center','center','center','center','center','center','center'],
  carousel: 'page',
  waitTime: 5000,
  headerHeight: 25,
  columnWidth:[],
  rowNum: 5,
  showTooltip:true,
});

const config2 = reactive({
  header: ['排产时间', '客户单号','供应商代号','品号','品名','采购员','欠料数量'],
  data: [],
  index: true,
  align: ['center','center','center','center','center','center','center'],
  carousel: 'page',
  waitTime: 5000,
  headerHeight: 25,
  columnWidth:[],
  rowNum: 5,
  showTooltip:true,
});

let chartInstance: any = null; // 图表实例
const dialogVisible = ref(false);
const selectedItem = ref<any>({});
  const detailHeaders = [
  '排产时间',
  '客户单号',
  '供应商代号',
  '品号',
  '品名',
  '采购员',
  '欠料数量',
];


// 获取数据并转换
const fetchData = () => {
  getWarningNextDay()
    .then((res) => {
      const zzyk = res.data.zzyk || [];
      const zzek = res.data.zzek || [];

      rawData.value[0] = zzyk;
      rawData.value[1] = zzek;

      const nextday = getNextDay();

      // 总装一课
      name.value[0] = zzyk.map((item: any) => {
        return [
          nextday,
          item.customerOrderNo,
          item.supplierCode,
          item.itemNo,
          item.itemName,
          item.purchaserName,
          Math.round(Number(item.purchaseQuantity))
        ];
      });

      // 总装二课
      name.value[1] = zzek.map((item: any) => {
        return [
          nextday,
          item.customerOrderNo,
          item.supplierCode,
          item.itemNo,
          item.itemName,
          item.purchaserName,
          Math.round(Number(item.purchaseQuantity))
        ];
      });

      // 设置 config 数据，若为空则添加提示
      config1.data = name.value[0].length
        ? name.value[0]
        : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']];

      config2.data = name.value[1].length
        ? name.value[1]
        : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']];
    })
    .catch(() => {
      console.log('数据获取失败');
      config1.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']];
      config2.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']];
    });
};


// 初始化图表
const initChart = () => {
  const chartContainer = document.querySelector('.chart-container') as HTMLDivElement;
  if (!chartContainer) {
    console.error('chart-container 元素未找到');
    return;
  }

  // 确保有数据
  if (!name.value || !name.value[0] || !name.value[0].length) {
    console.warn('暂无图表数据');
    return;
  }

  chartInstance = echarts.init(chartContainer);
  
  // 配置图表的初始选项
  const option = {
    title: {
      text: '供应商欠料情况',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: name.value[0].map((item: any) => item[2]), // 使用供应商代号
      axisLabel: {
        color: '#fff',
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '欠料数量',
        data: name.value[0].map((item: any) => item[6]), // 使用欠料数量
        type: 'bar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        }
      }
    ]
  };

  chartInstance.setOption(option);
};

// 监听窗口大小变化
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

onMounted(() => {
  eventBus.on('refreshData', fetchData);
  fetchData();
  
  // 确保 DOM 渲染完成再初始化图表
  nextTick(() => {
    initChart();
  });

  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  // 移除全局事件监听
  eventBus.off('refreshData', fetchData);

  // 销毁图表实例
  if (chartInstance) {
    chartInstance.dispose();
  }

  // 移除窗口大小变化监听器
  window.removeEventListener('resize', resizeChart);
});



const clickHandler = (row: any) => {
  console.log('点击了行数据:', row.row);
  selectedItem.value = row.row; // 直接保存整行
  dialogVisible.value = true;
};
</script>

<template>
  <div class="qianliao h-[20vh] pl-4 pr-4">
    <dv-border-box12 >
      <!-- 标题行 -->
      <div class="flex justify-around items-center">
        <h2 class="text-white font-bold text-xl pt-4 flex justify-center items-center">总装一课</h2>
        <h2 class="text-white font-bold text-2xl pt-4 flex justify-center items-center">次日生产欠料预警</h2>
        <h2 class="text-white font-bold text-xl pt-4 flex justify-center items-center">总装二课</h2>
      </div>
      
      <div class="box flex w-full max-w-full">
        <div class="w-1/2 px-2 box-border">
          <ScrollBoard
            class="pt-2"
            :config="config1"
            style="width: 100%; height: 16vh"
            @click="clickHandler"
          />
        </div>

        <div class="w-1/2 px-2 box-border">
          <ScrollBoard
            class="pt-2"
            :config="config2"
            style="width: 100%; height: 16vh"
            @click="clickHandler"
          />
        </div>
      </div>
    </dv-border-box12>

    <!-- 添加图表容器 -->
    <!-- <div class="chart-container mt-4" style="height: 300px;"></div> -->
  </div>

  <!-- 弹窗部分 -->
  <el-dialog v-model="dialogVisible" title="详细信息" width="50%">
    <div v-for="(label, index) in detailHeaders" :key="index" class="mb-2">
      <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
    </div>
  </el-dialog>
</template>

<style scoped>
.chart-container {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 1rem;
}

.qianliao {
  display: flex;
  flex-direction: column;
}
</style>