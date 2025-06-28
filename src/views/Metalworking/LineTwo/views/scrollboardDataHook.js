import { computed, ref, watch } from 'vue'
import config from './scrollboardConfig'

// 假设config.data是二维数组，config.header是一维表头
export function useScrollBoardData() {
  const loading = ref(true)  // 添加loading状态
  const headers = computed(() => config.header)
  const dialogheaders = computed(() => config.dialogheaders)
  
  // 轮播表数据（显示supplierCode）
  const tableData = computed(() =>
    config.data.map(row =>
      Object.fromEntries(row.map((cell, idx) => ['col' + idx, cell]))
    )
  )
  
  // 弹窗数据（显示supplier_full_name）
  const dialogTableData = computed(() => {
    if (!config.rawData || !config.rawData.length) {
      return []
    }
    
    return config.rawData.map((item, rowIndex) => {
      // 创建弹窗专用的数据行，将供应商编号替换为供应商全名
      const dialogRow = [
        item.caigou || '--',
        item.cangguan || '--',
        item.jianyan || '--',
        formatDate(item.arrival_date) || '--',
        formatDate(item.inspection_date) || '--',
        item.udf021 || '--',
        item.supplier_full_name || '--', // 弹窗显示供应商全名
        item.item_code || '--',
        item.item_description || '--',
        item.item_specification || '--',
        Math.round(item.business_qty) || '--'
      ]
      
      return Object.fromEntries(dialogRow.map((cell, idx) => ['col' + idx, cell]))
    })
  })
  
  const columnWidth = computed(() => config.dialogcolumnWidth)

  // 监听数据变化
  watch(() => config.data, (newData) => {
    if (newData && newData.length > 0) {
      loading.value = false
    }
  }, { immediate: true })

  // 提供设置loading状态的方法
  const setLoading = (value) => {
    loading.value = value
  }

  // 格式化日期函数
  function formatDate(val) {
    if (!val) return '';
    return val.slice(0, 10);
  }

  return { tableData, headers, loading, setLoading, columnWidth, dialogheaders, dialogTableData }
} 