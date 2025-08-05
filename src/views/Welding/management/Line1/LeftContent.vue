<template>
  <div class="line1-container flex flex-col ">
    <div class="grid grid-cols-4 gap-2 h-full">
      <dv-border-box-12 class="data-box ">
        <Datacard title="今日排产工单单数" EnlishTitle="TodayPlanned" :value="productionData.pcGdTotal" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="已派工单数" EnlishTitle="ProducedToday" :value="productionData.gdPg" 
      @click="() => handleClick('已派工单数', 'getStampingPgAbnormal')"/>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="已报工单数" EnlishTitle="ProducedRate" :value="productionData.gdDone" 
      @click="() => handleClick('已报工单数', 'getStampingBgAbnormal')"/>
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="达成率" EnlishTitle="PassRateToday" :value="productionData.gdRate+'%'" />
      </dv-border-box-12>

    </div>

    <div class="grid grid-cols-6 gap-2 h-full">
      <dv-border-box-12 class="data-box ">
      <Datacard title="今日排产产量" EnlishTitle="PassRateToday" :value="productionData.pcTotal" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box ">
        <Datacard title="已报工产量" EnlishTitle="InspectionsToday" :value="productionData.done" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="达成率" EnlishTitle="QualifiedToday" :value="productionData.rate+'%'" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="检验数" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.checkTotal" />
      </dv-border-box-12>

      <dv-border-box-12 class="data-box ">
      <Datacard title="合格数" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.firstHgTotal" />
      </dv-border-box-12>
      <dv-border-box-12 class="data-box ">
      <Datacard title="合格率" EnlishTitle="PassRateToday" :value="apolloStampingWeldingData.passPercent" />
      </dv-border-box-12>

    </div>
    <Dialog 
      v-model="dialogVisible" 
      :fetchData="fetchTableData"
      :header="header"
      :title="dialogTitle"
    />
  </div>
 
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTodayProduction, type TodayProduction, getApolloStampingWelding, type ApolloStampingWelding } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'
import { eventBus } from '@/utils/eventbus'
import Datacard from '../components/Datacard.vue'
import { getStampingPgAbnormal,getStampingBgAbnormal } from '@/api/getStampWeldinfo'
import Dialog from '../components/Dialog.vue'


const currentApi = ref<'getStampingPgAbnormal' | 'getStampingBgAbnormal'>('getStampingPgAbnormal')
const route = useRoute()
const prodLine = route.query.prodLine as string
const dialogVisible = ref(false)
const dialogTitle = ref('')
const productionData = ref<TodayProduction>({
  pcGdTotal: 0,   // 排产工单数
  gdPg: 0,            // 工单派工数
  rate: 0,            // 达成率
  gdRate: 0,         // 工单达成率
  pg: 0,             // 派工数
  gdDone: 0,       // 工单报工数
  pcTotal: 0,    // 排产数
  done: 0,           // 报工数
  undone: 0,       // 未报工数
})
 const header = [
 '工作中心','工单号','客户单号','排产日期','品号','品名','规格','工单数量','排产数'
]
const apolloStampingWeldingData = ref<ApolloStampingWelding>({
  checkTotal: 0,
  firstHgTotal: 0,
  passPercent: '',
  toBeInspected: 0
})



const fetchData = async (prodLine) => {
  try {
    const getLine = () => {
      if (prodLine === 'CY') {
        return '1001'
      } else if (prodLine === 'HJ') {
        return '1003'
      }
      return prodLine
    }
    
    const lineValue = getLine()
    const res = await getTodayProduction(lineValue)
    const apolloRes = await getApolloStampingWelding(lineValue)
    
    if (res.code === 200) {
      // 格式化数据,去除小数点
      productionData.value = {
        ...res.data,
        pcGdTotal: Math.round(res.data.pcGdTotal),
        gdpP: Math.round(res.data.gdpP),
        rate: Math.round(res.data.rate),
        gdRate: Math.round(res.data.gdRate),
        pg: Math.round(res.data.pg),
        gdDone: Math.round(res.data.gdDone),
        pcTotal: Math.round(res.data.pcTotal),
        done: Math.round(res.data.done),
        undone: Math.round(res.data.undone)
      }
    }
    
    if (apolloRes.code === 200) {
      apolloStampingWeldingData.value = apolloRes.data
    }
  } catch (error) {
    console.error('获取今日生产数据失败:', error)
  }
}


const fetchTableData = async () => {
  try {
    // 根据当前选择的API调用不同接口
    const api = currentApi.value === 'getStampingPgAbnormal' ? getStampingPgAbnormal : getStampingBgAbnormal
    const res = await api(prodLine)
    
    return res.data.map(item => ({
      '工作中心': item.workCenter,
      '工单号': item.doc_no,
      '客户单号': item.udf021,
      '排产日期': item.ty003,
      '品号': item.item_code,
      '品名': item.item_description,
      '规格': item.item_specification,
      '工单数量': item.plan_qty,
      '排产数': item.ty004
    }))
  } catch (error) {
    console.error('获取数据失败:', error)
    return []
  }
}

const handleClick = (title: string, api: 'getStampingPgAbnormal' | 'getStampingBgAbnormal') => {
  dialogTitle.value = title
  currentApi.value = api
  dialogVisible.value = true
}

onMounted(() => {
  fetchData(prodLine)
  // 订阅刷新事件
  eventBus.on('refreshData', () => fetchData(prodLine))

})


</script>

<style scoped>


.data-box {
  height: 100%;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.circle-content-box {
  position: relative;
  width: 100%;  /* 可根据内容调整 */
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;
  filter: drop-shadow(0 0 16px #00eaff88);
  pointer-events: none;
}

.circle-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  /* 居中内容 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-bg {
  opacity: 0.2;
}
.ring-animate {
  stroke-linecap: round;
  filter: blur(1px);
  animation: ring-rotate 2.5s linear infinite;
  transform-origin: 60px 60px;
}
@keyframes ring-rotate {
  100% { stroke-dashoffset: 314; transform: rotate(360deg);}
}
.box-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  text-align: center;
  font-size: 1.5vw;
  font-weight: bold;
  margin: 1vh 0 0.5vh 0;
  color: #fff;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
  padding-bottom: 0.5vh;
}
.box-value {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.three-bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
}

.data-box {
  position: relative; 
  overflow: hidden;
}

.box-content {
  position: relative;
  z-index: 1;
}

.float-updown {
  animation: floatUpDown 2.5s cubic-bezier(0.4,0,0.2,1) infinite;
  display: inline-block;
}

@keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-5px); }
}
</style> 