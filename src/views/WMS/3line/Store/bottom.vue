<template>
  <ExceptionTable
    :ischarts="true"
    title="出库异常处理进度表"
    dialog-title="出库异常处理详情"
    :loading="outStoreLoading"
    :config="config"
    export-file-name="出库异常处理数据"
    :piedata="processedData"
    :isrukuorchuku="false"
    :showPurchaseTotal='true'
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { getdeliveryTimelinessRateDetail,getdeliveryTimelinessRateDetailPie } from '@/api/getWMSinfo'
import { eventBus } from '@/utils/eventbus'
import ExceptionTable from '@/components/WMS/ExceptionTable/index.vue'


const outStoreLoading = ref(true)
const processedData = ref([]) // 添加响应式变量存储饼图数据

const config = reactive({
  header: ['仓位','仓管员','客户单号','工单号','品号','品名','规格','需领用量','已领用量','领料模式','应完成时间','处理结果','处理时间'],
  data: [], // 初始为空
  tableData: [],
  index: true,
  columnWidth: [80,80,150,150,150,150,400,100,100,100],
  align: ['center','center','center','center','center','center','center','center','center','center'],
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
      config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
      return
    }

    const transformed = list.map(item => [
      item.warehouse_name || '暂无数据',
      item.warehouseKeeper || '暂无数据',
      item.udf021 || '暂无数据',
      item.docNo || '暂无数据',
      item.item_code || '暂无数据',
      item.itemDescription || '暂无数据',

      item.itemSpecification || '暂无数据',
      Number(item.required_qty).toFixed(0) || '暂无数据',
      Number(item.issued_qty).toFixed(0) || '暂无数据',
      item.simpleProperty || '暂无数据',
      item.ty003 ||  '暂无数据', // 应完成时间，暂时使用占位符
      item.udf026 || '--',
      item.udf025,  // 处理时间
      item.mo_d_id // 保留 mo_d_id 但不显示
      
    ])

    const showtransformed = list.map(item => [
      item.warehouse_name || '暂无数据',
      item.warehouseKeeper || '暂无数据',
      item.udf021 || '暂无数据',
      item.docNo || '暂无数据',
      item.item_code || '暂无数据',
      item.itemDescription || '暂无数据',

      item.itemSpecification || '暂无数据',
      Number(item.required_qty).toFixed(0) || '暂无数据',
      Number(item.issued_qty).toFixed(0) || '暂无数据',
      item.simpleProperty || '暂无数据',
      item.ty003 || '暂无数据', // 应完成时间，暂时使用占位符
      item.udf026 || '--'
    ])

    config.data = showtransformed.length > 0 ? showtransformed : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
    config.tableData = transformed.length > 0 ? transformed : [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } catch (e) {
    console.error('数据获取失败', e)
    config.data = [['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']]
  } finally {
    outStoreLoading.value = false
  }
}


 // 处理数据
 const processData = (data) => {
  // 先按 warehouseKeeper 分组，统计 total 和 purchase_total
  const map = {}
  data.forEach(item => {
    const name = item.warehouseKeeper || '未知'
    if (!map[name]) {
      map[name] = { name, value: 0, purchase_total: 0 }
    }
    map[name].value += Number(item.total) || 0
    map[name].purchase_total += Number(item.purchase_total) || 0
  })
  processedData.value = Object.values(map)
    .filter((item:any) => item.value !== 0 && item.name)
    .sort((a:any, b:any) => b.value - a.value)

}

// 请求数据
const fetchData2 = () => {
const params = { type: 1 };
getdeliveryTimelinessRateDetailPie(params).then(res => {
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