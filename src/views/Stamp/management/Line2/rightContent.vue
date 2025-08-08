<template>
  <div class="line2-container h-[100%]">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="text-cyan-400 text-lg">正在加载冲压设备数据...</div>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="flex items-center justify-center h-full">
      <div class="text-red-400 text-lg">{{ error }}</div>
    </div>
    
    <!-- 正常显示卡片 -->
    <div v-else class="cards-container">
      <!-- 显示冲压机器设备卡片 -->
      <div v-for="(card, index) in displayCards" 
           :key="`card-${index}`"
           class="card-wrapper">
        <DataCard3 
          :data="card"
          @click-running="handleRunningClick"
          @click-completed="handleCompletedClick"
        />
      </div>
    </div>

    <!-- 工序详情弹窗 -->
    <ProcessDialog 
      v-model:visible="dialogVisible" 
      :selected-card="selectedCard"
      :prod-line="prodLine"
      :type="selectedCard?.type"
    />
  </div>
</template>   

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataCard3 from '../components/DataCard3.vue'
import ProcessDialog from './components/ProcessDialog.vue'
import { getStampingDoingIndex, type StampingDoingIndex } from '@/api/getStampWeldinfo'
import { useRoute } from 'vue-router'

const route = useRoute()
const prodLine = route.query.prodLine as string

// 弹窗控制
const dialogVisible = ref(false)
const selectedCard = ref<any>(null)

// API数据状态
const loading = ref(false)
const apiData = ref<StampingDoingIndex | null>(null)
const error = ref<string | null>(null)

// Mock 冲压机器数据（7个卡片）
const mockStampingData = ref([
  
])


// 设备组名称映射
const deviceGroupNames = {
  SG_ALL: '冲压设备组',
  CHH_ALL: '冲孔设备组', 
  WG_ALL: '弯管设备组',
  GH_ALL: '滚花设备组',
  CHC_ALL: '冲床设备组',
  YJ_ALL: '压机设备组',
  TZ_ALL: '调直设备组'
}

// 获取API数据
const fetchStampingData = async () => {
  if (!prodLine) {
    console.warn('prodLine参数缺失')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await getStampingDoingIndex(prodLine)
    apiData.value = response.data

  } catch (err) {
    error.value = '获取冲压数据失败'
    console.error('API调用失败:', err)
  } finally {
    loading.value = false
  }
}

// 将API数据转换为卡片数据
const convertApiDataToCards = (apiResponse: StampingDoingIndex) => {
  const cards: any[] = []
    
  
  // 遍历7个设备组对象
  Object.entries(apiResponse).forEach(([key, deviceGroup], index) => {
    const groupName = deviceGroupNames[key] || key

    
    // 如果该设备组有数据，创建卡片
    if (deviceGroup) {
      const cardData = {
        orderName: groupName,  // 使用映射后的中文名称
        originalKey: key,      // 保留原始的API key
        type: deviceGroup.type,
        code: deviceGroup.code,
        qty_total: deviceGroup.qty_total,
        num_total: deviceGroup.num_total,
        doing_count: deviceGroup.doing_count,
        machine_count: deviceGroup.machine_count,
        gdNum: index + 1,
        // 计算进度百分比
        progress: deviceGroup.qty_total > 0 ? Math.round((deviceGroup.num_total / deviceGroup.qty_total) * 100) : 0,
        // 添加原始设备组数据，供后续使用
        deviceGroup: deviceGroup
      }
      

      cards.push(cardData)
    } else {
      // 如果设备组没有数据，创建空卡片
      const emptyCardData = {
        orderName: groupName,  // 使用映射后的中文名称
        originalKey: key,      // 保留原始的API key
        type: 0,
        code: key,
        qty_total: 0,
        num_total: 0,
        doing_count: 0,
        machine_count: 0,
        gdNum: index + 1,
        progress: 0,
        // 添加原始设备组数据，供后续使用
        deviceGroup: null
      }
      
      cards.push(emptyCardData)
    }
  })
  
  return cards
}

// 计算显示的卡片数据（API数据优先，否则使用mock数据）
const displayCards = computed(() => {
  if (apiData.value) {

    const cards = convertApiDataToCards(apiData.value)

    return cards
  }
  console.log('使用Mock数据')
  return mockStampingData.value
})

// 组件挂载时获取数据
onMounted(() => {
  fetchStampingData()
})



// 点击开机数量事件处理
const handleRunningClick = (cardData) => {

  console.log('卡片数据:', cardData)

  
  // 这里可以添加开机数量相关的逻辑
  // 例如：显示开机设备详情、开机状态等
  
  selectedCard.value = {
    ...cardData,
    title: `${cardData.orderName} - 开机设备详情`,
    orderName: cardData.orderName,
  }
  dialogVisible.value = true
}

// 点击已完成数事件处理
const handleCompletedClick = (cardData) => {


  // 获取对应的type参数

  
  // 这里可以添加已完成数相关的逻辑
  // 例如：显示完成详情、进度分析等
  
  selectedCard.value = {
    ...cardData,
    title: `${cardData.orderName} - 完成进度详情`,
    orderName: cardData.orderName,
  }
  dialogVisible.value = true
}
</script>

<style scoped>
.line2-container {
  padding: 0.2rem 0.2rem 0 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 防止外层出现滚动条 */
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
  width: calc(33.33% - 0.67rem);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-2px);
}

/* 美化滚动条样式 */
.cards-container::-webkit-scrollbar {
  width: 6px;
}

.cards-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 238, 255, 0.3);
  border-radius: 3px;
}

.cards-container::-webkit-scrollbar-track {
  background: transparent;
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

/* 弹窗内容样式 */
.dialog-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem 0;
}

.dialog-card-wrapper {
  width: calc(50% - 0.5rem);
  min-width: 300px;
}

/* 弹窗滚动条样式 */
.dialog-cards-container::-webkit-scrollbar {
  width: 6px;
}

.dialog-cards-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 238, 255, 0.3);
  border-radius: 3px;
}

.dialog-cards-container::-webkit-scrollbar-track {
  background: transparent;
}

/* 添加卡片点击效果 */
.card-wrapper {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-2px);
}
</style> 