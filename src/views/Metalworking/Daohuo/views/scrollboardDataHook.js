import { computed, ref, watch } from 'vue'
import config from './scrollboardConfig'

// 假设config.data是二维数组，config.header是一维表头
export function useScrollBoardData() {
  const loading = ref(true)  // 添加loading状态
  const headers = computed(() => config.header)
  const tableData = computed(() =>
    config.data.map(row =>
      Object.fromEntries(row.map((cell, idx) => ['col' + idx, cell]))
    )
  )

  // 监听数据变化
  watch(() => config.data, (newData) => {
    if (newData && newData.length > 0) {
      loading.value = false
    }
  }, { immediate: true })

  return { tableData, headers, loading }
} 