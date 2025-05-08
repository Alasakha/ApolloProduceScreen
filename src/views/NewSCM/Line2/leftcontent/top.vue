<!-- 

<template>
<dv-border-box8 :dur="5">
  <GlobalTitle title="当日来料质量异常问题统计"/>
    <dv-scroll-board :config="config" style="width: 94%; height:82%;  margin-left: 1vw;" @mouseover="mouseoverHandler" @click="clickHandler" />

  </dv-border-box8>
</template>

<script lang="ts" setup>
import {  reactive, onMounted } from 'vue'
import { getAbnormalQualityToday } from '@/api/getnewInjection'

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate());
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const queryDate = getYesterday(); // 昨天的日期
// 表格配置
const config = reactive({
  header: ['采购内勤', '供应商', '检验日期', '问题点', '处理完成时间',  '处理结果', '处理时长'],
  data: [],
  index: true,
  columnWidth: [50, 90, 100, 100, 90,90,90,90],
  align: ['center'],
  rowNum: 7
})

function formatDate(dateStr?: string): string {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

function getResultLabel(item: any): string {
  if (parseFloat(item.accepted_business_qty) > 0) return '允收'
  if (parseFloat(item.sp_receipt_business_qty) > 0) return '特采'
  if (parseFloat(item.scrap_business_qty) > 0) return '报废'
  if (parseFloat(item.return_business_qty) > 0) return '拒收'
  return '--'
}

// 获取接口数据并处理
onMounted(async () => {
  try {
    const res = await getAbnormalQualityToday(queryDate)
    const rawData = res?.data || []

    config.data = rawData.map(item => [
  item.purchaserName || '--',
  (item.supplierName || '').trim(),
  formatDate(item.startTime),
  item.description || '--',
  formatDate(item.endTime),
  getResultLabel(item),
  item.hourNum ? `${item.hourNum} 小时` : '--'
])
  } catch (error) {
    console.error('获取异常数据失败', error)
  }
})

const mouseoverHandler = (e: any) => {
  console.log(e)
}

const clickHandler = (e: any) => {
  console.log(e)
}
</script> -->
<template>
  <div class="content w-full h-full">
      <dv-border-box8 :dur="5">
          <!-- 标题 -->
          <GlobalTitle title="来料不合格各采购员占比" size="xl"/>


<!-- 图表容器 -->
<div class="chartsbox w-full h-[15vh] mt-4">
  <div ref="Indicators1" class="w-full h-full"></div>
 </div>  
</dv-border-box8>

  </div>
  
  </template>
  
  
  <script setup>
  import BigScreenTitle from '@/components/title.vue'
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { getPurchasePassRate } from '@/api/getnewInjection';
  import { useRoute } from 'vue-router';
  import { eventBus } from '@/utils/eventbus';
  import { formatPieChartData } from '@/utils/map';
  import * as echarts from 'echarts';
  import { createChartOption } from './leftcharts';
  
  const getYesterday = () => {
const date = new Date();
date.setDate(date.getDate() - 1);
const y = date.getFullYear();
const m = String(date.getMonth() + 1).padStart(2, '0');
const d = String(date.getDate()).padStart(2, '0');
return `${y}-${m}-${d}`;
};

const queryDate = getYesterday(); // 昨天的日期
  // Loading 和 数据为空的状态
  const isLoading = ref(true);
  const isDataEmpty = ref(false);
  const Indicators1 = ref(null);
  
  
  // 渲染图表的函数
  const drawMonthlyIndicators = (formattedData) => {
    nextTick(() => {
      const Indicators1Element = echarts.init(Indicators1.value);
      const option = createChartOption( formattedData ); // 先用写死的，不传 formattedData
      Indicators1Element.setOption(option);
    });
  };
  
  // 处理数据
  const processData = (data) => {
   const formattedData = formatPieChartData(data, 'purchaserName','bhgNum');
   console.log(formattedData)
    if (formattedData.length == 0) {
      isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
    } else {
      isDataEmpty.value = false;
      drawMonthlyIndicators(formattedData);  // 直接渲染图表
    }
  };
  
  // 请求数据x
  const fetchData = () => {
      getPurchasePassRate(queryDate).then(res => {
      isLoading.value = false;   // 加载完成，关闭 loading 状态
      processData(res.data);  // 处理数据并渲染图表
    }).catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
    });
  };
  
  onMounted(() => {
    fetchData(); // 组件挂载时先请求一次
    eventBus.on("refreshData", fetchData); // 监听全局刷新事件
  });
  
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });
  </script>
  
  
  
  
  <style scoped>
  
  </style>