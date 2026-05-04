import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postNewFPY, postNewBarChartFPY, postNewOnTimeMonth, postNewOnTimeDay } from '@/api/getManufacturing'
import { getTopIssueWorkshop } from '@/api/produceperformance'

export const useManufacturingStore = defineStore('manufacturing', () => {
  const raw = ref<Record<string, any>>({})
  const trendRaw = ref<Record<string, any>>({})
  const loading = ref(false)
  const trendLoading = ref(false)
  const onTimeMonthRaw = ref<Record<string, any>>({})
  const onTimeDayRaw = ref<Record<string, any>>({})
  const onTimeMonthLoading = ref(false)
  const onTimeDayLoading = ref(false)
  const topIssueWorkshopData = ref<any[]>([])  // 车间Top问题数据
  const topIssueLoading = ref(false)

  async function fetchNewFPY(startDay?: string, endDay?: string) {
    loading.value = true
    try {
      if (!startDay || !endDay) {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        const day = today.getDate()
        startDay = `${year}-${String(month).padStart(2, '0')}-01`
        endDay = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      }
      const res = await postNewFPY(startDay, endDay)
      if (res && res.code === 200) {
        raw.value = res.data || {}
      } else {
        raw.value = {}
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchNewBarChartFPY() {
    trendLoading.value = true
    try {
      const res = await postNewBarChartFPY()
      if (res && res.code === 200) {
        trendRaw.value = res.data || {}
      } else {
        trendRaw.value = {}
      }
    } finally {
      trendLoading.value = false
    }
  }

  // 获取当月准交率汇总（新接口）
  async function fetchOnTimeMonth() {
    onTimeMonthLoading.value = true
    try {
      const res = await postNewOnTimeMonth()
      if (res && res.code === 200) {
        onTimeMonthRaw.value = res.data || {}
      } else {
        onTimeMonthRaw.value = {}
      }
    } finally {
      onTimeMonthLoading.value = false
    }
  }

  // 获取当日准交明细（新接口）
  async function fetchOnTimeDay() {
    onTimeDayLoading.value = true
    try {
      const res = await postNewOnTimeDay()
      if (res && res.code === 200) {
        onTimeDayRaw.value = res.data || {}
      } else {
        onTimeDayRaw.value = {}
      }
    } finally {
      onTimeDayLoading.value = false
    }
  }

  // 获取车间Top问题数据
  async function fetchTopIssueWorkshop(startDay: string, endDay: string) {
    topIssueLoading.value = true
    try {
      const res = await getTopIssueWorkshop(startDay, endDay)
      if (res && res.code === 200 && res.data && res.data.code === 200) {
        topIssueWorkshopData.value = res.data.data || []
      } else {
        topIssueWorkshopData.value = []
      }
    } catch (e) {
      console.error('获取车间Top问题失败:', e)
      topIssueWorkshopData.value = []
    } finally {
      topIssueLoading.value = false
    }
  }

  // A类客户合计（使用返回的汇总字段）
  const aClassTotalActual = computed(() => {
    return raw.value['A类月度实际'] ?? null
  })
  const aClassTotalTarget = computed(() => {
    return raw.value['A类月度目标'] ?? null
  })

  // 常规客户合计
  const regularTotalActual = computed(() => {
    return raw.value['常规类月度实际'] ?? null
  })
  const regularTotalTarget = computed(() => {
    return raw.value['常规类月度目标'] ?? null
  })

  // A类客户直通率（优先使用月度达成率字段，否则用实际/目标计算）
  const aClassThroughput = computed(() => {
    if (raw.value['A类月度达成率'] !== undefined) return raw.value['A类月度达成率']
    const actual = aClassTotalActual.value
    const target = aClassTotalTarget.value
    if (actual != null && target) return target === 0 ? null : actual / target
    return null
  })

  // 常规类直通率
  const regularThroughput = computed(() => {
    if (raw.value['常规类月度达成率'] !== undefined) return raw.value['常规类月度达成率']
    const actual = regularTotalActual.value
    const target = regularTotalTarget.value
    if (actual != null && target) return target === 0 ? null : actual / target
    return null
  })

  // 格式化为百分比字符串（保留1位）
  function formatPct(value: number | null | undefined) {
    if (value === null || value === undefined) return '--'
    const num = Number(value)
    if (Number.isNaN(num)) return '--'
    return (num * 100).toFixed(1) + '%'
  }

  // A类客户趋势数据（按月份排序）
  const aClassTrendData = computed(() => {
    const months = Object.keys(trendRaw.value).sort()
    return months.map(month => ({
      month,
      target: trendRaw.value[month]?.['A类月度目标'] ?? null,
      actual: trendRaw.value[month]?.['A类月度实际'] ?? null,
      achievement: trendRaw.value[month]?.['A类月度达成率'] ?? null
    }))
  })

  // 常规客户趋势数据（按月份排序）
  const regularTrendData = computed(() => {
    const months = Object.keys(trendRaw.value).sort()
    return months.map(month => ({
      month,
      target: trendRaw.value[month]?.['常规类月度目标'] ?? null,
      actual: trendRaw.value[month]?.['常规类月度实际'] ?? null,
      achievement: trendRaw.value[month]?.['常规类月度达成率'] ?? null
    }))
  })

  const getters = {
    aClassTotalActual,
    aClassTotalTarget,
    regularTotalActual,
    regularTotalTarget,
    aClassThroughput,
    regularThroughput,
    aClassTrendData,
    regularTrendData,
    // on-time month/day getters
    onTimeMonthRaw: computed(() => onTimeMonthRaw.value),
    onTimeDayRaw: computed(() => onTimeDayRaw.value),
    onTimeMonthLoading: computed(() => onTimeMonthLoading.value),
    onTimeDayLoading: computed(() => onTimeDayLoading.value),
    formatPct
  }

  return {
    raw,
    trendRaw,
    onTimeMonthRaw,
    onTimeDayRaw,
    loading,
    trendLoading,
    onTimeMonthLoading,
    onTimeDayLoading,
    topIssueWorkshopData,
    topIssueLoading,
    fetchNewFPY,
    fetchNewBarChartFPY,
    fetchOnTimeMonth,
    fetchOnTimeDay,
    fetchTopIssueWorkshop,
    ...getters
  }
})


