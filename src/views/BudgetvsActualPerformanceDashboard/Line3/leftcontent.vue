<template>
    <div class="content w-full h-[27vh] p-4">
        <h1 class="text-xl font-bold text-[#00eeff] text-sm sm:text-base md:text-lg xl:text-base 2xl:text-sm 3xl:text-xs 4xl:text-sm">表三：利润</h1>
        <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="text-[#00eeff] text-sm sm:text-base md:text-lg xl:text-base 2xl:text-sm 3xl:text-xs 4xl:text-sm">加载中...</div>
        </div>
        <div v-else class="table-container overflow-auto rounded-lg border border-[#00eeff] shadow-[0_0_20px_rgba(0,238,255,0.3)]">
            <table class="w-full text-center border-collapse text-[#00eeff]">
                <thead>
                    <tr class="border-b border-[#00eeff40] bg-[#001122]">
                        <th class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">属性</th>
                        <th v-for="month in months" :key="month" class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ month }}</th>
                        <th class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">合计</th>
                        <th class="px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 xl:px-3 xl:py-2 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-2 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">阶段累计</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">挑战值年度预算（利润）<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getData('challengeProfit', month)) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getTotal('challengeProfit')) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getStage('challengeProfit')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">合理值年度预算（利润）<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getData('reasonableProfit', month)) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getTotal('reasonableProfit')) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getStage('reasonableProfit')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度预测（利润）<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getData('monthlyForecast', month)) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getTotal('monthlyForecast')) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getStage('monthlyForecast')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">实际利润<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getData('actualProfit', month)) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getTotal('actualProfit')) }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ formatWan(getStage('actualProfit')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度挑战目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ getData('monthlyCompletionRate', month) !== '' ? getData('monthlyCompletionRate', month) + '%' : '' }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ getTotal('monthlyCompletionRate') }}%</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm"></td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度合理目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ getData('monthlyReasonableRate', month) !== '' ? getData('monthlyReasonableRate', month) + '%' : '' }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ getTotal('monthlyReasonableRate') }}%</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm"></td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 text-left border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">月度预测目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ getData('monthlyForecastRate', month) !== '' ? getData('monthlyForecastRate', month) + '%' : '' }}</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20 text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm">{{ getTotal('monthlyForecastRate') }}%</td>
                        <td class="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 xl:px-3 xl:py-1 2xl:px-2 2xl:py-1 3xl:px-1 3xl:py-1 4xl:px-2 4xl:py-1 border-x border-[#00eeff40] text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-xs 3xl:text-xs 4xl:text-sm"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
import { getFinanceProfit } from '@/api/getIncomingInfo';

const tableData = ref({
  months: {},
  total: {},
  stage: {}
})

const loading = ref(true)

const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

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

const getFinanceProfitData = async () => {
  loading.value = true
  try {
    const res = await getFinanceProfit()
    const formattedData = {}
    let totalData = {}
    let stageData = {}

    // 先找到合计值
    const totalItem = res.data.find(item => item.monthDay === '全年汇总')
    const totalChallenge = totalItem?.ysChallengeYear || 0
    const totalReasonable = totalItem?.ysReasonableYear || 0
    const totalForecast = totalItem?.ysValueMonth || 0

    res.data.forEach(item => {
      if (item.monthDay === '全年汇总') {
        totalData = {
          challengeProfit: item.ysChallengeYear,
          reasonableProfit: item.ysReasonableYear,
          monthlyForecast: item.ysValueMonth,
          actualProfit: item.profit
        }
        return
      }
      if (item.monthDay === '阶段性汇总') {
        stageData = {
          challengeProfit: item.ysChallengeYear,
          reasonableProfit: item.ysReasonableYear,
          monthlyForecast: item.ysValueMonth,
          actualProfit: item.profit
        }
        return
      }
      const month = item.monthDay.split('-')[1]
      if (monthMap[month]) {
        // 计算各个比率
        const monthlyCompletionRate = totalChallenge && item.ysChallengeYear ? 
          ((item.ysChallengeYear / totalChallenge) * 100).toFixed(1) : null
        const monthlyReasonableRate = totalReasonable && item.ysReasonableYear ? 
          ((item.ysReasonableYear / totalReasonable) * 100).toFixed(1) : null
        const monthlyForecastRate = totalForecast && item.ysValueMonth ? 
          ((item.ysValueMonth / totalForecast) * 100).toFixed(1) : null

        formattedData[monthMap[month]] = {
          challengeProfit: item.ysChallengeYear,
          reasonableProfit: item.ysReasonableYear,
          monthlyForecast: item.ysValueMonth,
          actualProfit: item.profit,
          monthlyCompletionRate,
          monthlyReasonableRate,
          monthlyForecastRate
        }
      }
    })

    // 计算合计的比率
    totalData = {
      ...totalData,
      monthlyCompletionRate: '100',
      monthlyReasonableRate: '100',
      monthlyForecastRate: ''
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

const getData = (field: string, month: string) => {
  const value = tableData.value.months[month]?.[field];
  if (value === null || value === undefined) return '';
  return value;
};

const getTotal = (field: string) => {
  const value = tableData.value.total[field];
  if (value === null || value === undefined) return '';
  return value;
};

const getStage = (field: string) => {
  const value = tableData.value.stage[field];
  if (value === null || value === undefined) return '';
  return value;
};

// 金额转万
const formatWan = (val: any) => {
  if (val === null || val === undefined || val === '') return '';
  const num = Number(val);
  if (isNaN(num)) return '';
  return (num / 10000).toFixed(2);
};

onMounted(() => {
  getFinanceProfitData()
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
