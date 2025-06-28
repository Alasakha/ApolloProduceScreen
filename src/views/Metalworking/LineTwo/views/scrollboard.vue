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
import { getEnterInfo } from '@/api/getIncomingInfo'
import { onMounted, ref, computed, watch, onUnmounted } from 'vue'
import ScrollBoard from '@/components/datav/ScrollBoard.vue'
import config from './scrollboardConfig'
import FilterBar from './FilterBar.vue'
import { useScrollBoardData } from './scrollboardDataHook'

const { loading, setLoading } = useScrollBoardData()  // 获取loading状态和设置方法
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
    setLoading(true)  // 开始加载时设置loading为true
    console.log('开始获取入库信息数据')  // 添加日志
    const res = await getEnterInfo({})  // 传入空对象作为参数
    console.log('获取入库信息数据成功:', res)  // 添加日志
    
    if (!res || typeof res !== 'object') {
      console.error('API返回数据格式错误:', res)
      return
    }

    // 根据实际返回结构调整
    const arr = Array.isArray(res.data) ? res.data : (res.data?.data || [])
    rawData.value = arr
    setRawData(arr) // 保存原始数据
    
    if (arr.length === 0) {
      console.warn('获取到的数据为空数组')
    }
    
    config.data = arr.map((item, idx) => [
      item.caigou || '--',
      item.cangguan || '--',
      item.jianyan || '--',
      formatDate(item.arrival_date) || '--',
      formatDate(item.inspection_date) || '--',
      item.udf021 || '--',
      item.supplierCode || '--', // 轮播表显示供应商编号
      item.item_code || '--',
      item.item_description || '--',
      item.item_specification || '--',
      Math.round(item.business_qty) || '--',
    ])
  } catch (error) {
    console.error('获取入库信息数据失败:', error)
  } finally {
    setLoading(false)  // 无论成功失败，都设置loading为false
  }
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
    formatDate(item.arrival_date) || '--',
    formatDate(item.inspection_date) || '--',
    item.udf021 || '--',
    item.supplierCode || '--', // 轮播表显示供应商编号
    item.item_code || '--',
    item.item_description || '--',
    item.item_specification || '--',
    Math.round(item.business_qty) || '--',
  ])
}, { immediate: true })

onMounted(fetchData)

// 确保组件卸载时清理loading状态
onUnmounted(() => {
  setLoading(false)
})

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