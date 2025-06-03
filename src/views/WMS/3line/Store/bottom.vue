<template>
  <ExceptionTable
    title="出库异常处理进度表"
    dialog-title="出库异常处理详情"
    :loading="outStoreLoading"
    :config="config"
    export-file-name="出库异常处理数据"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { getdeliveryTimelinessRateDetail } from '@/api/getWMSinfo'
import { eventBus } from '@/utils/eventbus'
import ExceptionTable from '@/components/WMS/ExceptionTable/index.vue'

const outStoreLoading = ref(true)

const config = reactive({
  header: [ '仓位','仓管员','需领用量','已领用量','品名','规格','工单号','客户单号'],
  data: [], // 初始为空
  index: true,
  columnWidth: [50,80,80,80,80,],
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 4,
  headerHeight: 35,
  headerBGC: '#0d47a1',
  oddRowBGC: '#1565c0',
  evenRowBGC: '#1976d2',
  waitTime: 5000,
  carousel: 'page',
  showTooltip: true
})

const fetchData = async () => {
  outStoreLoading.value = true
  try {
    const res = await getdeliveryTimelinessRateDetail()
    const list = res.data

    if (!Array.isArray(list) || list.length === 0) {
      config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
      return
    }

    const transformed = list.map(item => [
      item.warehouse_name || '暂无数据',
      item.warehouse_keeper || '暂无数据',
      Number(item.required_qty).toFixed(0) || '暂无数据',
      Number(item.issued_qty).toFixed(0) || '暂无数据',
      item.itemDescription || '暂无数据',
      item.itemSpecification || '暂无数据',
      item.docNo || '暂无数据',
      item.udf021 || '暂无数据'
    ])

    config.data = transformed.length > 0 ? transformed : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } catch (e) {
    console.error('数据获取失败', e)
    config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } finally {
    outStoreLoading.value = false
  }
}

onMounted(() => {
  eventBus.on('refreshData', fetchData)
  fetchData()
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
})
</script>