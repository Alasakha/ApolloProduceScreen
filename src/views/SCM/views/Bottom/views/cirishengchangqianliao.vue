<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { nextTick } from 'vue';
import { getWarningNextDay1,getWarningNextDay2 } from '@/api/getScmInfo.js';
import {getNextDay} from './nextday'
import { eventBus } from '@/utils/eventbus';
import * as echarts from 'echarts';

const rawData = ref([[], []]);  // 使用一个数组来保存两份数据
const name = ref<any[]>([[], []]);  // 使用二维数组
const config1 = reactive({
  header: ['排产时间', '客户单号','工单单号','供应商代号','品号','品名','采购员','欠料数量'],
  data: [],
  index: true,
  align: ['center'],
  carousel: 'page',
  waitTime: 5000,
  headerHeight: 25,
  columnWidth:[50, 120, 150, 200, 120, 140, 150, 100],
});

const config2 = reactive({
  header: ['排产时间', '客户单号','工单单号','供应商代号','品号','品名','采购员','欠料数量'],
  data: [],
  index: true,
  align: ['center'],
  carousel: 'page',
  waitTime: 5000,
  headerHeight: 25,
  columnWidth:[50, 120, 150, 200, 120, 140, 150, 100],
});
let chartInstance: any = null; // 图表实例
const dialogVisible = ref(false);
const selectedItem = ref<any>({});
  const detailHeaders = [
  '排产时间',
  '客户单号',
  '工单单号',
  '供应商代号',
  '品号',
  '品名',
  '采购员',
  '欠料数量',
];


// 获取数据并转换
const fetchData = () => {
  getWarningNextDay1()
    .then((res) => {
      rawData.value[0] = res.data; // 保存原始数据
      // 转换数据为二维数组
      const nextday = getNextDay()
      name.value[0] = rawData.value[0].map((item: any) => {
        // const totalNumber = parseFloat(item.total); // 确保转换为数字
        return [nextday,item.customerOrderNo, item.orderNo,item.supplierCode,item.itemNo,item.itemName,item.purchaserName	, Math.round(Number(item.purchaseQuantity))] // 转为数字并四舍五入]; // 保留整数部分
      });
      // 将转换后的数据更新到 config1.data 中
      config1.data = name.value[0]
      console.log('config1',config1.data);
      
    })
    .catch(() => {
      console.log('数据获取失败');
    });
    getWarningNextDay2()
    .then((res) => {
      const nextday = getNextDay()
      rawData.value[1] = res.data; // 保存原始数据
      // 转换数据为二维数组
      name.value[1] = rawData.value[1].map((item: any) => {
        // const totalNumber = parseFloat(item.total); // 确保转换为数字
        return [nextday,item.customerOrderNo, item.orderNo,item.supplierCode,item.itemNo,item.itemName,item.purchaserName,Math.round(Number(item.purchaseQuantity))] // 转为数字并四舍五入]; // 保留整数部分
      });
      // 将转换后的数据更新到 config1.data 中
      config2.data = name.value[1]
      console.log('config1',config2.data)
    })
    .catch(() => {
      console.log('数据获取失败');
    });
};


// 初始化图表
const initChart = () => {
  const chartContainer = document.querySelector('.chart-container') as HTMLElement; // 类型断言为 HTMLElement
  if (chartContainer) {
    chartInstance = echarts.init(chartContainer);
    // 配置图表的初始选项（根据需求调整）
    const option = {
      title: {
        text: '供应商欠料情况',
        left: 'center',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: name.value.map((item: any) => item[0]), // 使用供应商名称
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: name.value.map((item: any) => item[3]), // 使用欠料数量
          type: 'bar',
        },
      ],
    };
    chartInstance.setOption(option);
  } else {
    console.error('chart-container 元素未找到');
  }
};

// 监听窗口大小变化
const resizeChart = () => {
  console.log('Resizing chart...');
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
  <div class="qianliao h-[20vh]">
    <dv-border-box12 >
      <!-- 标题行 -->
    <div class="flex justify-around items-center">
      <h2 class="text-white font-bold text-sm pt-4 flex justify-center items-center">总装一课</h2>
      <h2 class="text-white font-bold text-xl pt-4 flex justify-center items-center">次日生产欠料预警</h2>
      <h2 class="text-white font-bold text-sm pt-4 flex justify-center items-center">总装二课</h2>
    </div>
      
      <div class="flex">
      <div class='w-[49vw]'>        
        <dv-scroll-board
          class="pl-4 pr-4 pt-2"
          :config="config1"
          style="width:100%;height:16vh"
          @click="clickHandler"
        />
</div>

<div class='w-[50vw]'>        
  <dv-scroll-board
  class="pl-4 pr-4 pt-2"
  :config="config2"
  style="width:100%;height:16vh"
  @click="clickHandler"
/>
</div>
</div>

      
      <div class="chart-container" style="width:100%; height:18vh;"></div>
    </dv-border-box12>
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
  height: 100%;
}
</style>