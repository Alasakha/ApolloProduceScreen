/* compatibility and production data store live below */
import { defineStore } from 'pinia'
import { getFty, getOnTime, getManufacturingCost, getPaintingProblem } from '@/api/produceperformance'
import type { TodayProduction, OnTime, ManufacturingCostData, PaintingProblemResponse } from '@/api/produceperformance'

// 获取本地日期字符串（避免时区问题）
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const useProductionDataStore = defineStore('productionData', {
  state: () => ({
    monthlyData: null as TodayProduction | null,
    yearlyData: null as TodayProduction | null,
    onTimeMonthlyData: null as OnTime['data'] | null, // 当月准交率数据
    onTimeDailyData: null as OnTime['data'] | null,   // 今日准交率数据
    loading: false,
    error: '',
    lastFetchTime: null as Date | null,
    autoRefreshTimer: null as ReturnType<typeof setInterval> | null,
    manufacturingCost: null as ManufacturingCostData | null,
    paintingProblemData: null as PaintingProblemResponse['data'] | null, // 涂装问题数据
    selectedEndDate: getLocalDateString() as string, // 新增：选中的结束日期（使用本地时间）
  }),

  getters: {
    // 月度直通率相关数据 - 添加百分比转换逻辑
    monthlyNormalTarget(): string {
      if (!this.monthlyData?.target_normal) return '--'
      const target = Number(this.monthlyData.target_normal)
      // 如果是小数比率(0-1之间)，转换为百分比显示
      return target <= 1 ? (target * 100).toFixed(1) : target.toString()
    },
    monthlyNormalActual(): number {
      if (!this.monthlyData?.target_normal) return 0
      const actual = this.monthlyData.actual_normal
      // 如果是小数比率(0-1之间)，转换为百分比数值
      return actual <= 1 ? actual * 100 : actual
    },
    monthlyATarget(): string {
      if (!this.monthlyData?.target_a) return '--'
      const target = Number(this.monthlyData.target_a)
      // 如果是小数比率(0-1之间)，转换为百分比显示
      return target <= 1 ? (target * 100).toFixed(1) : target.toString()
    },
    monthlyAActual(): number {
      if (!this.monthlyData?.actual_a) return 0
      const actual = this.monthlyData.actual_a
      // 如果是小数比率(0-1之间)，转换为百分比数值
      return actual <= 1 ? actual * 100 : actual
    },

    // 年度直通率相关数据 - 添加百分比转换逻辑
    yearlyNormalTarget(): string {
      if (!this.yearlyData?.target_normal) return '--'
      const target = Number(this.yearlyData.target_normal)
      // 如果是小数比率(0-1之间)，转换为百分比显示
      return target <= 1 ? (target * 100).toFixed(1) : target.toString()
    },
    yearlyNormalActual(): number {
      if (!this.yearlyData?.actual_normal) return 0
      const actual = this.yearlyData.actual_normal
      // 如果是小数比率(0-1之间)，转换为百分比数值
      return actual <= 1 ? actual * 100 : actual
    },
    yearlyATarget(): string {
      if (!this.yearlyData?.target_a) return '--'
      const target = Number(this.yearlyData.target_a)
      // 如果是小数比率(0-1之间)，转换为百分比显示
      return target <= 1 ? (target * 100).toFixed(1) : target.toString()
    },
    yearlyAActual(): number {
      if (!this.yearlyData?.actual_a) return 0
      const actual = this.yearlyData.actual_a
      // 如果是小数比率(0-1之间)，转换为百分比数值
      return actual <= 1 ? actual * 100 : actual
    },

    // 月度达成率计算 - 通过目标值和实际值计算达成率
    monthlyNormalAchievement(): number {
      if (!this.monthlyData?.actual_normal || !this.monthlyData?.target_normal) return 0
      const actual = this.monthlyData.actual_normal
      const target = Number(this.monthlyData.target_normal)
      
      // 如果actual和target都是小数比率(0-1之间)，先转换为百分比再计算
      const actualPercent = actual <= 1 ? actual * 100 : actual
      const targetPercent = target <= 1 ? target * 100 : target
      
      const achievement = (actualPercent / targetPercent) * 100
      // 保留一位小数
      return Number(achievement.toFixed(1))
    },

    monthlyAAchievement(): number {
      if (!this.monthlyData?.actual_a || !this.monthlyData?.target_a) return 0
      const actual = this.monthlyData.actual_a
      const target = Number(this.monthlyData.target_a)
      
      // 如果actual和target都是小数比率(0-1之间)，先转换为百分比再计算
      const actualPercent = actual <= 1 ? actual * 100 : actual
      const targetPercent = target <= 1 ? target * 100 : target
      
      const achievement = (actualPercent / targetPercent) * 100
      
      // 保留一位小数
      return Number(achievement.toFixed(1))
    },

    // 年度达成率计算 - 通过目标值和实际值计算达成率
    yearlyNormalAchievement(): number {
      if (!this.yearlyData?.actual_normal || !this.yearlyData?.target_normal) return 0
      const actual = this.yearlyData.actual_normal
      const target = Number(this.yearlyData.target_normal)
      
      // 如果actual和target都是小数比率(0-1之间)，先转换为百分比再计算
      const actualPercent = actual <= 1 ? actual * 100 : actual
      const targetPercent = target <= 1 ? target * 100 : target
      
      const achievement = (actualPercent / targetPercent) * 100
      
      // 保留一位小数
      return Number(achievement.toFixed(1))
    },

    yearlyAAchievement(): number {
      if (!this.yearlyData?.actual_a || !this.yearlyData?.target_a) return 0
      const actual = this.yearlyData.actual_a
      const target = Number(this.yearlyData.target_a)
      
      // 如果actual和target都是小数比率(0-1之间)，先转换为百分比再计算
      const actualPercent = actual <= 1 ? actual * 100 : actual
      const targetPercent = target <= 1 ? target * 100 : target
      
      const achievement = (actualPercent / targetPercent) * 100
      
      // 保留一位小数
      return Number(achievement.toFixed(1))
    },
    // 制造费用达成率计算 - 通过实际制造费和营业收入计算达成率
    costAchievement(): number {
      if (!this.manufacturingCost?.实际制造费 || !this.manufacturingCost?.营业收入) return 0
      const actual = this.manufacturingCost.实际制造费
      const target = this.manufacturingCost.营业收入
      return (actual / target) * 100
    },

    // 制造费用实际占比 - 实际制造费占营业收入的百分比
    manufacturingCostRatio(): number {
      if (!this.manufacturingCost?.实际收入 || !this.manufacturingCost?.实际费用合计) return 0
      const actual = this.manufacturingCost.实际制造费
      const revenue = this.manufacturingCost.实际收入
      return Number(((actual / revenue) * 100).toFixed(2))
    },

    // 制造费用数据格式化
    formattedManufacturingCost() {
      if (!this.manufacturingCost) return null
      const ratio = this.manufacturingCost.实际制造费 && this.manufacturingCost.营业收入 
        ? Number(((this.manufacturingCost.实际制造费 / this.manufacturingCost.营业收入) * 100).toFixed(2))
        : 0
      return {
        营业收入: this.manufacturingCost.营业收入?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        实际制造费: this.manufacturingCost.实际制造费?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        占比: ratio
      }
    },



    // 月度准交率相关数据
    onTimeMonthlyACompleteNum(): number {
      return this.onTimeMonthlyData?.a?.completeNum || 0
    },
    onTimeMonthlyATotal(): number {
      return this.onTimeMonthlyData?.a?.total || 0
    },
    onTimeMonthlyARate(): number {
      if (!this.onTimeMonthlyData?.a?.total || this.onTimeMonthlyData.a.total === 0) return 0
      return (this.onTimeMonthlyData.a.completeNum / this.onTimeMonthlyData.a.total) * 100
    },
    onTimeMonthlyNormalCompleteNum(): number {
      return this.onTimeMonthlyData?.normal?.completeNum || 0
    },
    onTimeMonthlyNormalTotal(): number {
      return this.onTimeMonthlyData?.normal?.total || 0
    },
    onTimeMonthlyNormalRate(): number {
      if (!this.onTimeMonthlyData?.normal?.total || this.onTimeMonthlyData.normal.total === 0) return 0
      return (this.onTimeMonthlyData.normal.completeNum / this.onTimeMonthlyData.normal.total) * 100
    },

    // 今日准交率相关数据  
    onTimeDailyACompleteNum(): number {
      return this.onTimeDailyData?.a?.completeNum || 0
    },
    onTimeDailyATotal(): number {
      return this.onTimeDailyData?.a?.total || 0
    },
    onTimeDailyARate(): number {
      if (!this.onTimeDailyData?.a?.total || this.onTimeDailyData.a.total === 0) return 0
      return (this.onTimeDailyData.a.completeNum / this.onTimeDailyData.a.total) * 100
    },
    onTimeDailyNormalCompleteNum(): number {
      return this.onTimeDailyData?.normal?.completeNum || 0
    },
    onTimeDailyNormalTotal(): number {
      return this.onTimeDailyData?.normal?.total || 0
    },
    onTimeDailyNormalRate(): number {
      if (!this.onTimeDailyData?.normal?.total || this.onTimeDailyData.normal.total === 0) return 0
      return (this.onTimeDailyData.normal.completeNum / this.onTimeDailyData.normal.total) * 100
    },

    // 数据是否可用
    hasData: (state) => !!(state.monthlyData || state.yearlyData || state.onTimeMonthlyData || state.onTimeDailyData),
    
    // 是否需要刷新（超过30分钟）
    needRefresh: (state) => {
      if (!state.lastFetchTime) return true
      const now = new Date()
      const timeDiff = now.getTime() - state.lastFetchTime.getTime()
      return timeDiff > 30 * 60 * 1000 // 30分钟
    },

    // 为了向后兼容，保留原有的getter（使用月度数据）
    onTimeACompleteNum(): number {
      return this.onTimeMonthlyData?.a?.completeNum || 0
    },
    onTimeATotal(): number {
      return this.onTimeMonthlyData?.a?.total || 0
    },
    onTimeARate(): number {
      if (!this.onTimeMonthlyData?.a?.total || this.onTimeMonthlyData.a.total === 0) return 0
      return (this.onTimeMonthlyData.a.completeNum / this.onTimeMonthlyData.a.total) * 100
    },
    onTimeNormalCompleteNum(): number {
      return this.onTimeMonthlyData?.normal?.completeNum || 0
    },
    onTimeNormalTotal(): number {
      return this.onTimeMonthlyData?.normal?.total || 0
    },
    onTimeNormalRate(): number {
      if (!this.onTimeMonthlyData?.normal?.total || this.onTimeMonthlyData.normal.total === 0) return 0
      return (this.onTimeMonthlyData.normal.completeNum / this.onTimeMonthlyData.normal.total) * 100
    },

    // 涂装问题数据相关 getters
    paintingProblemATypeData(): any[] {
      return this.paintingProblemData?.a || []
    },
    paintingProblemBTypeData(): any[] {
      return this.paintingProblemData?.b || []
    },
    paintingProblemTotalCount(): number {
      if (!this.paintingProblemData) return 0
      const aCount = this.paintingProblemData.a?.reduce((sum, item) => sum + item.total, 0) || 0
      const bCount = this.paintingProblemData.b?.reduce((sum, item) => sum + item.total, 0) || 0
      return aCount + bCount
    },
    paintingProblemATypeCount(): number {
      if (!this.paintingProblemData?.a) return 0
      return this.paintingProblemData.a.reduce((sum, item) => sum + item.total, 0)
    },
    paintingProblemBTypeCount(): number {
      if (!this.paintingProblemData?.b) return 0
      return this.paintingProblemData.b.reduce((sum, item) => sum + item.total, 0)
    }
  },

  actions: {
    // 获取当前年月日期字符串
    getCurrentDateParams() {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      
      // 年度数据参数：本年1月1日
      const yearParam = `${currentYear}-01-01`
      
      // 月度数据参数：本月1日  
      const monthParam = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
      
      return { yearParam, monthParam }
    },

    // 新增：设置结束日期并重新获取数据
    setEndDate(date: string) {
      console.log('productionData store: setEndDate 被调用，新日期:', date)
      // 直接设置选中的结束日期
      this.selectedEndDate = date
      console.log('productionData store: selectedEndDate 已设置为:', this.selectedEndDate)
      // 更新日期后重新获取数据
      console.log('productionData store: 准备调用 fetchProductionData')
      this.fetchProductionData()
    },

    // 新增：重置为今天并重新获取数据
    resetEndDateToToday() {
      // 重置为今天的日期（使用本地时间）
      this.selectedEndDate = getLocalDateString()
      // 重置后重新获取数据
      this.fetchProductionData()
    },

    // 获取生产数据
    async fetchProductionData() {
      console.log('productionData store: fetchProductionData 开始执行')
      // 如果正在加载，避免重复请求
      if (this.loading) {
        console.log('productionData store: 正在加载中，跳过重复请求')
        return
      }

      try {
        this.loading = true
        this.error = ''
        
        const { yearParam, monthParam } = this.getCurrentDateParams()
        
        // 使用选中的结束日期，如果没有选中则使用今天的日期（使用本地时间）
        const endDate = this.selectedEndDate || getLocalDateString()
        
        // 添加详细的调试信息
        console.log('=== 日期调试信息 ===')
        console.log('当前时间对象:', new Date())
        console.log('当前时间字符串:', new Date().toString())
        console.log('当前UTC时间:', new Date().toISOString())
        console.log('selectedEndDate:', this.selectedEndDate)
        console.log('计算出的endDate:', endDate)
        console.log('yearParam:', yearParam)
        console.log('monthParam:', monthParam)
        console.log('==================')
        
        console.log('正在获取生产数据...', { monthParam, yearParam, endDate })
        console.log('接口调用参数详情:', {
          'getFty(月度)': { startDate: monthParam, endDay: endDate },
          'getFty(年度)': { startDate: yearParam, endDay: endDate },
          'getOnTime(月度)': { startDay: monthParam, endDay: endDate },
          'getOnTime(当日)': { startDay: endDate, endDay: endDate }
        })
        
        console.log('productionData store: 准备调用接口...')
        
        try {
          // 同时获取月度、年度、准交率、制造费用和涂装问题数据
          // 使用 Promise.allSettled 避免单个接口失败影响其他接口
          const responses = await Promise.allSettled([
            getFty(monthParam, endDate),        // 本月1号到选中结束日期的月度数据（endDate 对应接口的 endDay 参数）
            getFty(yearParam, endDate),         // 本年1月1号到选中结束日期的年度数据（endDate 对应接口的 endDay 参数）
            getOnTime(monthParam, endDate),     // 本月1号获取月度准交率（接口只支持开始日期）
            getOnTime(endDate, endDate),        // 选中结束日期作为开始日期获取准交率（接口只支持开始日期）
            getManufacturingCost(),             // 获取制造费用数据
            getPaintingProblem(monthParam, endDate) // 获取涂装问题数据（使用月度时间范围）
          ])
          
          console.log('productionData store: 接口调用完成，开始处理响应')
          
          // 解构响应结果
          const [monthlyResult, yearlyResult, onTimeMonthlyResult, onTimeDailyResult, manufacturingCostResult, paintingProblemResult] = responses
          
          // 处理月度数据
          if (monthlyResult.status === 'fulfilled' && monthlyResult.value?.data) {
            this.monthlyData = monthlyResult.value.data
            console.log('月度数据获取成功:', monthlyResult.value.data)
          } else {
            console.warn('月度数据获取失败:', monthlyResult.status === 'rejected' ? monthlyResult.reason : '无数据')
          }
          
          // 处理年度数据
          if (yearlyResult.status === 'fulfilled' && yearlyResult.value?.data) {
            this.yearlyData = yearlyResult.value.data
            console.log('年度数据获取成功:', yearlyResult.value.data)
          } else {
            console.warn('年度数据获取失败:', yearlyResult.status === 'rejected' ? yearlyResult.reason : '无数据')
          }
          
          // 处理月度准交率数据
          if (onTimeMonthlyResult.status === 'fulfilled' && onTimeMonthlyResult.value?.data) {
            this.onTimeMonthlyData = onTimeMonthlyResult.value.data
            console.log('月度准交率数据获取成功:', onTimeMonthlyResult.value.data)
          } else {
            console.warn('月度准交率数据获取失败:', onTimeMonthlyResult.status === 'rejected' ? onTimeMonthlyResult.reason : '无数据')
          }
          
          // 处理今日准交率数据
          if (onTimeDailyResult.status === 'fulfilled' && onTimeDailyResult.value?.data) {
            this.onTimeDailyData = onTimeDailyResult.value.data
            console.log('今日准交率数据获取成功:', onTimeDailyResult.value.data)
          } else {
            console.warn('今日准交率数据获取失败:', onTimeDailyResult.status === 'rejected' ? onTimeDailyResult.reason : '无数据')
          }

          // 处理制造费用数据
          if (manufacturingCostResult.status === 'fulfilled' && manufacturingCostResult.value?.data) {
            this.manufacturingCost = manufacturingCostResult.value.data
            console.log('制造费用数据获取成功:', manufacturingCostResult.value.data)
          } else {
            console.warn('制造费用数据获取失败:', manufacturingCostResult.status === 'rejected' ? manufacturingCostResult.reason : '无数据')
          }

          // 处理涂装问题数据
          if (paintingProblemResult.status === 'fulfilled' && paintingProblemResult.value?.data) {
            this.paintingProblemData = paintingProblemResult.value.data
            console.log('涂装问题数据获取成功:', paintingProblemResult.value.data)
          } else {
            console.warn('涂装问题数据获取失败:', paintingProblemResult.status === 'rejected' ? paintingProblemResult.reason : '无数据')
          }
          
          // 更新最后获取时间
          this.lastFetchTime = new Date()
          
          // 检查是否有任何数据获取成功
          const hasAnyData = responses.some(result => 
            result.status === 'fulfilled' && result.value?.data
          )
          
          if (!hasAnyData) {
            throw new Error('所有接口都获取数据失败')
          }
          
          console.log('生产数据获取完成')
        } catch (apiError) {
          console.error('productionData store: 接口调用失败:', apiError)
          throw apiError
        }
      } catch (err: any) {
        this.error = err.message || '获取数据失败'
        console.error('获取生产数据失败:', err)
      } finally {
        this.loading = false
        console.log('productionData store: loading 状态已重置为 false')
      }
    },
  
    // 强制刷新数据
    async refreshData() {
      this.lastFetchTime = null
      await this.fetchProductionData()
    },

    // 启动自动刷新
    startAutoRefresh() {
      // 清除之前的定时器
      this.stopAutoRefresh()
      
      // 立即获取一次数据
      this.fetchProductionData()
      
      // 设置定时刷新（每30分钟）
      this.autoRefreshTimer = setInterval(() => {
        this.fetchProductionData()
      }, 30 * 60 * 1000) // 30分钟
    },

    // 停止自动刷新
    stopAutoRefresh() {
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer)
        this.autoRefreshTimer = null
        console.log('生产数据自动刷新已停止')
      }
    },

    // 清除数据
    clearData() {
      this.monthlyData = null
      this.yearlyData = null
      this.onTimeMonthlyData = null
      this.onTimeDailyData = null
      this.manufacturingCost = null
      this.paintingProblemData = null
      this.error = ''
      this.lastFetchTime = null
    }
  }
})