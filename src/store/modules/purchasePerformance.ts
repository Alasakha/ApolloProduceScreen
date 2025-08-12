import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


// 采购绩效数据接口
interface CostReductionData {
  monthlyTarget: number // 月度降本目标金额
  monthlyCumulative: number // 月度累计达成金额
  monthlyAchievementRate: number // 月度达成率
  weeklyBreakdown: Array<{
    week: number
    target: number
    actual: number
    achievementRate: number
    isWarning: boolean
    reason?: string
    countermeasure?: string
  }>
}

interface ResponsibilityData {
  personName: string
  department: string
  percentage: number
  amount: number
  isWarning: boolean
  reason?: string
  countermeasure?: string
}

interface PLIProductData {
  engineerName: string
  plannedCount: number
  completedCount: number
  achievementRate: number
  details: Array<{
    productName: string
    status: 'completed' | 'in_progress' | 'delayed'
    planDate: string
    actualDate?: string
  }>
}

interface SupplierDevelopmentData {
  newSuppliers: {
    planned: number
    actual: number
    achievementRate: number
  }
  supplierOptimization: {
    planned: number
    actual: number
    achievementRate: number
  }
  monthlyData: Array<{
    month: string
    newSuppliersPlanned: number
    newSuppliersActual: number
    optimizationPlanned: number
    optimizationActual: number
  }>
}

export const usePurchasePerformanceStore = defineStore('purchasePerformance', () => {
  // 降本目标数据
  const costReductionData = ref<CostReductionData>({
    monthlyTarget: 500000, // 50万
    monthlyCumulative: 320000, // 32万
    monthlyAchievementRate: 64, // 64%
    weeklyBreakdown: [
      { 
        week: 1, 
        target: 125000, 
        actual: 95000, 
        achievementRate: 76, 
        isWarning: false 
      },
      { 
        week: 2, 
        target: 125000, 
        actual: 110000, 
        achievementRate: 88, 
        isWarning: false 
      },
      { 
        week: 3, 
        target: 125000, 
        actual: 75000, 
        achievementRate: 60, 
        isWarning: true,
        reason: '主要原材料涨价影响降本效果',
        countermeasure: '寻找替代供应商，优化采购策略'
      },
      { 
        week: 4, 
        target: 125000, 
        actual: 40000, 
        achievementRate: 32, 
        isWarning: true,
        reason: '新产品开发延期，降本项目推迟',
        countermeasure: '加快新产品验证，推进降本项目实施'
      }
    ]
  })

  // 分管责任人数据
  const responsibilityData = ref<ResponsibilityData[]>([
    {
      personName: '张经理',
      department: '采购一部',
      percentage: 35,
      amount: 175000,
      isWarning: false
    },
    {
      personName: '李经理',
      department: '采购二部',
      percentage: 25,
      amount: 125000,
      isWarning: true,
      reason: '供应商配合度不高，降本项目进展缓慢',
      countermeasure: '加强供应商沟通，制定激励措施'
    },
    {
      personName: '王经理',
      department: '采购三部',
      percentage: 28,
      amount: 140000,
      isWarning: false
    },
    {
      personName: '赵经理',
      department: '战略采购',
      percentage: 12,
      amount: 60000,
      isWarning: true,
      reason: '新供应商开发周期较长',
      countermeasure: '优化供应商评估流程，缩短开发周期'
    }
  ])

  // PLI新产品采购计划数据
  const pliProductData = ref<PLIProductData[]>([
    {
      engineerName: '陈工程师',
      plannedCount: 15,
      completedCount: 12,
      achievementRate: 80,
      details: [
        { productName: 'PLI-001', status: 'completed', planDate: '2024-01-15', actualDate: '2024-01-12' },
        { productName: 'PLI-002', status: 'in_progress', planDate: '2024-01-20' },
        { productName: 'PLI-003', status: 'delayed', planDate: '2024-01-25' }
      ]
    },
    {
      engineerName: '刘工程师',
      plannedCount: 12,
      completedCount: 11,
      achievementRate: 92,
      details: [
        { productName: 'PLI-004', status: 'completed', planDate: '2024-01-10', actualDate: '2024-01-08' },
        { productName: 'PLI-005', status: 'completed', planDate: '2024-01-15', actualDate: '2024-01-14' }
      ]
    },
    {
      engineerName: '孙工程师',
      plannedCount: 10,
      completedCount: 6,
      achievementRate: 60,
      details: [
        { productName: 'PLI-006', status: 'delayed', planDate: '2024-01-18' },
        { productName: 'PLI-007', status: 'in_progress', planDate: '2024-01-22' }
      ]
    }
  ])

  // 供应商开发数据
  const supplierDevelopmentData = ref<SupplierDevelopmentData>({
    newSuppliers: {
      planned: 20,
      actual: 15,
      achievementRate: 75
    },
    supplierOptimization: {
      planned: 30,
      actual: 25,
      achievementRate: 83
    },
    monthlyData: [
      {
        month: '1月',
        newSuppliersPlanned: 5,
        newSuppliersActual: 4,
        optimizationPlanned: 8,
        optimizationActual: 7
      },
      {
        month: '2月',
        newSuppliersPlanned: 4,
        newSuppliersActual: 3,
        optimizationPlanned: 6,
        optimizationActual: 5
      },
      {
        month: '3月',
        newSuppliersPlanned: 6,
        newSuppliersActual: 4,
        optimizationPlanned: 8,
        optimizationActual: 6
      },
      {
        month: '4月',
        newSuppliersPlanned: 5,
        newSuppliersActual: 4,
        optimizationPlanned: 8,
        optimizationActual: 7
      }
    ]
  })

  // 计算属性
  const totalPLIPlanned = computed(() => 
    pliProductData.value.reduce((sum, engineer) => sum + engineer.plannedCount, 0)
  )

  const totalPLICompleted = computed(() => 
    pliProductData.value.reduce((sum, engineer) => sum + engineer.completedCount, 0)
  )

  const overallPLIAchievementRate = computed(() => 
    totalPLIPlanned.value > 0 ? Math.round((totalPLICompleted.value / totalPLIPlanned.value) * 100) : 0
  )

  // 获取数据的方法
  const fetchCostReductionData = async () => {
    try {
      // 模拟API调用，实际应该调用真实接口
      // const response = await api.get('/purchase/cost-reduction')
      // costReductionData.value = response.data
      console.log('获取降本数据')
    } catch (error) {
      console.error('获取降本数据失败:', error)
    }
  }

  const fetchResponsibilityData = async () => {
    try {
      // const response = await api.get('/purchase/responsibility')
      // responsibilityData.value = response.data
      console.log('获取责任人数据')
    } catch (error) {
      console.error('获取责任人数据失败:', error)
    }
  }

  const fetchPLIData = async () => {
    try {
      // const response = await api.get('/purchase/pli-products')
      // pliProductData.value = response.data
      console.log('获取PLI产品数据')
    } catch (error) {
      console.error('获取PLI产品数据失败:', error)
    }
  }

  const fetchSupplierData = async () => {
    try {
      // const response = await api.get('/purchase/supplier-development')
      // supplierDevelopmentData.value = response.data
      console.log('获取供应商开发数据')
    } catch (error) {
      console.error('获取供应商开发数据失败:', error)
    }
  }

  // 获取所有数据
  const fetchAllData = async () => {
    await Promise.all([
      fetchCostReductionData(),
      fetchResponsibilityData(),
      fetchPLIData(),
      fetchSupplierData()
    ])
  }

  return {
    // 数据
    costReductionData,
    responsibilityData,
    pliProductData,
    supplierDevelopmentData,
    
    // 计算属性
    totalPLIPlanned,
    totalPLICompleted,
    overallPLIAchievementRate,
    
    // 方法
    fetchCostReductionData,
    fetchResponsibilityData,
    fetchPLIData,
    fetchSupplierData,
    fetchAllData
  }
})