<template>
  <ExceptionTable
      :ischarts="true"
    title="入库异常处理进度表"
    dialog-title="入库异常处理详情"
    :loading="inStoreLoading"
    :config="config"
    export-file-name="入库异常处理数据"
    :piedata="processedData"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { gettimelyAccountingRateDetail,gettimelyAccountingRateDetailPie } from '@/api/getWMSinfo'
import { eventBus } from '@/utils/eventbus'
import ExceptionTable from '@/components/WMS/ExceptionTable/index.vue'
import { formatPieChartData } from '@/utils/map';

const inStoreLoading = ref(true)
const processedData = ref([]) // 添加响应式变量存储饼图数据

const config = reactive({
  header: [ '仓管员','仓位','检验单号','品名','规格','到货单号','品号'],
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
  showTooltip: false
})

const fetchData = async () => {
  inStoreLoading.value = true
  try {
    const res = await gettimelyAccountingRateDetail()
    const list = res.data

    if (!Array.isArray(list) || list.length === 0) {
      config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据',]]
      return
    }

    const transformed = list.map(item => [
      item.warehouseKeeper ?? '无',
      item.warehouse_name ?? '无',
      item.docNo ?? '无',
      item.itemDescription ?? '无',
      item.itemSpecification ?? '无',
      item.purchase_doc_no ?? '无',
      item.item_code ?? '无'
    ])

    config.data = transformed.length > 0 ? transformed : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } catch (e) {
    console.error('数据获取失败', e)
    config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } finally {
    inStoreLoading.value = false
  }
}

 // 处理数据
const processData = (data) => {
    const formattedData = formatPieChartData(data, 'warehouseKeeper', 'total');
    
    processedData.value = formattedData
        .filter(item => item.value !== 0 && item.name)
        .map(item => ({
            name: item.name || '未知',
            value: item.value
        }))
        .sort((a, b) => b.value - a.value);
};

// 请求数据
const fetchData2 = () => {
const params = { type: 1 };
gettimelyAccountingRateDetailPie(params).then(res => {
  
    processData(res.data);
}).catch(() => {
});
};



onMounted(() => {
  eventBus.on('refreshData', fetchData)
  fetchData()
  fetchData2()
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
})
</script>