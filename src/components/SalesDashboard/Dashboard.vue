<template>
  <div class="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-6 py-2 border-b border-white/10 backdrop-blur-md bg-white/5 shrink-0">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          ABOLUO
        </h1>
      </div>

      <!-- Filter Dropdowns -->
      <div class="flex items-center space-x-3 flex-wrap">
        <!-- 查看维度分组 -->
        <div class="relative group">
          <select
            v-model="queryParams.groupby"
            @change="handleGroupByChange"
            class="px-3 py-1.5 bg-purple-800/80 border border-purple-400/50 rounded-lg text-white text-xs focus:outline-none focus:border-purple-400 hover:bg-purple-700/80 transition-colors cursor-pointer"
          >
            <option
              v-for="opt in groupbyOptions"
              :key="opt.value"
              :value="opt.value"
              class="bg-slate-800"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- 结算客户 (多选) -->
        <div class="relative group z-50">
          <div class="px-3 py-1.5 bg-slate-800/80 border border-white/20 rounded-lg text-white text-xs">
            <span class="text-gray-400 mr-1">结算客户:</span>
            <span v-if="selectedSettlementCustomers.length === 0" class="text-gray-500">全部</span>
            <span v-else class="text-cyan-400">{{ selectedSettlementCustomers.length }}项</span>
          </div>
          <div class="absolute top-full left-0 mt-1 hidden group-hover:block min-w-[200px] bg-slate-800 border border-white/20 rounded-lg shadow-xl max-h-48 overflow-y-auto p-2">
            <label class="flex items-center px-2 py-1 hover:bg-white/5 rounded cursor-pointer">
              <input
                type="checkbox"
                :checked="queryParams.settlementCustomer?.length === 0"
                @change="toggleAllSettlementCustomer"
                class="mr-2 rounded bg-slate-700 border-gray-600"
              />
              <span class="text-white text-xs">全选</span>
            </label>
            <label
              v-for="opt in filterOptions.settlementCustomerList"
              :key="opt"
              class="flex items-center px-2 py-1 hover:bg-white/5 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                :value="opt"
                v-model="queryParams.settlementCustomer"
                @change="fetchData"
                class="mr-2 rounded bg-slate-700 border-gray-600"
              />
              <span class="text-white text-xs truncate">{{ opt }}</span>
            </label>
          </div>
        </div>

        <!-- 月份 (多选) -->
        <div class="relative group z-50">
          <div class="px-3 py-1.5 bg-slate-800/80 border border-white/20 rounded-lg text-white text-xs">
            <span class="text-gray-400 mr-1">月份:</span>
            <span v-if="queryParams.yearMonth?.length === 0" class="text-gray-500">全部</span>
            <span v-else class="text-cyan-400">{{ queryParams.yearMonth?.length }}项</span>
          </div>
          <div class="absolute top-full left-0 mt-1 hidden group-hover:block min-w-[150px] bg-slate-800 border border-white/20 rounded-lg shadow-xl max-h-48 overflow-y-auto p-2">
            <label class="flex items-center px-2 py-1 hover:bg-white/5 rounded cursor-pointer">
              <input
                type="checkbox"
                :checked="queryParams.yearMonth?.length === 0"
                @change="toggleAllYearMonth"
                class="mr-2 rounded bg-slate-700 border-gray-600"
              />
              <span class="text-white text-xs">全选</span>
            </label>
            <label
              v-for="opt in filterOptions.yearMonthList"
              :key="opt"
              class="flex items-center px-2 py-1 hover:bg-white/5 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                :value="opt"
                v-model="queryParams.yearMonth"
                @change="fetchData"
                class="mr-2 rounded bg-slate-700 border-gray-600"
              />
              <span class="text-white text-xs">{{ opt }}</span>
            </label>
          </div>
        </div>

        <!-- 年份 (多选) -->
        <div class="relative group z-50">
          <div class="px-3 py-1.5 bg-slate-800/80 border border-white/20 rounded-lg text-white text-xs">
            <span class="text-gray-400 mr-1">年份:</span>
            <span v-if="queryParams.year?.length === 0" class="text-gray-500">全部</span>
            <span v-else class="text-cyan-400">{{ queryParams.year?.length }}项</span>
          </div>
          <div class="absolute top-full left-0 mt-1 hidden group-hover:block min-w-[100px] bg-slate-800 border border-white/20 rounded-lg shadow-xl max-h-32 overflow-y-auto p-2">
            <label class="flex items-center px-2 py-1 hover:bg-white/5 rounded cursor-pointer">
              <input
                type="checkbox"
                :checked="queryParams.year?.length === 0"
                @change="toggleAllYear"
                class="mr-2 rounded bg-slate-700 border-gray-600"
              />
              <span class="text-white text-xs">全选</span>
            </label>
            <label
              v-for="opt in filterOptions.yearList"
              :key="opt"
              class="flex items-center px-2 py-1 hover:bg-white/5 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                :value="opt"
                v-model="queryParams.year"
                @change="fetchData"
                class="mr-2 rounded bg-slate-700 border-gray-600"
              />
              <span class="text-white text-xs">{{ opt }}</span>
            </label>
          </div>
        </div>

        <!-- 重置按钮 -->
        <button
          @click="resetFilters"
          class="px-3 py-1.5 bg-red-500/20 border border-red-400/50 rounded-lg text-red-400 text-xs hover:bg-red-500/30 transition-colors"
        >
          重置
        </button>
      </div>

      <!-- 刷新按钮 -->
      <div class="flex items-center space-x-2">
        <button
          @click="fetchData"
          :disabled="loading"
          class="px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/50 rounded-lg text-cyan-400 text-xs hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
        >
          <svg
            class="w-4 h-4 inline-block mr-1"
            :class="{ 'animate-spin': loading }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          刷新
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="h-[calc(100vh-3.5rem)] p-3">
      <div class="h-full grid grid-rows-[auto_1fr] gap-3">
        <!-- KPI Section -->
        <div class="grid grid-cols-3 gap-3 shrink-0">
          <KPIBlock
            v-for="kpi in kpiData"
            :key="kpi.id"
            :title="kpi.title"
            :value="kpi.value"
            :trend="kpi.trend"
            :trendValue="kpi.trendValue"
            :color="kpi.color"
          />
        </div>

        <!-- Charts & Data Section -->
        <div class="grid grid-cols-12 gap-3 min-h-0">
          <!-- Left: Data Table -->
          <div class="col-span-7 bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden flex flex-col">
            <DataTable :data="tableData" :dimensionLabel="dimensionLabel" />
          </div>

          <!-- Right: Charts -->
          <div class="col-span-5 flex flex-col gap-3">
            <!-- Pie Chart -->
            <div class="flex-1 bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden">
              <PieChart :data="pieData" :title="pieChartTitle" />
            </div>

            <!-- Trend Chart -->
            <div class="flex-1 bg-slate-800/50 rounded-lg border border-white/10 overflow-hidden">
              <TrendChart :data="trendData" :title="trendChartTitle" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import KPIBlock from './KPIBlock.vue'
import DataTable from './DataTable.vue'
import PieChart from './PieChart.vue'
import TrendChart from './TrendChart.vue'
import {
  getFilterOptions,
  getROEData,
  type FilterOptions,
  type ROETableItem,
  type ROEPieItem,
  type ROEQueryParams,
  DEFAULT_GROUPBY,
  GROUPBY_OPTIONS,
  getDimensionLabel,
  isValidGroupby
} from '@/api/roe'

// 加载状态
const loading = ref(false)

// 筛选选项（使用简单数组格式）
const filterOptions = reactive<FilterOptions>({
  settlementCustomerList: [],
  yearMonthList: [],
  yearList: [],
  groupby: []
})

// 查询参数（数组格式，支持多选）
const queryParams = reactive<ROEQueryParams>({
  settlementCustomer: [],
  yearMonth: [],
  year: [],
  brand: [],
  model: [],
  category: [],
  group: [],
  area: [],
  company: [],
  groupby: DEFAULT_GROUPBY
})

// 已选结算客户数量（用于显示）
const selectedSettlementCustomers = computed(() => queryParams.settlementCustomer || [])

// 分组维度选项（静态配置，可根据 API 返回动态更新）
const groupbyOptions = ref(GROUPBY_OPTIONS)

// 维度标签
const dimensionLabel = computed(() => getDimensionLabel(queryParams.groupby))

// 饼图标题
const pieChartTitle = computed(() => `${dimensionLabel.value}利润贡献分析`)

// 趋势图标题
const trendChartTitle = computed(() => `${dimensionLabel.value}销售额与利润率趋势`)

// KPI 数据类型
type TrendType = 'up' | 'down'
type ColorType = 'cyan' | 'orange' | 'purple'

interface KPIData {
  id: string
  title: string
  value: string
  trend: TrendType
  trendValue: string
  color: ColorType
}

const kpiData = ref<KPIData[]>([
  {
    id: 'grossProfit',
    title: '毛利润',
    value: '0',
    trend: 'up',
    trendValue: '0%',
    color: 'cyan'
  },
  {
    id: 'salesAmount',
    title: '销售额',
    value: '0',
    trend: 'up',
    trendValue: '0%',
    color: 'orange'
  },
  {
    id: 'profitMargin',
    title: '综合毛利率',
    value: '0%',
    trend: 'up',
    trendValue: '0%',
    color: 'purple'
  }
])

// 表格数据
const tableData = ref<ROETableItem[]>([])

// 饼图数据
const pieData = ref<ROEPieItem[]>([])

// 趋势图数据
const trendData = ref({
  months: [] as string[],
  sales: [] as number[],
  margin: [] as number[]
})

// 获取筛选选项
const fetchFilterOptions = async () => {
  try {
    const res = await getFilterOptions()
    // 直接使用响应数据
    Object.assign(filterOptions, res)

    // 如果 API 返回了 groupby 选项，更新分组维度选项
    if (res.groupby && res.groupby.length > 0) {
      groupbyOptions.value = res.groupby
        .filter(isValidGroupby)
        .map(value => ({
          value,
          label: getDimensionLabel(value)
        }))
      // 如果当前分组维度不在返回列表中，则设置为默认
      if (!groupbyOptions.value.some(opt => opt.value === queryParams.groupby)) {
        queryParams.groupby = DEFAULT_GROUPBY
      }
    }
  } catch (error) {
    console.error('获取筛选选项失败:', error)
  }
}

// 获取报表数据
const fetchData = async () => {
  loading.value = true
  try {
    // 构建请求参数，过滤空数组
    const params = {
      settlementCustomer: queryParams.settlementCustomer?.length ? queryParams.settlementCustomer : undefined,
      yearMonth: queryParams.yearMonth?.length ? queryParams.yearMonth : undefined,
      year: queryParams.year?.length ? queryParams.year : undefined,
      brand: queryParams.brand?.length ? queryParams.brand : undefined,
      model: queryParams.model?.length ? queryParams.model : undefined,
      category: queryParams.category?.length ? queryParams.category : undefined,
      group: queryParams.group?.length ? queryParams.group : undefined,
      area: queryParams.area?.length ? queryParams.area : undefined,
      company: queryParams.company?.length ? queryParams.company : undefined,
      groupby: queryParams.groupby
    }

    const res = await getROEData(params)
    // 直接使用响应数据
    const { tableData: newTableData, pieData: newPieData, trendData: newTrendData } = res

    // 更新表格数据
    tableData.value = newTableData

    // 更新饼图数据
    pieData.value = newPieData.map((item, index) => ({
      ...item,
      color: getColorByIndex(index)
    }))

    // 更新趋势图数据
    trendData.value = newTrendData

    // 计算 KPI
    calculateKPI(newTableData, newTrendData)
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算 KPI
const calculateKPI = (tableData: ROETableItem[], trendData: { sales: number[]; margin: number[] }) => {
  // 总销售额
  const totalSales = tableData.reduce((sum, item) => sum + item.totalSales, 0)
  // 总毛利额
  const totalGrossProfit = tableData.reduce((sum, item) => sum + item.grossProfit, 0)
  // 综合毛利率
  const totalMargin = totalSales > 0 ? (totalGrossProfit / totalSales) * 100 : 0

  // 计算同比（如果有趋势数据）
  const salesLength = trendData.sales.length
  const currentSales = salesLength > 0 ? trendData.sales[salesLength - 1] : 0
  const previousSales = salesLength > 1 ? trendData.sales[salesLength - 2] : 0
  const salesYoY = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0

  // 更新 KPI
  kpiData.value = [
    {
      id: 'grossProfit',
      title: '毛利润',
      value: formatNumber(totalGrossProfit),
      trend: 'up',
      trendValue: '+0%',
      color: 'cyan'
    },
    {
      id: 'salesAmount',
      title: '销售额',
      value: formatNumber(totalSales),
      trend: salesYoY >= 0 ? 'up' : 'down',
      trendValue: `${salesYoY >= 0 ? '+' : ''}${salesYoY.toFixed(1)}%`,
      color: 'orange'
    },
    {
      id: 'profitMargin',
      title: '综合毛利率',
      value: `${totalMargin.toFixed(2)}%`,
      trend: 'up',
      trendValue: '+0%',
      color: 'purple'
    }
  ]
}

// 分组变化处理
const handleGroupByChange = () => {
  fetchData()
}

// 重置所有筛选条件
const resetFilters = () => {
  queryParams.settlementCustomer = []
  queryParams.yearMonth = []
  queryParams.year = []
  queryParams.brand = []
  queryParams.model = []
  queryParams.category = []
  queryParams.group = []
  queryParams.area = []
  queryParams.company = []
  fetchData()
}

// 切换结算客户全选
const toggleAllSettlementCustomer = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    queryParams.settlementCustomer = []
  }
  fetchData()
}

// 切换月份全选
const toggleAllYearMonth = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    queryParams.yearMonth = []
  }
  fetchData()
}

// 切换年份全选
const toggleAllYear = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    queryParams.year = []
  }
  fetchData()
}

// 格式化数字
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

// 根据索引获取颜色
const getColorByIndex = (index: number): string => {
  const colors = ['#06b6d4', '#f97316', '#8b5cf6', '#22c55e', '#6b7280', '#ec4899', '#eab308', '#3b82f6']
  return colors[index % colors.length]
}

// 初始化
onMounted(async () => {
  await fetchFilterOptions()
  await fetchData()
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Dropdown hover effect */
.group:hover .group-hover\:block {
  display: block;
}
</style>
