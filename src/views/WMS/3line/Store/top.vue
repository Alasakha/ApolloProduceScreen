<template>
  <ExceptionTable
    title="入库异常处理进度表"
    dialog-title="入库异常处理详情"
    :loading="inStoreLoading"
    :config="config"
    export-file-name="入库异常处理数据"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { gettimelyAccountingRateDetail } from '@/api/getWMSinfo'
import { eventBus } from '@/utils/eventbus'
import ExceptionTable from '@/components/WMS/ExceptionTable/index.vue'

const inStoreLoading = ref(true)

const config = reactive({
  header: [ '仓管员','仓位','检验单号','品名','规格'],
  data: [], // 初始为空
  index: true,
  columnWidth: [50,100,100,150,200],
  align: [],
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
  inStoreLoading.value = true
  try {
    const res = await gettimelyAccountingRateDetail()
    const list = res.data

    if (!Array.isArray(list) || list.length === 0) {
      config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
      return
    }

    const transformed = list.map(item => [
      item.warehouseKeeper ?? '无',
      item.warehouse_name ?? '无',
      item.docNo ?? '无',
      item.itemDescription ?? '无',
      item.itemSpecification ?? '无',
    ])

    config.data = transformed.length > 0 ? transformed : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } catch (e) {
    console.error('数据获取失败', e)
    config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } finally {
    inStoreLoading.value = false
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