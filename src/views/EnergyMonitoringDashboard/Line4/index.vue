<template>
  <div class="h-full w-full">
    <div class="flex w-full h-full justify-between gap-2">
      <!-- 标准累计总电量 -->
      <!-- <dv-border-box-2 class="flex-1">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-[#00eeff] text-xl mb-2 flex items-center">
            当日累计总电量
            <span class="text-sm text-gray-400 ml-2">(2024年同期实际值)</span>
          </div>
          <div class="flex  items-center">
            <div class="flex items-center ">
              <span class="text-white mr-2">标准值：</span>
              <dv-digital-flop :config="standardTotalConfig" />
            </div>
            <div class="flex items-center mt-1">
              <span class="text-white mr-2">实际值：</span>
              <dv-digital-flop :config="actualTotalConfig" />
            </div>
            <div class="text-white mt-1">
              同比：<span :class="{
                'text-red-500': dailyTotalPower.diff > 0,
                'text-green-500': dailyTotalPower.diff < 0
              }">{{dailyTotalPower.diff > 0 ? '↑' : dailyTotalPower.diff < 0 ? '↓' : '='}}{{Math.abs(dailyTotalPower.diff)}}kW</span>
            </div>
          </div>
        </div>
      </dv-border-box-2> -->

      <!-- 电流电压检测 -->
      <dv-border-box-2 class="flex-1">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-[#00eeff] text-xl mb-2 flex items-center">
            当月累计总电量
            <!-- <span class="text-sm text-gray-400 ml-2">(标准、实际、平均每台、超过多少报警)</span> -->
          </div>
          <div class="flex flex-col items-center gap-2">
            <!-- 总值显示 -->
            <div class="flex items-center gap-4">
              <div class="flex items-center">
                <span class="text-white mr-2">标准总值：</span>
                <dv-digital-flop :config="standardAvgTimesActualConfig" />
              </div>
              <div class="flex items-center">
                <span class="text-white mr-2">实际总值：</span>
                <dv-digital-flop :config="actualTotalConfig" />
              </div>
            </div>
            
            <!-- 平均每台显示 -->
            <div class="flex items-center gap-4">
              <div class="flex items-center">
                <span class="text-white mr-2">标准平均：</span>
                <dv-digital-flop :config="standardAvgConfig" />
              </div>
              <div class="flex items-center">
                <span class="text-white mr-2">实际平均：</span>
                <dv-digital-flop :config="actualAvgConfig" />
              </div>
            </div>
            
            <!-- 比较数据：标准平均 ✖ 实际总台 -->
            <!-- <div class="flex items-center gap-4">
              <div class="flex items-center">
                <span class="text-white mr-2">标准平均×实际台：</span>
                <dv-digital-flop :config="standardAvgTimesActualConfig" />
              </div>
            </div> -->
            
            <!-- 状态显示 -->
            <div class="mt-2">
              <span :class="{
                'text-red-500': monthlyTotalPower.status.includes('报警'),
                'text-green-500': !monthlyTotalPower.status.includes('报警')
              }">{{monthlyTotalPower.status}}</span>
            </div>
          </div>
        </div>
      </dv-border-box-2>

      <!-- 峰谷用电 -->
      <!-- <dv-border-box-2 class="flex-1">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-[#00eeff] text-xl mb-2 flex items-center">
            当年累计总电量
            <span class="text-sm text-gray-400 ml-2">(高峰、平段、低谷分别使用率)</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="text-white text-center whitespace-nowrap">{{yearlyTotalPower.ratio}}</div>
            <div class="flex gap-2 mt-2">
              <dv-digital-flop :config="peakConfig" />
              <dv-digital-flop :config="valleyConfig" />
            </div>
          </div>
        </div>
      </dv-border-box-2> -->


    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEnergyStore } from '@/store/energy'

const energyStore = useEnergyStore()

// 计算当日累计总电量（使用store中的当日数据）
// const dailyTotalPower = computed(() => {
//   const dailyData = energyStore.dailyElectricData
//   if (!dailyData || dailyData.length === 0) {
//     return { standard: 0, actual: 0, diff: 0 }
//   }
  
//   // 计算当日所有电表的总和
//   const actualTotal = dailyData.reduce((sum, device) => {
//     return sum + (device.numberPower || 0)
//   }, 0)
  
//   const standardTotal = 0 // 标准数据暂时设为0
//   const diff = Math.round(actualTotal - standardTotal)
  
//   return {
//     standard: standardTotal,
//     actual: actualTotal,
//     diff: diff
//   }
// })

// 计算当月累计总电量（使用store中的当月数据）
const monthlyTotalPower = computed(() => {
  // 从store中获取计算好的标准值和实际值
  const standardTotal = energyStore.getMonthlyTotalStandardPower;
  const actualTotal = energyStore.getMonthlyTotalActualPower;
  
  // 获取平均每台电量
  const standardAvg = energyStore.getMonthlyAvgStandardPower;
  const actualAvg = energyStore.getMonthlyAvgActualPower;
  
  console.log('📊 Line4组件：从store获取当月累计总电量:', {
    standardTotal,
    actualTotal,
    standardAvg,
    actualAvg
  });
  
  // 使用平均每台电量计算差值（更准确的报警判断）
  const avgDiff = actualAvg - standardAvg;
  
  // 计算状态（报警逻辑）- 基于平均每台电量
  let status = '=';
  if (standardAvg > 0) {
    const threshold = standardAvg * 0.1; // 10%阈值
    if (avgDiff > threshold) {
      status = `↑${avgDiff.toFixed(1)}kW/台(报警)`;
    } else if (avgDiff < -threshold) {
      status = `↓${Math.abs(avgDiff).toFixed(1)}kW/台(报警)`;
    } else {
      status = `=${avgDiff.toFixed(1)}kW/台`;
    }
  }
  
  return {
    standard: standardTotal,
    actual: actualTotal,
    standardAvg: standardAvg,
    actualAvg: actualAvg,
    status: status
  };
});

// 计算当年累计总电量（使用store中的当月数据进行峰谷用电分析）
// const yearlyTotalPower = computed(() => {
//   const monthlyData = energyStore.monthlyElectricData
//   if (!monthlyData || monthlyData.length === 0) {
//     return { peak: 0, normal: 0, valley: 0, ratio: '峰0% 平0% 谷0%' }
//   }
  
//   // 计算当月所有电表的总和
//   const totalPower = monthlyData.reduce((sum, device) => {
//     return sum + (device.numberPower || 0)
//   }, 0)
  
//   // 模拟峰谷用电分配（实际应该从接口获取）
//   const peak = Math.floor(totalPower * 0.4) // 40%高峰
//   const normal = Math.floor(totalPower * 0.35) // 35%平段
//   const valley = Math.floor(totalPower * 0.25) // 25%低谷
  
//   const total = peak + normal + valley
//   const ratio = total > 0 ? 
//     `峰${(peak/total*100).toFixed(1)}% 平${(normal/total*100).toFixed(1)}% 谷${(valley/total*100).toFixed(1)}%` :
//     '峰0% 平0% 谷0%'
  
//   return {
//     peak: peak,
//     normal: normal,
//     valley: valley,
//     ratio: ratio
//   }
// })

// // 当日累计总电量配置
// const standardTotalConfig = computed(() => ({
//   number: [dailyTotalPower.value.standard],
//   content: '{nt}kW',
//   style: { fontSize: 24, fill: '#00eeff' }
// }))

// const actualTotalConfig = computed(() => ({
//   number: [dailyTotalPower.value.actual],
//   content: '{nt}kW',
//   style: { fontSize: 24, fill: '#00eeff' }
// }))

// 当月累计总电量配置
// const standardTotalConfig = computed(() => ({
//   number: [monthlyTotalPower.value.standard],
//   content: '{nt}kW',
//   style: { fontSize: 24, fill: '#00eeff' }
// }))

const actualTotalConfig = computed(() => ({
  number: [monthlyTotalPower.value.actual],
  content: '{nt}kW',
  style: { fontSize: 24, fill: '#00eeff' }
}))

// 当月平均每台电量配置
const standardAvgConfig = computed(() => ({
  number: [energyStore.getMonthlyAvgStandardPower],
  content: '{nt}kW',
  style: { fontSize: 24, fill: '#00eeff' }
}))

const actualAvgConfig = computed(() => ({
  number: [energyStore.getMonthlyAvgActualPower],
  content: '{nt}kW',
  style: { fontSize: 24, fill: '#00eeff' }
}))

// 标准平均 ✖ 实际总台配置
const standardAvgTimesActualConfig = computed(() => ({
  number: [energyStore.getStandardAvgTimesActualCount],
  content: '{nt}kW',
  style: { fontSize: 24, fill: '#00eeff' }
}))


// Line4组件现在只负责显示数据，不再独立获取数据
// 数据由主组件统一管理和刷新

console.log('📊 Line4组件：使用store中的数据进行显示')
</script>

<style scoped>
:deep(.dv-digital-flop) {
  width: 120px;
  height: 30px;
}
</style>