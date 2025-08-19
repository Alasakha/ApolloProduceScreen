import { defineStore } from 'pinia'
import { getFty, getOnTime,getManufacturingCost } from '@/api/produceperformance'
import type { TodayProduction, OnTime, ManufacturingCostData } from '@/api/produceperformance'

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
      if (!this.manufacturingCost?.实际制造费 || !this.manufacturingCost?.营业收入) return 0
      const actual = this.manufacturingCost.实际制造费
      const revenue = this.manufacturingCost.营业收入
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

    // 获取生产数据
    async fetchProductionData() {
      // 如果正在加载，避免重复请求
      if (this.loading) return

      try {
        this.loading = true
        this.error = ''
        
        const { yearParam, monthParam } = this.getCurrentDateParams()
        
        // 当日参数：今天的日期（用于准交率）
        const today = new Date()
        const todayParam = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
        
        console.log('正在获取生产数据...', { monthParam, yearParam, todayParam })
        
        // 同时获取月度、年度、准交率和制造费用数据
        const [monthlyResponse, yearlyResponse, onTimeMonthlyResponse, onTimeDailyResponse, manufacturingCostResponse] = await Promise.all([
          getFty(monthParam),        // 本月1号获取月度数据
          getFty(yearParam),         // 本年1月1号获取年度数据
          getOnTime(monthParam),     // 本月1号获取月度准交率
          getOnTime(todayParam),     // 今日数据获取今日准交率
          getManufacturingCost()     // 获取制造费用数据
        ])
        
        if (monthlyResponse && monthlyResponse.data) {
          this.monthlyData = monthlyResponse.data
          console.log('月度数据获取成功:', monthlyResponse.data)
        }
        
        if (yearlyResponse && yearlyResponse.data) {
          this.yearlyData = yearlyResponse.data
          console.log('年度数据获取成功:', yearlyResponse.data)
        }
        
        if (onTimeMonthlyResponse && onTimeMonthlyResponse.data) {
          this.onTimeMonthlyData = onTimeMonthlyResponse.data
          console.log('月度准交率数据获取成功:', onTimeMonthlyResponse.data)
        }
        
        if (onTimeDailyResponse && onTimeDailyResponse.data) {
          this.onTimeDailyData = onTimeDailyResponse.data
          console.log('今日准交率数据获取成功:', onTimeDailyResponse.data)
        }

        if (manufacturingCostResponse && manufacturingCostResponse.data) {
          this.manufacturingCost = manufacturingCostResponse.data
          console.log('制造费用数据获取成功:', manufacturingCostResponse.data)
        }
        
        // 更新最后获取时间
        this.lastFetchTime = new Date()
        
        if (!monthlyResponse.data && !yearlyResponse.data && !onTimeMonthlyResponse.data && !onTimeDailyResponse.data) {
          throw new Error('获取数据失败')
        }
        
        console.log('生产数据获取完成')
      } catch (err: any) {
        this.error = err.message || '获取数据失败'
        console.error('获取生产数据失败:', err)
      } finally {
        this.loading = false
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
      
      console.log('生产数据自动刷新已启动（每30分钟）')
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
      this.error = ''
      this.lastFetchTime = null
    }
  }
})