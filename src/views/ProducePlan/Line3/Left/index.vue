<template>
    <div class="left  h-full flex-col flex">
      <dv-border-box12>
        <div dv-bg class="day-title">
          订单准交率
        </div>


    <div class="flex  items-center">
      
    <div class="desc2">本月累计</div>
    <div class="rate-row">  
      本月准交率：
      <span v-if="loadingMonth">加载中...</span>
      <span v-else>{{ monthData?.rate ?? '--' }}</span>
    </div>
 
<div class="flex justify-end">
  <dv-button
  class=" text-white text-lg font-semibold tracking-wide"
  :bg="false"
  @click="openDialog"
  color="#00eaff"
>
  详细信息
</dv-button>
</div>

</div>
      
<div ref="monthBarChart" class="bar-chart"></div>

        <div class='flex items-center'>
        <div class="desc2">今日</div>
        <div class="rate-row">
          今日准交率：<span v-if="loadingToday">加载中...</span>
          <span v-else>{{ todayData?.rate ?? '--' }}</span>
        </div>
      </div>
        <div ref="dayBarChart" class="bar-chart"></div>

           <!-- 弹窗 -->
     <TableDialog
    v-model="dialogVisible"
    :title= dialogTitle
    width="60vw"
    :tableData="gridData"
    :columns="gridColumns"
  />
      </dv-border-box12>
    </div>


  </template>
  

  <script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue'
  import * as echarts from 'echarts'
  import { getDeliveryRateMonthInfo, getDeliveryRateTodayInfo,getAbnormalUnfinishedList } from '@/api/getPmcinfo'
  import TableDialog from './dialog.vue'
  const monthData = ref<any>(null)
  const todayData = ref<any>(null)
  const loadingMonth = ref(true)
  const loadingToday = ref(true)  
  const prodLine = '1005' // 这里写死包装产线，如需动态可用props或route
  const monthBarChart = ref()
  const dayBarChart = ref()
  const dialogVisible = ref(false)
  const dialogTitle = ref('订单准交率');
  const gridData = ref([]);
  const gridColumns = [
  { prop: 'docNo', label: '工单单号' , width: '220'},
  // { prop: 'docId', label: '单据类型', width: '150' },
  { prop: 'customerOrderNo', label: '客户单号',width: '250' },
  { prop: 'planDate', label: '计划完成日期',width: '500' },
  { prop: 'completeDate', label: '实际完成日期',width: '300' },
  // { prop: 'planStatus', label: '备注',width: '250' },
];



  const renderMonthChart = () => {
    if (!monthBarChart.value || !monthData.value) return
    const chart = echarts.init(monthBarChart.value)
    const option = {
      color: ['#00eaff'],
      tooltip: { show: true },
      grid: { left: '8%', right: '8%', top: '12%', },
      xAxis: {
        type: 'category',
        data: ['计划数', '已完成'],
        axisLabel: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#00eaff', width: 2 } }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: { color: '#fff', fontSize: 16 }
      },
      series: [
        {
          type: 'bar',
          barWidth: '40%',
          data: [
            monthData.value.total ?? 0,
            monthData.value.completeNum ?? 0
          ],
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            fontSize: 18
          }
        }
      ]
    }
    chart.setOption(option)
  }
  
  const renderDayChart = () => {
    if (!dayBarChart.value || !todayData.value) return
    const chart = echarts.init(dayBarChart.value)
    const option = {
      color: ['#00eaff'],
      tooltip: { show: true },
      grid: { left: '8%', right: '8%', top: '12%'},
      xAxis: {
        type: 'category',
        data: ['计划数', '已完成'],
        axisLabel: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#00eaff', width: 2 } }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: { color: '#fff', fontSize: 16 }
      },
      series: [
        {
          type: 'bar',
          barWidth: '40%',
          data: [
            todayData.value.total ?? 0,
            todayData.value.completeNum ?? 0
          ],
          label: {
            show: true,
            position: 'top',
            color: '#fff',
            fontSize: 18
          }
        }
      ]
    }
    chart.setOption(option)
  }
  
  const fetchData = async () => {
    loadingMonth.value = true
    loadingToday.value = true
    try {
      const [monthRes, todayRes] = await Promise.all([
        getDeliveryRateMonthInfo(prodLine),
        getDeliveryRateTodayInfo(prodLine)
      ])
      monthData.value = monthRes.data
      todayData.value = todayRes.data
      await nextTick()
      renderMonthChart()
      renderDayChart()
    } catch (e) {
      monthData.value = null
      todayData.value = null
    } finally {
      loadingMonth.value = false
      loadingToday.value = false
    }
  }
  
  const openDialog = () =>{
    dialogVisible.value = true
    getAbnormalUnfinishedList()
    .then(res =>{
      gridData.value = res.data
    })
  }
  onMounted(fetchData)
  watch(monthData, () => nextTick(renderMonthChart))
  watch(todayData, () => nextTick(renderDayChart))
  </script>
  
  <style scoped>
  .day-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    font-size: 1vw;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
    border-bottom: 0.4vh solid #00bfff;
    padding:0.5vh 0  0vh 0;
  }
  .desc2 {
    font-size: 0.8vw;
    color: #00eaff;
    text-align: left;
    margin:0.5vh 0 0.5vh 2vw;
    font-weight: bold;
    letter-spacing: 0.1vw;
  }
  .bar-chart {
    width: 96%;
    height: 35%;
    background: rgba(0,32,64,0.25);
    border-radius: 1vw;
    box-shadow: 0 0 2vw #003366 inset;
  }
  .rate-row {
    text-align: left;
    font-size: 1vw;
    color: #00eaff;
    margin: 1vh 0 1vh 2vw;
    font-weight: bold;
    text-shadow: 0 0 1vw #003366;
    letter-spacing: 0.1vw;
  }
  </style>