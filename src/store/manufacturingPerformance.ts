import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFtyWorkshop } from '@/api/produceperformance'
import { getPaintingPassRate, type PaintingPassRateData } from '@/api/produceperformance'

// 制造绩效数据接口
interface WorkshopData {
  target_normal: string // 常规达成率目标
  actual_normal: string // 常规达成率实际值
  target_a: string // A类达成率目标  
  actual_a: string // A类达成率实际值
}

interface ManufacturingPerformanceState {
  // 总装一课数据
  assemblyCourse1Monthly: WorkshopData | null
  assemblyCourse1Yearly: WorkshopData | null
  
  // 总装二课数据
  assemblyCourse2Monthly: WorkshopData | null
  assemblyCourse2Yearly: WorkshopData | null
  
  // 涂装合格率数据
  paintingMonthlyData: PaintingPassRateData | null
  paintingYearlyData: PaintingPassRateData | null
  
  loading: boolean
  error: string | null
  lastFetchTime: Date | null
  
  // 新增：日期配置
  globalDays: number // 全局天数选择（默认7天）
  selectedEndDate: string // 手动选择的结束日期（默认今天）
}

export const useManufacturingPerformanceStore = defineStore('manufacturingPerformance', () => {
  

  
  // 日期生成函数 - 修改为使用store中的配置
  const getDateRanges = () => {
    const today = new Date()
    const endDate = state.value.selectedEndDate || today.toISOString().split('T')[0]
    
    // 根据选择的结束日期计算对应的年月
    const endDateObj = new Date(endDate)
    const targetYear = endDateObj.getFullYear()
    const targetMonth = endDateObj.getMonth() + 1
    
    // 目标月份的一号到选择的结束日期
    const monthStart = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`
    
    // 目标年份的一月一号到选择的结束日期
    const yearStart = `${targetYear}-01-01`
    
    return {
      monthly: { startDay: monthStart, endDay: endDate },
      yearly: { startDay: yearStart, endDay: endDate }
    }
  }
  
  // 状态
  const state = ref<ManufacturingPerformanceState>({
    assemblyCourse1Monthly: null,
    assemblyCourse1Yearly: null,
    assemblyCourse2Monthly: null,
    assemblyCourse2Yearly: null,
    paintingMonthlyData: null,
    paintingYearlyData: null,
    loading: false,
    error: null,
    lastFetchTime: null,
    // 新增：日期配置初始值
    globalDays: 7,
    selectedEndDate: new Date().toISOString().split('T')[0]
  })

  // 新增：日期配置相关的 getters - 注释掉天数间隔功能
  // const getGlobalDays = () => state.value.globalDays;
  const getSelectedEndDate = () => state.value.selectedEndDate;
  // const getPresetDays = () => presetDays;
  
  // 新增：设置全局天数 - 注释掉天数间隔功能
  // const setGlobalDays = (days: number) => {
  //   if (presetDays.includes(days)) {
  //     state.value.globalDays = days;
  //     // 天数变化后自动重新获取数据
  //     fetchAllWorkshopData();
  //   } else {
  //     console.warn(`不支持的天数: ${days}，将使用默认值7天`);
  //     state.value.globalDays = 7;
  //   }
  // };
  
  // 新增：设置结束日期
  const setEndDate = (date: string) => {
    state.value.selectedEndDate = date;
    // 结束日期变化后自动重新获取数据
    fetchAllWorkshopData();
  };
  
  // 新增：重置结束日期为今天
  const resetEndDateToToday = () => {
    state.value.selectedEndDate = new Date().toISOString().split('T')[0];
    // 重置日期后自动重新获取数据
    fetchAllWorkshopData();
  };

  // Getters - 总装一课数据
  const assemblyCourse1MonthlyData = computed(() => {
    if (!state.value.assemblyCourse1Monthly) return { target: 94.0, actual: 92.1, achievement: 98.0 }
    
    const target = parseFloat(state.value.assemblyCourse1Monthly.target_normal) * 100
    const actual = parseFloat(state.value.assemblyCourse1Monthly.actual_normal) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const assemblyCourse1YearlyData = computed(() => {
    if (!state.value.assemblyCourse1Yearly) return { target: 94.5, actual: 91.8, achievement: 97.1 }
    
    const target = parseFloat(state.value.assemblyCourse1Yearly.target_normal) * 100
    const actual = parseFloat(state.value.assemblyCourse1Yearly.actual_normal) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  // Getters - 总装二课数据
  const assemblyCourse2MonthlyData = computed(() => {
    if (!state.value.assemblyCourse2Monthly) return { target: 93.0, actual: 90.8, achievement: 97.6 }
    
    const target = parseFloat(state.value.assemblyCourse2Monthly.target_normal) * 100
    const actual = parseFloat(state.value.assemblyCourse2Monthly.actual_normal) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const assemblyCourse2YearlyData = computed(() => {
    if (!state.value.assemblyCourse2Yearly) return { target: 93.5, actual: 90.2, achievement: 96.5 }
    
    const target = parseFloat(state.value.assemblyCourse2Yearly.target_normal) * 100
    const actual = parseFloat(state.value.assemblyCourse2Yearly.actual_normal) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  // Getters - 涂装合格率数据
  const paintingData = computed(() => {
    // 返回月度数据作为默认数据（保持向后兼容）
    if (!state.value.paintingMonthlyData) return { 
      target_normal: 93.5, 
      actual_normal: 91.2, 
      target_a: 96.0, 
      actual_a: 94.2 
    }
    
    return state.value.paintingMonthlyData
  })

  // 将可能为小数(0-1)或百分数(>1)的值统一转换为百分数数值
  const normalizePercentValue = (value: number | string | null | undefined): number => {
    if (value === null || value === undefined) return 0
    const numeric = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isNaN(numeric)) return 0
    // 约定：>1 视为已是百分数（如 95.0），<=1 视为小数需要*100（如 0.95）
    return numeric > 1 ? numeric : numeric * 100
  }

  // 常规客户涂装数据 - 月度
  const paintingMonthlyData = computed(() => {
    if (!state.value.paintingMonthlyData) return { target: 93.5, actual: 91.2, achievement: 97.5 }

    const target = normalizePercentValue(state.value.paintingMonthlyData.target_normal)
    const actual = normalizePercentValue(state.value.paintingMonthlyData.actual_normal)
    const achievement = target > 0 ? (actual / target) * 100 : 0

    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  // 常规客户涂装数据 - 年度
  const paintingYearlyData = computed(() => {
    if (!state.value.paintingYearlyData) return { target: 94.0, actual: 91.8, achievement: 97.7 }

    const target = normalizePercentValue(state.value.paintingYearlyData.target_normal)
    const actual = normalizePercentValue(state.value.paintingYearlyData.actual_normal)
    const achievement = target > 0 ? (actual / target) * 100 : 0

    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  // A类客户数据 - 使用A类指标
  const aCustomerAssemblyCourse1MonthlyData = computed(() => {
    if (!state.value.assemblyCourse1Monthly) return { target: 95.5, actual: 96.8, achievement: 101.4 }
    
    const target = parseFloat(state.value.assemblyCourse1Monthly.target_a) * 100
    const actual = parseFloat(state.value.assemblyCourse1Monthly.actual_a) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const aCustomerAssemblyCourse1YearlyData = computed(() => {
    if (!state.value.assemblyCourse1Yearly) return { target: 96.0, actual: 97.2, achievement: 101.3 }
    
    const target = parseFloat(state.value.assemblyCourse1Yearly.target_a) * 100
    const actual = parseFloat(state.value.assemblyCourse1Yearly.actual_a) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const aCustomerAssemblyCourse2MonthlyData = computed(() => {
    if (!state.value.assemblyCourse2Monthly) return { target: 94.5, actual: 91.3, achievement: 96.6 }
    
    const target = parseFloat(state.value.assemblyCourse2Monthly.target_a) * 100
    const actual = parseFloat(state.value.assemblyCourse2Monthly.actual_a) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const aCustomerAssemblyCourse2YearlyData = computed(() => {
    if (!state.value.assemblyCourse2Yearly) return { target: 95.0, actual: 91.8, achievement: 96.6 }
    
    const target = parseFloat(state.value.assemblyCourse2Yearly.target_a) * 100
    const actual = parseFloat(state.value.assemblyCourse2Yearly.actual_a) * 100
    const achievement = target > 0 ? (actual / target * 100) : 0
    
    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const aCustomerPaintingMonthlyData = computed(() => {
    if (!state.value.paintingMonthlyData) return { target: 0, actual: 0, achievement: 0 }

    const target = normalizePercentValue(state.value.paintingMonthlyData.target_a)
    const actual = normalizePercentValue(state.value.paintingMonthlyData.actual_a)
    const achievement = target > 0 ? (actual / target) * 100 : 0

    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  const aCustomerPaintingYearlyData = computed(() => {
    if (!state.value.paintingYearlyData) return { target: 0, actual: 0, achievement: 0 }

    const target = normalizePercentValue(state.value.paintingYearlyData.target_a)
    const actual = normalizePercentValue(state.value.paintingYearlyData.actual_a)
    const achievement = target > 0 ? (actual / target) * 100 : 0

    return {
      target: parseFloat(target.toFixed(1)),
      actual: parseFloat(actual.toFixed(1)),
      achievement: parseFloat(achievement.toFixed(1))
    }
  })

  // Actions
  const fetchAssemblyCourse1Data = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const dateRanges = getDateRanges()
      
      // 获取总装一课月度和年度数据
      const [monthlyResponse, yearlyResponse] = await Promise.all([
        getFtyWorkshop('10041005', dateRanges.monthly.startDay, dateRanges.monthly.endDay),
        getFtyWorkshop('10041005', dateRanges.yearly.startDay, dateRanges.yearly.endDay)
      ])
      
      state.value.assemblyCourse1Monthly = monthlyResponse.data
      state.value.assemblyCourse1Yearly = yearlyResponse.data
      state.value.lastFetchTime = new Date()
      
    } catch (error) {
      console.error('获取总装一课数据失败:', error)
      state.value.error = '获取总装一课数据失败'
    } finally {
      state.value.loading = false
    }
  }

  const fetchAssemblyCourse2Data = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const dateRanges = getDateRanges()
      
      // 获取总装二课月度和年度数据
      const [monthlyResponse, yearlyResponse] = await Promise.all([
        getFtyWorkshop('20042005', dateRanges.monthly.startDay, dateRanges.monthly.endDay),
        getFtyWorkshop('20042005', dateRanges.yearly.startDay, dateRanges.yearly.endDay)
      ])
      
      state.value.assemblyCourse2Monthly = monthlyResponse.data
      state.value.assemblyCourse2Yearly = yearlyResponse.data
      state.value.lastFetchTime = new Date()
      
    } catch (error) {
      console.error('获取总装二课数据失败:', error)
      state.value.error = '获取总装二课数据失败'
    } finally {
      state.value.loading = false
    }
  }

  const fetchPaintingData = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const dateRanges = getDateRanges()
      
      // 并行获取月度和年度数据
      const [monthlyResponse, yearlyResponse] = await Promise.all([
        getPaintingPassRate(dateRanges.monthly.startDay, dateRanges.monthly.endDay),
        getPaintingPassRate(dateRanges.yearly.startDay, dateRanges.yearly.endDay)
      ])
      
      state.value.paintingMonthlyData = monthlyResponse.data
      state.value.paintingYearlyData = yearlyResponse.data
      state.value.lastFetchTime = new Date()
      
    } catch (error) {
      console.error('获取涂装合格率数据失败:', error)
      state.value.error = '获取涂装合格率数据失败'
    } finally {
      state.value.loading = false
    }
  }

  const fetchAllWorkshopData = async () => {
    await Promise.all([
      fetchAssemblyCourse1Data(),
      fetchAssemblyCourse2Data(),
      fetchPaintingData()
      // fetchFtyData() // 注释掉天数间隔功能
    ])
  }

  // 自动刷新相关
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  const startAutoRefresh = (intervalMs: number = 300000) => { // 默认5分钟刷新
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    
    // 立即获取一次数据
    fetchAllWorkshopData()
    
    // 设置定时刷新
    refreshTimer = setInterval(() => {
      fetchAllWorkshopData()
    }, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  return {
    // State
    state,
    
    // Getters - 常规客户数据
    assemblyCourse1MonthlyData,
    assemblyCourse1YearlyData,
    assemblyCourse2MonthlyData,
    assemblyCourse2YearlyData,
    paintingData,
    paintingMonthlyData,
    paintingYearlyData,
    
    // Getters - A类客户数据
    aCustomerAssemblyCourse1MonthlyData,
    aCustomerAssemblyCourse1YearlyData,
    aCustomerAssemblyCourse2MonthlyData,
    aCustomerAssemblyCourse2YearlyData,
    aCustomerPaintingMonthlyData,
    aCustomerPaintingYearlyData,
    
    // Actions
    fetchAssemblyCourse1Data,
    fetchAssemblyCourse2Data,
    fetchPaintingData,
    fetchAllWorkshopData,
    startAutoRefresh,
    stopAutoRefresh,
    // 新增：日期配置相关的方法 - 注释掉天数间隔功能
    // getGlobalDays,
    getSelectedEndDate,
    // getPresetDays,
    // setGlobalDays,
    setEndDate,
    resetEndDateToToday
  }
})