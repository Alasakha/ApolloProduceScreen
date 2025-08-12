import { defineStore } from 'pinia'
import { getTopIssueWorkshop, type WorkshopIssueData, type IssueItem } from '@/api/produceperformance'

interface TopIssueWorkshopState {
  workshopData: WorkshopIssueData[]
  loading: boolean
  error: string | null
}

export const useTopIssueWorkshopStore = defineStore('topIssueWorkshop', {
  state: (): TopIssueWorkshopState => ({
    workshopData: [],
    loading: false,
    error: null
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
        return workshop?.常规类 || []
      }
    }
  },

  actions: {
    // 获取车间问题数据
    async fetchTopIssueWorkshopData() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getTopIssueWorkshop()
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