import { defineStore } from 'pinia'
import { getTopIssueWorkshop, type WorkshopIssueData, type IssueItem } from '@/api/produceperformance'

// 获取本地日期字符串（避免时区问题）
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface TopIssueWorkshopState {
  workshopData: WorkshopIssueData[]
  loading: boolean
  error: string | null
  
  // 新增：日期配置
  globalDays: number // 全局天数选择（默认7天）
  selectedEndDate: string // 手动选择的结束日期（默认今天）
}

export const useTopIssueWorkshopStore = defineStore('topIssueWorkshop', {
  state: (): TopIssueWorkshopState => ({
    workshopData: [],
    loading: false,
    error: null,
    
    // 新增：日期配置初始值
    globalDays: 7,
    selectedEndDate: getLocalDateString()
  }),

  getters: {
    // 总装一课（工作中心ID: 1004）数据
    workshop1004Data: (state) => {
      return state.workshopData.find(item => item.workCenterId === '1004')
    },
    
    // 总装二课（工作中心ID: 2004）数据
    workshop2004Data: (state) => {
      return state.workshopData.find(item => item.workCenterId === '2004')
    },

    // 总装一课 A类问题数据
    workshop1004ATypeIssues: (state) => {
      const workshop = state.workshopData.find(item => item.workCenterId === '1004')
      return workshop?.A类 || []
    },

    // 总装一课 常规类问题数据
    workshop1004RegularIssues: (state) => {
      const workshop = state.workshopData.find(item => item.workCenterId === '1004')
      return workshop?.常规类 || []
    },

    // 总装二课 A类问题数据
    workshop2004ATypeIssues: (state) => {
      const workshop = state.workshopData.find(item => item.workCenterId === '2004')
      return workshop?.A类 || []
    },

    // 总装二课 常规类问题数据
    workshop2004RegularIssues: (state) => {
      const workshop = state.workshopData.find(item => item.workCenterId === '2004')
      return workshop?.常规类 || []
    },

    // 获取所有车间数据（按工作中心ID分组）
    getWorkshopDataById: (state) => {
      return (workCenterId: string) => {
        return state.workshopData.find(item => item.workCenterId === workCenterId)
      }
    },

    // 获取指定车间的A类问题
    getATypeIssuesByWorkshopId: (state) => {
      return (workCenterId: string): IssueItem[] => {
        const workshop = state.workshopData.find(item => item.workCenterId === workCenterId)
        return workshop?.A类 || []
      }
    },

    // 获取指定车间的常规类问题
    getRegularIssuesByWorkshopId: (state) => {
      return (workCenterId: string): IssueItem[] => {
        const workshop = state.workshopData.find(item => item.workCenterId === workCenterId)
        return workshop?.A类 || []
      }
    },

    // 新增：日期配置相关的 getters - 注释掉天数间隔功能
    // getGlobalDays: (state) => state.globalDays,
    getSelectedEndDate: (state) => state.selectedEndDate,
    // getPresetDays: () => [1, 3, 7, 15, 30, 60, 90]
  },

  actions: {
    // 新增：日期配置相关的 actions - 注释掉天数间隔功能
    // setGlobalDays(days: number) {
    //   const presetDays = [1, 3, 7, 15, 30, 60, 90];
    //   if (presetDays.includes(days)) {
    //     this.globalDays = days;
    //     // 天数变化后自动重新获取数据
    //     this.fetchTopIssueWorkshopData();
    //   } else {
    //     console.warn(`不支持的天数: ${days}，将使用默认值7天`);
    //     this.globalDays = 7;
    //   }
    // },

    setEndDate(date: string) {
      this.selectedEndDate = date;
      // 结束日期变化后自动重新获取数据
      this.fetchTopIssueWorkshopData();
    },

    resetEndDateToToday() {
      this.selectedEndDate = getLocalDateString();
      // 重置后自动重新获取数据
      this.fetchTopIssueWorkshopData();
    },

    // 修改：获取车间问题数据，支持日期参数
    async fetchTopIssueWorkshopData() {
      this.loading = true
      this.error = null
      
      try {
        // 计算日期范围
        const today = new Date()
        const endDate = this.selectedEndDate || today.toISOString().split('T')[0]
        
        // 根据选择的结束日期计算对应的开始日期
        const endDateObj = new Date(endDate)
        
        // 计算同月1号作为开始日期
        const startDate = new Date(endDateObj.getFullYear(), endDateObj.getMonth(), 1)
        const startDay = startDate.toISOString().split('T')[0]
        
        // 这样获取从同月1号到选中日期的数据范围
        
        const response = await getTopIssueWorkshop(startDay, endDate)
        this.workshopData = response.data.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取车间问题数据失败'
        console.error('获取车间问题数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 清空数据
    clearData() {
      this.workshopData = []
      this.error = null
    }
  }
})