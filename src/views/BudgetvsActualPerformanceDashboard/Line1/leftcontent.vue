<template>
    <div class="content w-[66.6%] h-[27vh] p-4">
      <div class="flex">
        <h1 class="font-bold text-[#00eeff] text-sm sm:text-base md:text-lg xl:text-base 2xl:text-sm 3xl:text-xs 4xl:text-sm">表一：数量</h1>
        <el-button type="primary" size="small" class="ml-auto text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm" @click="dialogVisible = true">填写</el-button>
        <Dialog v-model="dialogVisible" />
      </div>

        <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="text-[#00eeff] text-sm sm:text-base md:text-lg xl:text-base 2xl:text-sm 3xl:text-xs 4xl:text-sm">加载中...</div>
        </div>
        <div v-else class="table-container overflow-auto rounded-lg border border-[#00eeff] shadow-[0_0_20px_rgba(0,238,255,0.3)]">
            <table class="w-full text-center border-collapse text-[#00eeff]">
                <thead>
                    <tr class="border-b border-[#00eeff40] bg-[#001122]">
                        <th class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">属性</th>
                        <th v-for="month in months" :key="month" class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ month }}</th>
                        <th class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider bg-blue-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">合计</th>
                        <th class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">阶段累计</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">年度挑战预算（数量）/台</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getData('budgetQuantity', month) }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-blue-600 bg-opacity-30 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('budgetQuantity') }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x  border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getStage('budgetQuantity') }}
                        </td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">年度合理预算（数量）/台</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getData('actualQuantity', month) }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-blue-600 bg-opacity-30 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('actualQuantity') }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getStage('actualQuantity') }}
                        </td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度预测（数量）/台</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getData('monthlyForecast', month) }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-blue-600 bg-opacity-30 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('monthlyForecast') }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getStage('monthlyForecast') }}
                        </td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">实际数量/台</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1  border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getData('bgTotal', month) }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 bg-blue-600  border-x bg-blue-600 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('bgTotal') }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1  border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getStage('bgTotal') }}
                        </td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度挑战目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getData('monthlyCompletionRate', month) !== '' ? getData('monthlyCompletionRate', month) + '%' : '' }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-blue-600 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('monthlyCompletionRate') }}%
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm"></td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度合理目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs  3xl:text-xs 4xl:text-sm">
                            {{ getData('monthlyProcessingRate', month) !== '' ? getData('monthlyProcessingRate', month) + '%' : '' }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-blue-600 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('monthlyProcessingRate') }}%
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm"></td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度预测目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getData('monthlyForecastRate', month) !== '' ? getData('monthlyForecastRate', month) + '%' : 0 }}
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-blue-600 bg-opacity-30 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">
                            {{ getTotal('bgTotal') }}%
                        </td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getFinanceQuantity } from '@/api/getIncomingInfo'
import { onMounted } from 'vue';
import Dialog from '../components/dialog.vue';

const dialogVisible = ref(false)

// 修改初始值
const tableData = ref({
  months: {},
  total: {},
  stage: {}
})

// 添加加载状态
const loading = ref(true)

const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

// 月份映射
const monthMap = {
  '01': '一月',
  '02': '二月',
  '03': '三月',
  '04': '四月',
  '05': '五月',
  '06': '六月',
  '07': '七月',
  '08': '八月',
  '09': '九月',
  '10': '十月',
  '11': '十一月',
  '12': '十二月'
};

// 在数据处理时修改比率计算
const getFinanceQuantityData = async () => {
  loading.value = true
  try {
    const res = await getFinanceQuantity()
    const formattedData = {}
    let totalData = {}
    let stageData = {}

    // 先找到合计值
    const totalItem = res.data.find(item => item.monthDay === '全年汇总')
    const totalBudget = totalItem?.ysChallengeYear || 0
    const totalReasonable = totalItem?.ysReasonableYear || 0
    const totalForecast = totalItem?.ysValueMonth || 0

    res.data.forEach(item => {
      if (item.monthDay === '全年汇总') {
        totalData = {
          budgetQuantity: item.ysChallengeYear,
          actualQuantity: item.ysReasonableYear,
          monthlyForecast: item.ysValueMonth,
          bgTotal: item.xdCount
        }
        return
      }
      if (item.monthDay === '阶段性汇总') {
        stageData = {
          budgetQuantity: item.ysChallengeYear,
          actualQuantity: item.ysReasonableYear,
          monthlyForecast: item.ysValueMonth,
          bgTotal: item.xdCount
        }
        return
      }
      const month = item.monthDay.split('-')[1]
      if (monthMap[month]) {
        // 修正达成率计算：实际数量 / 目标数量
        const monthlyCompletionRate = item.xdCount && item.ysChallengeYear ? 
          ((item.xdCount / item.ysChallengeYear) * 100).toFixed(1) : null
        const monthlyProcessingRate = item.xdCount && item.ysReasonableYear ? 
          ((item.xdCount / item.ysReasonableYear) * 100).toFixed(1) : null
        const monthlyForecastRate = item.xdCount && item.ysValueMonth ? 
          ((item.xdCount / item.ysValueMonth) * 100).toFixed(1) : null

        formattedData[monthMap[month]] = {
          budgetQuantity: item.ysChallengeYear,
          actualQuantity: item.ysReasonableYear,
          monthlyForecast: item.ysValueMonth,
          bgTotal: item.xdCount,
          monthlyCompletionRate,
          monthlyProcessingRate,
          monthlyForecastRate
        }
      }
    })

    // 计算合计的比率 - 实际数量 / 目标数量
    const totalActual = (totalData as any).bgTotal || 0
    totalData = {
      ...totalData,
      monthlyCompletionRate: totalBudget ? ((totalActual / totalBudget) * 100).toFixed(1) : '0',
      monthlyProcessingRate: totalReasonable ? ((totalActual / totalReasonable) * 100).toFixed(1) : '0',
      monthlyForecastRate: totalForecast ? ((totalActual / totalForecast) * 100).toFixed(1) : '0'
    }

    tableData.value = {
      months: formattedData,
      total: totalData,
      stage: stageData
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 修改数字格式化方法
// const formatNumber = (value: any) => {
//   if (value === null || value === undefined) return '';  // null和undefined返回空字符串
//   // 移除逗号，转换为数字
//   const num = Number(String(value).replace(/,/g, ''));
//   if (isNaN(num)) return '';  // 非数字返回空字符串
//   // 添加千位分隔符
//   return num.toLocaleString();
// };

// 修改获取数据的方法
const getData = (field: string, month: string) => {
  const value = tableData.value.months[month]?.[field];
  console.log(`getData(${field}, ${month}):`, value, typeof value); // 添加这行
  if (value === null || value === undefined) return '';
  return value;
};

// 获取合计数据
const getTotal = (field: string) => {
  const value = tableData.value.total[field];
  if (value === null || value === undefined) return '';
  return value;
};

// 获取阶段性汇总数据
const getStage = (field: string) => {
  const value = tableData.value.stage[field];
  if (value === null || value === undefined) return '';
  return value;
};


// 暴露数据给父组件
defineExpose({
  tableData,
  getFinanceQuantityData
});

onMounted(() => {
  getFinanceQuantityData()
})
</script>

<style scoped>
.table-container {
    position: relative;
    background: linear-gradient(180deg, rgba(0,19,47,0.95) 0%, rgba(0,19,47,0.85) 100%);
    box-shadow: 
        0 0 20px rgba(0,238,255,0.3),
        inset 0 0 20px rgba(0,238,255,0.1);
}

/* 响应式表格行高优化 */
@media (min-width: 640px) { /* sm */
    .table-container table {
        font-size: 0.875rem;
    }
}

@media (min-width: 768px) { /* md */
    .table-container table {
        font-size: 1rem;
    }
}

@media (min-width: 1024px) { /* lg */
    .table-container table {
        font-size: 1.125rem;
    }
}

@media (min-width: 1280px) { /* xl */
    .table-container table {
        font-size: 1rem;
    }
}

@media (min-width: 1536px) { /* 2xl */
    .table-container table {
        font-size: 0.875rem;
    }
}

@media (min-width: 1850px) { /* 3xl - 1080p */
    .table-container table {
        font-size: 0.75rem;
    }
    
    /* 1080p分辨率下的行高优化 */
    .table-container tbody tr {
        height: 2rem;
    }
    
    .table-container th,
    .table-container td {
        padding: 0.25rem 0.5rem;
    }
}

@media (min-width: 2500px) { /* 4xl - 2K */
    .table-container table {
        font-size: 0.875rem;
    }
    
    /* 2K分辨率下的行高优化 */
    .table-container tbody tr {
        height: 2.5rem;
    }
    
    .table-container th,
    .table-container td {
        padding: 0.5rem 1rem;
    }
}

/* 表格行样式 */
tbody tr:nth-child(odd) {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.95) 0%,
        rgba(0, 238, 255, 0.05) 30%,
    );
}

tbody tr:nth-child(even) {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.95) 0%,
        rgba(0, 238, 255, 0.05) 30%,
        rgba(0, 238, 255, 0.05) 70%,
        rgba(0, 19, 47, 0.55) 100%
    );
}

th {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    text-shadow: 0 0 10px rgba(0,225,255,0.5);
    background: linear-gradient(180deg, #001122 0%, #001a33 100%);
}

td {
    color: #00eeff;
    text-shadow: none;
}

tr:hover {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.8) 0%,
        rgba(0, 238, 255, 0.2) 30%,
        rgba(0, 238, 255, 0.2) 70%,
        rgba(0, 19, 47, 0.8) 100%
    ) !important;
}

tbody tr:last-child::before {
    background: linear-gradient(
        90deg,
        rgba(0, 19, 47, 0.95) 0%,
        rgba(0, 238, 255, 0.15) 30%,
        rgba(0, 238, 255, 0.15) 70%,
        rgba(0, 19, 47, 0.5) 100%
    );
    opacity: 1;
}

/* 针对1080p分辨率的特殊优化 */
@media (min-width: 1850px) and (max-width: 2499px) {
    .table-container {
        max-height: 25vh;
    }
    
    /* 优化表格在1080p下的显示 */
    .table-container table {
        line-height: 1.2;
    }
    
    /* 减少表格边框宽度 */
    .table-container th,
    .table-container td {
        border-width: 1px;
    }
}

/* 针对2K分辨率的特殊优化 */
@media (min-width: 2500px) {
    .table-container {
        max-height: 27vh;
    }
    
    /* 优化表格在2K下的显示 */
    .table-container table {
        line-height: 1.4;
    }
    
    /* 增加表格边框宽度 */
    .table-container th,
    .table-container td {
        border-width: 2px;
    }
}

/* 响应式滚动条样式优化 */
/* 基础滚动条样式 */
.table-container::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.table-container::-webkit-scrollbar-track {
    background: rgba(0, 19, 47, 0.8);
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #00eeff 0%, #00aaff 100%);
    border-radius: 4px;
    border: 1px solid rgba(0, 238, 255, 0.3);
}

.table-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #00ffff 0%, #00ccff 100%);
    box-shadow: 0 0 10px rgba(0, 238, 255, 0.5);
}

.table-container::-webkit-scrollbar-corner {
    background: rgba(0, 19, 47, 0.8);
}

/* 针对1080p分辨率的滚动条优化 */
@media (min-width: 1850px) and (max-width: 2499px) {
    .table-container::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    .table-container::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #00eeff 0%, #00aaff 100%);
        border: 1px solid rgba(0, 238, 255, 0.2);
    }
    
    .table-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #00ffff 0%, #00ccff 100%);
        box-shadow: 0 0 8px rgba(0, 238, 255, 0.4);
    }
}

/* 针对2K分辨率的滚动条优化 */
@media (min-width: 2500px) {
    .table-container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    
    .table-container::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #00eeff 0%, #00aaff 100%);
        border: 2px solid rgba(0, 238, 255, 0.4);
    }
    
    .table-container::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #00ffff 0%, #00ccff 100%);
        box-shadow: 0 0 12px rgba(0, 238, 255, 0.6);
    }
}

/* 针对中等分辨率的滚动条优化 */
@media (min-width: 1024px) and (max-width: 1849px) {
    .table-container::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }
    
    .table-container::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #00eeff 0%, #00aaff 100%);
        border: 1px solid rgba(0, 238, 255, 0.25);
    }
}

/* 针对小屏幕的滚动条优化 */
@media (max-width: 1023px) {
    .table-container::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    .table-container::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #00eeff 0%, #00aaff 100%);
        border: 1px solid rgba(0, 238, 255, 0.2);
    }
}

/* Firefox滚动条样式 */
.table-container {
    scrollbar-width: thin;
    scrollbar-color: #00eeff rgba(0, 19, 47, 0.8);
}

/* 针对不同分辨率的Firefox滚动条优化 */
@media (min-width: 1850px) and (max-width: 2499px) {
    .table-container {
        scrollbar-width: thin;
        scrollbar-color: #00eeff rgba(0, 19, 47, 0.8);
    }
}

@media (min-width: 2500px) {
    .table-container {
        scrollbar-width: auto;
        scrollbar-color: #00eeff rgba(0, 19, 47, 0.8);
    }
}
</style>
  