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
import { getCheckInfo } from '@/api/getIncomingInfo'
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
  const res = await getCheckInfo()
  // 根据实际返回结构调整
  const arr = Array.isArray(res.data) ? res.data : (res.data?.data || [])
  rawData.value = arr
  setRawData(arr) // 保存原始数据
  
  config.data = arr.map((item, idx) => [
    item.caigou || '--',
    item.cangguan || '--',
    item.jianyan || '--',
    // item.pcDate || '--',
    formatDate(item.arrival_date) || '--',
    item.udf021 || '--',
    item.supplierCode || '--', // 轮播表显示供应商编号
    item.item_code || '--',
    item.item_description || '--',
    item.item_specification || '--', 
    Math.round(item.business_qty) || '--',
    // formatDate(item.deliveryTime) || '--',
    // checkStatus(item.delayStatus) || '--'
  ])
}

function formatDate(val) {
  if (!val) return '';
  // 只取前10位
  return val.slice(0, 10);
}

watch(filteredData, (val) => {
  setRawData(val) // 更新原始数据
  
  config.data = val.map(item => [
    item.caigou || '--',
    item.cangguan || '--',
    item.jianyan || '--',
    // item.pcDate || '--',
    formatDate(item.arrival_date) || '--',
    item.udf021 || '--',
    item.supplierCode || '--', // 轮播表显示供应商编号
    item.item_code || '--',
    item.item_description || '--',
    item.item_specification || '--',
    Math.round(item.business_qty) || '--',
    // formatDate(item.deliveryTime) || '--',
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
</script>

<style scoped>

</style>    