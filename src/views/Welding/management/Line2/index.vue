<template>
    <div class="line2-container h-[60%]">
      <div class="w-full grid grid-cols-3 gap-4">
       <div class="flex flex-col">
        <div class="text-white border-[#2575fc] border-2 border-double flex justify-center items-center 
        w-full h-[50px] mb-1 rounded-xl">
          焊接A线(松下自动焊)
        </div>  
        <div class="col-box h-full flex flex-col gap-3">
          <DataCard
          v-for="(device) in devices1"
          :key="device.frame"
          :production="device.production"
          :customer-no="device.customerNo"
          :model-spec="device.modelSpec"
          :plan-count="device.planCount"
          :auto-weld-progress="device.autoWeldProgress"
          :manual-weld-count="device.manualWeldCount"
          :machineName="device.machineName"
          :liu="device.liu"
          :ya="device.ya"
          :jp="device.jp"
          :repairWelding="device.repairWelding"
          deviceCategory="weldingA"
        />
        </div>
      </div>

      <div class="flex flex-col">
        <div class="text-white border-[#2575fc] border-2 border-double flex justify-center items-center 
        w-full h-[50px] mb-1 rounded-xl">焊接B线(安川自动焊)</div>
        <template v-if="ACMachineData.length">
          <DataCard2 
            v-for="(card, index) in ACMachineData" 
            :key="index"
            v-bind="formatCardData(card)"
          />
        </template>
        <template v-else>
          <DataCard2 
            v-bind="emptyCardData"
          />
        </template>
      </div>

      <div class="flex flex-col">
        <div class="text-white border-[#2575fc] border-2 border-double flex justify-center items-center 
        w-full h-[50px] mb-1 rounded-xl">焊接C线(手工焊)</div>
        <div class="cards-container">
          <template v-if="allData.length">
            <div v-for="(item, index) in allData" 
                :key="index"
                class="card-wrapper">
              <DataCard2
                :catogory="item.processName || '工序'"
                :frame="item.workNo"
                :customer-no="item.productId"
                :model-spec="formatSpec(item.item_specification)"
                :planNum="handleNum(item.plan_qty)"
                :process_list="formatProcessList(item.itemList)"
                :repairWelding="item.repairWelding"
                :showRepairWelding="true"
              />
            </div>
          </template>
          <template v-else>
            <div class="card-wrapper">
              <DataCard2 v-bind="emptyCardData" :showRepairWelding="true" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>   

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataCard from '@/components/Stamp/DataCard.vue'
import DataCard2 from '@/components/Stamp/DataCard2.vue'
import { getStampingMachineData, getStampingGeneralData } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'

const route = useRoute()
const prodLine = route.query.prodLine

const devices1 = ref([])
const ACMachineData = ref([])
const allData = ref([])

const fetchData1 = async () => {
  const type = 1
  try {
    const res = await getStampingMachineData(prodLine, type)
    if (res.code === 200) {
      devices1.value = res.data.map(item => ({
        production: item.production ? item.production : '暂无',
        liu: item.liu ? item.liu : '暂无',
        ya: item.ya ? item.ya : '暂无',
        jp: item.jp ? item.jp : '暂无',
        machineName: item.machineName,
      }))
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    devices1.value = []
  }
}

const fetchACMachineData = async () => {
  try {
    const res = await getStampingMachineData(prodLine, 2)
    if (res.code === 200) {
      ACMachineData.value = res.data || []
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ACMachineData.value = []
  }
}

const fetchGeneralData = async () => {
  try {
    const res = await getStampingGeneralData(prodLine)
    if (res.code === 200) {
      allData.value = res.data || []
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    allData.value = []
  }
}

// 格式化进度条数据
const formatProcessList = (itemList) => {
  if (!itemList || !itemList.length) return [];
  
  // 获取父级的总数作为进度条的总量
  const totalNum = Number(itemList[0].plan_qty || itemList[0].num);
  
  return itemList.map(item => ({
    name: item.processName,
    current: Number(item.num || 0), // 确保转换为数字，如果为空则默认0
    total: totalNum,          // 使用父级的总数
    isDoing: item.isDoing === '1',
    mo_routing_d_id: item.mo_routing_d_id // 添加工序ID
  }));
}

const handleNum = (num:number) => {
  return Math.round(num)
}

// 格式化规格文本
const formatSpec = (spec: string) => {
  if (!spec) return '';
  return spec.length > 10 ? spec.slice(0, 10) + '...' : spec;
}

const formatCardData = (item) => {
  // 检查关键字段是否都为null
  const isEmptyData = !item.machineName && !item.num && !item.workNo && !item.processName

  if (isEmptyData) {
    return emptyCardData
  }

  return {
    catogory: item.processName || '暂无',
    frame: item.workNo || '暂无',
    customerNo: item.productId || '暂无',
    modelSpec: item.item_specification || '暂无',
    planNum: item.num ? Math.round(item.num) : 0,
    repairWelding: 0, // 添加repairWelding字段
    process_list: [{
      name: item.processName || '暂无',
      current: item.workNo ? Number(item.workNo) : 0,
      total: item.num ? Number(item.num) : 100,
      isDoing: item.deviceStateName === '运行中',
      mo_routing_d_id: item.mo_routing_d_id || ''
    }]
  }
}

const emptyCardData = {
  catogory: '暂无',
  frame: '暂无',
  customerNo: '暂无',
  modelSpec: '暂无',
  planNum: 0,
  repairWelding: 0, // 添加补焊字段
  process_list: [{
    name: '暂无',
    current: 0,
    total: 100,
    isDoing: false,
    mo_routing_d_id: ''
  }]
}

onMounted(() => {
  fetchACMachineData()
  fetchData1()
  fetchGeneralData()
})
</script>

<style scoped>
.line2-container {
  height: 60vh;
  overflow-y: auto; /* 👈 关键点 */
  padding: 0.5rem 0.5rem 0 0;
  width: 100%;
}

.col-box {
  overflow-y: auto;
  padding-right: 0.5rem; /* 为滚动条预留空间 */
}

.cards-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;  /* 改为水平方向排列 */
  gap: 1rem;  /* 使用 gap 替代单独设置 margin */
  padding-right: 0.5rem; /* 为滚动条预留空间 */
  overflow-y: auto;  /* 添加垂直滚动条 */
}

.card-wrapper {
  width: 100%;
}



@media (max-width: 1400px) {
  .card-wrapper {
    width: calc(50% - 0.5rem);
  }
}

@media (max-width: 900px) {
  .card-wrapper {
    width: 100%;
  }
}


/* 滚动条宽度 */
.line2-container::-webkit-scrollbar,
.col-box::-webkit-scrollbar,
.cards-container::-webkit-scrollbar {
  width: 6px;
}

/* 滚动条轨道背景 */
.line2-container::-webkit-scrollbar-track,
.col-box::-webkit-scrollbar-track,
.cards-container::-webkit-scrollbar-track {
  background: rgba(37, 117, 252, 0.1); /* 淡蓝色透明背景 */
  border-radius: 4px;
}

/* 滚动条滑块（实际的“滑轮”） */
.line2-container::-webkit-scrollbar-thumb,
.col-box::-webkit-scrollbar-thumb,
.cards-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #2575fc, #6a11cb); /* 蓝紫渐变 */
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1); /* 柔和高亮边框 */
}

/* 鼠标悬停滚动条滑块时 */
.line2-container::-webkit-scrollbar-thumb:hover,
.col-box::-webkit-scrollbar-thumb:hover,
.cards-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #33ccff, #3366ff);
}


</style> 