<template>
  <div class=" w-screen h-[7vh] flex justify-center items-center">
    <!-- 背景层 -->

    <!-- 内容层 -->
    
      
   <div class="flex-1 flex justify-center items-center w-full h-full  ">

      <div class=" flex items-center text-white text-2xl drop-shadow-lg justify-end flex-col w-full">
        <!-- SVG图标（示例为电量/闪电图标，可替换为你喜欢的） -->
         <div class="flex"> <svg class="w-7 h-7 mr-2 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg> <div class="tracking-widest from-cyan-500 to-white ">当日耗电总量</div>
       </div>
       
       
       <div style=" color: aqua;">
      <div color-green font-600 class="content" bg="~ dark/0">
        {{TotalElectrcity}}kw·h 
        <span :style="{ color: powerDiffDirection.includes('↑') 
                        ? 'red' 
                        : powerDiffDirection.includes('↓') 
                          ? 'lime' 
                          : 'gray' }">
  {{ powerDiffDirection }}kw·h
</span>
      </div>
    </div>
    </div>

    <div class=" flex items-center text-white text-2xl drop-shadow-lg justify-end flex-col w-full">
        <!-- SVG图标（示例为电量/闪电图标，可替换为你喜欢的） -->
         <div class="flex"> <svg class="w-7 h-7 mr-2 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg> <div class="tracking-widest from-cyan-500 to-white ">当日标准耗总电量</div>
       </div>
       
       
       <div style=" color: aqua;">
      <div color-green font-600 class="content" bg="~ dark/0">
        {{ powerStore.totalStandardPower }} kw·h
      </div>
    </div>
    </div>

    
      </div>
     
   
      
      <!-- 标题单独提取，不受 opacity 影响 -->
      <div class="tracking-wide text-5xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      flex  justify-center items-end flex-1">
        <div class="tracking-widest">注塑生产管理看板</div>
         
    </div>
  
   
      <div class="flex-1 flex justify-center items-center justify-around
      text-3xl font-bold bg-gradient-to-t from-cyan-500 to-white text-transparent bg-clip-text
      tracking-wide w-[300px] h-full pl-4 pr-4 ">
      <img src="@/assets/APOLLO.png" alt="" class="w-[50%]">
      <dv-border-box1 >
        <div class="text-xl flex justify-around  item-center text-white flex-col w-full h-full">
         
          {{ dateStr }}
          <div class="flex justify-center ">
            <Time></Time>
          </div>
          
        </div>
         
      </dv-border-box1>
      </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref,computed} from 'vue'
import Time from './time.vue'
import { useDateTime } from "./time";
import { usePowerStore } from '@/store/power';
const powerStore = usePowerStore();
const { dateStr } = useDateTime();
// import BorderBox from '@/components/datav/BorderBox.vue'

import { getElectricToday } from '@/api/getInjection'
const TotalElectrcity = ref(0)
const fetchChartData = async () => {
  try {
    const res = await getElectricToday()
    console.log(res)
    TotalElectrcity.value = res.data
    // 假设返回的数据结构为 { data: ... }
    console.log('今日耗电量数据:', res.data)
    console.log('今日耗电量数据:', TotalElectrcity.value)
    // 你可以把数据赋值给响应式变量
    // chartData.value = res.data
  } catch (e) {
    console.error('获取今日耗电量失败', e)
  }
}

const powerDiffDirection = computed(() => {
  const actual = Number(TotalElectrcity.value)
  const standard = Number(powerStore.totalStandardPower)

  if (isNaN(actual) || isNaN(standard)) return ''  // 安全处理
  if (actual > standard) {
    const delta = Number(actual - standard).toFixed(2)
    return '↑'+delta
  }
  if (actual < standard){
    const delta = standard-actual  
    return '↓' + delta
  } 
  return '-' // 表示相等
})

onMounted(()=>{
  fetchChartData()
})
</script>

<style></style>