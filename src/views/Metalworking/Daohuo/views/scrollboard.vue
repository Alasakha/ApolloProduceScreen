<template>
    <div class="scrollboard w-full h-full relative">
        <dv-loading v-if="loading">
          <div class="text-white">
            加载中...
          </div>
        </dv-loading>
        <ScrollBoard v-else :config="config" />
    </div>
</template>

<script setup>
import { getPlanInfo } from '@/api/getIncomingInfo'
import { onMounted, ref, computed, watch } from 'vue'
import ScrollBoard from '@/components/datav/ScrollBoard.vue'
import config from './scrollboardConfig'
import FilterBar from './FilterBar.vue'
import { useScrollBoardData } from './scrollboardDataHook'

const { loading } = useScrollBoardData()  // 获取loading状态
const rawData = ref([]) // 你实际接口拉回的原始数据

// 保存原始数据到config中，供hook使用
const setRawData = (data) => {
  config.rawData = data
}

const filter = ref({ caigou: '', cangguan: '', jianyan: '' })

const caigouList = computed(() => [...new Set(rawData.value.map(i => i.caigou).filter(Boolean))])
const cangguanList = computed(() => [...new Set(rawData.value.map(i => i.cangguan).filter(Boolean))])
const jianyanList = computed(() => [...new Set(rawData.value.map(i => i.jianyan).filter(Boolean))])

const filteredData = computed(() =>
  rawData.value.filter(item =>
    (!filter.value.caigou || item.caigou === filter.value.caigou) &&
    (!filter.value.cangguan || item.cangguan === filter.value.cangguan) &&
    (!filter.value.jianyan || item.jianyan === filter.value.jianyan)
  )
)

async function fetchData() {
  try {
    console.log('开始获取数据...')
    const res = await getPlanInfo()
    console.log('API响应:', res)
    
    const arr = Array.isArray(res.data) ? res.data : (res.data?.data || [])
    console.log('处理后的数据:', arr)
    console.log('数据长度:', arr.length)
    
    rawData.value = arr
    setRawData(arr) // 保存原始数据
    
    // 调试：检查第一条数据的字段
    if (arr.length > 0) {
      console.log('第一条数据字段:', Object.keys(arr[0]))
      console.log('供应商名称:', arr[0].supplier_full_name)
      console.log('发货方式:', arr[0].shipmentMode)
    }
    
    config.data = arr.map((item, idx) => [
      item.caigou || '--',
      // item.cangguan || '--',
      // item.jianyan || '--',
      // item.pcDate || '--',
      // item.udf021 || '--',
      item.doc_no || '--', //采购单号
      item.supplierCode || '--', // 轮播表显示供应商编号
      // item.supplier_full_name|| '--',
      // item.item_code || '--',
      item.item_description || '--', 
      item.item_specification || '--',
      Math.round(item.business_qty) || '--',
      formatDate(item.deliveryTime) || '--',
      formatDate(item.expectedArrivalDate) || '--',
      status(item.shipmentMode),
      // checkStatus(item.delayStatus) || '--'
    ])
    
    console.log('配置数据已更新:', config.data.length, '行')
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

function formatDate(val) {
  if (!val) return '';
  return val.slice(0, 10);
}

watch(filteredData, (val) => {
  setRawData(val) // 更新原始数据
  
  config.data = val.map((item, idx) => [
    item.caigou || '--',
    // item.cangguan || '--',
    // item.jianyan || '--',
    // item.pcDate || '--',
    // item.udf021 || '--',
    item.doc_no || '--', //采购单号
    item.supplierCode || '--', // 轮播表显示供应商编号
    // item.supplier_full_name || '--',

    // item.item_code || '--',
    item.item_description || '--', 
    item.item_specification || '--',
    Math.round(item.business_qty) || '--',
    formatDate(item.deliveryTime) || '--',
    formatDate(item.expectedArrivalDate) || '--',
    status(item.shipmentMode),
    // checkStatus(item.delayStatus) || '--'
  ])
}, { immediate: true })

onMounted(fetchData)

//判断状态函数
const checkStatus = (item) => {
 if(item == null){
  return '--'
 }else if(item == 1){
  return '已超时'
 }else{
  return '正常'
 }
}


const status = (item) =>{
  if(item == 1) return '物流快递'
  if(item == 0) return '自配送'
  else return '暂无状态'
}
</script>

<style scoped>

</style>    