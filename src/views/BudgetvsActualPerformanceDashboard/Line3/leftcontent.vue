<template>
    <div class="content w-full h-[27vh] p-4">
        <h1 class="text-xl font-bold text-[#00eeff]">表三：利润</h1>
        <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="text-[#00eeff]">加载中...</div>
        </div>
        <div v-else class="table-container overflow-auto rounded-lg border border-[#00eeff] shadow-[0_0_20px_rgba(0,238,255,0.3)]">
            <table class="w-full text-sm text-center border-collapse text-[#00eeff]">
                <thead>
                    <tr class="border-b border-[#00eeff40] bg-[#001122]">
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">属性</th>
                        <th v-for="month in months" :key="month" class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">{{ month }}</th>
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider bg-yellow-500 bg-opacity-20">合计</th>
                        <th class="px-4 py-3 border-x border-[#00eeff40] text-[#00FFFF] font-normal tracking-wider">阶段累计</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">挑战值年度预算（利润）<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getData('challengeProfit', month)) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ formatWan(getTotal('challengeProfit')) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getStage('challengeProfit')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">合理值年度预算（利润）<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getData('reasonableProfit', month)) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ formatWan(getTotal('reasonableProfit')) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getStage('reasonableProfit')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">月度预测（利润）<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getData('monthlyForecast', month)) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ formatWan(getTotal('monthlyForecast')) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getStage('monthlyForecast')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">实际利润<span class='text-xs'>(万)</span></td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getData('actualProfit', month)) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ formatWan(getTotal('actualProfit')) }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]">{{ formatWan(getStage('actualProfit')) }}</td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">月度挑战目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ getData('monthlyCompletionRate', month) !== '' ? getData('monthlyCompletionRate', month) + '%' : '' }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ getTotal('monthlyCompletionRate') }}%</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]"></td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">月度合理目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ getData('monthlyReasonableRate', month) !== '' ? getData('monthlyReasonableRate', month) + '%' : '' }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ getTotal('monthlyReasonableRate') }}%</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]"></td>
                    </tr>
                    <tr class="border-b border-[#00eeff40] hover:bg-[rgba(0,238,255,0.2)]">
                        <td class="px-4 py-2 text-left border-x border-[#00eeff40]">月度预测目标达成率</td>
                        <td v-for="month in months" :key="month" class="px-4 py-2 border-x border-[#00eeff40]">{{ getData('monthlyForecastRate', month) !== '' ? getData('monthlyForecastRate', month) + '%' : '' }}</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40] bg-yellow-500 bg-opacity-20">{{ getTotal('monthlyForecastRate') }}%</td>
                        <td class="px-4 py-2 border-x border-[#00eeff40]"></td>
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
    font-size: 0.9rem;
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
</style>
