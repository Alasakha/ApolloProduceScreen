<template>
    <div class="line2-container">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="text-cyan-400 text-lg">正在加载焊接设备数据...</div>
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
            @click-device-group="handleDeviceGroupClick"
            @click-waiting="handleWaitingClick"
          />
        </div>
        <div class="carousel-wrapper">
          <!-- <Abnormal /> -->
          <!-- <OneProdLine />
          <TwoProdLine /> -->
        </div>
      </div>
  
      <!-- 正在进行的工序详情弹窗 -->
      <ProcessDialog 
        v-model:visible="processDialogVisible" 
        :selected-card="selectedCard"
        :prod-line="prodLine"
        :type="selectedCard?.type"
      />
      
      <!-- 已完成的工序详情弹窗 -->
      <CompletedDialog 
        v-model:visible="completedDialogVisible" 
        :selected-card="selectedCard"
        :prod-line="prodLine"
        :type="selectedCard?.type"
      />
      
      <!-- 任务总数量详情弹窗 -->
      <TotalQtyDialog 
        v-model:visible="totalQtyDialogVisible" 
        :data="selectedCard ? [selectedCard] : []"
        :prod-line="prodLine"
        :type="selectedCard?.type"
      />
      
      <!-- 设备组详情弹窗 -->
      <DeviceGroupDialog 
        v-model:visible="deviceGroupDialogVisible" 
        :data="selectedCard"
        :type="selectedCard?.type?.toString() || ''"
        ref="deviceGroupDialogRef"
      />
      
      <!-- 待机设备详情弹窗 -->
      <WaitingDialog 
        v-model:visible="waitingDialogVisible" 
        :data="selectedCard ? [selectedCard] : []"
        :prod-line="prodLine"
        :type="selectedCard?.type?.toString() || ''"
      />
  
   
    </div>
  </template>   
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import DataCard3 from './components/DataCard3.vue'
  import ProcessDialog from './components/ProcessDialog.vue'
  import CompletedDialog from './components/CompletedDialog.vue'
  import TotalQtyDialog from './components/TotalQtyDialog.vue'
  import DeviceGroupDialog from './components/DeviceGroupDialog.vue'
  import WaitingDialog from './components/WaitingDialog.vue'
  import { getStampingDoingIndex, type StampingDoingIndex } from '@/api/getStampWeldinfo'
  import { useRoute } from 'vue-router'
  // import Abnormal from './Abnormal.vue'
  // import OneProdLine from '../Line3/oneProdLine.vue'
  // import TwoProdLine from '../Line3/twoProdLine.vue'
  
  // 定义 props
  interface Props {
    deviceType?: number
  }
  
  const props = withDefaults(defineProps<Props>(), {
    deviceType: undefined
  })
  
  const route = useRoute()
  const prodLine = route.query.prodLine as string
  
  // 弹窗控制 - 分别控制各个弹窗
  const processDialogVisible = ref(false)  // 控制ProcessDialog（正在进行的工序）
  const completedDialogVisible = ref(false)  // 控制CompletedDialog（已完成的工序）
  const totalQtyDialogVisible = ref(false)  // 控制TotalQtyDialog（任务总数量）
  const deviceGroupDialogVisible = ref(false)  // 控制DeviceGroupDialog（设备组详情）
  const waitingDialogVisible = ref(false)  // 控制WaitingDialog（待机设备）
  const selectedCard = ref<any>(null)
  const deviceGroupDialogRef = ref<any>(null)
  
  // API数据状态
  const loading = ref(false)
  const apiData = ref<StampingDoingIndex | null>(null)
  const error = ref<string | null>(null)
  
  // Mock 冲压机器数据（7个卡片）
  const mockStampingData = ref([
    
  ])
  
  
  // 设备组名称映射
  const deviceGroupNames = {
    ZDH1_ALL: '自动焊1线设备组',
    ZDH2_ALL: '自动焊2线设备组',
    SHGH_ALL: '手工焊设备组',
    TJH_ALL: '铁架焊接设备组',
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
          teach_count: deviceGroup.teach_count,
          warn_count: deviceGroup.warn_count,
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
    let cards: any[] = []
    
    if (apiData.value) {
      cards = convertApiDataToCards(apiData.value)
    } else {
      console.log('使用Mock数据')
      cards = mockStampingData.value
    }
    
    // 如果指定了设备类型，则过滤对应类型的数据
    if (props.deviceType !== undefined) {
      cards = cards.filter(card => card.type === props.deviceType)
    }
    
    return cards
  })
  
  // 组件挂载时获取数据
  onMounted(() => {
    fetchStampingData()
  })
  
  
  
  // 点击开机数量事件处理 - 打开ProcessDialog显示正在进行的工序
  const handleRunningClick = (cardData) => {
    // 设置选中的卡片数据
    selectedCard.value = {
      ...cardData,
      title: `${cardData.orderName} - 正在进行的设备详情`,
      orderName: cardData.orderName,
    }
    
    // 打开ProcessDialog
    processDialogVisible.value = true
  }
  
  // 点击已完成数事件处理 - 已注释
  // const handleCompletedClick = (cardData) => {
  //   console.log('点击已完成数量，卡片数据:', cardData)
  //   
  //   // 设置选中的卡片数据
  //   selectedCard.value = {
  //     ...cardData,
  //     title: `${cardData.orderName} - 已完成工序详情`,
  //     orderName: cardData.orderName,
  //   }
  //   
  //   // 打开CompletedDialog
  //   completedDialogVisible.value = true
  // }
  
  // 点击任务总数量事件处理 - 已注释
  // const handleTotalQtyClick = (cardData) => {
  //   console.log('点击任务总数量，卡片数据:', cardData)
  //   
  //   // 设置选中的卡片数据
  //   selectedCard.value = {
  //     ...cardData,
  //     title: `${cardData.orderName} - 任务总数量详情`,
  //     orderName: cardData.orderName,
  //   }
  //   
  //   console.log('设置 selectedCard:', selectedCard.value)
  //   
  //   // 打开TotalQtyDialog
  //   totalQtyDialogVisible.value = true
  //   console.log('设置 totalQtyDialogVisible:', totalQtyDialogVisible.value)
  // }
  
  // 点击设备组数量事件处理
  const handleDeviceGroupClick = (cardData) => {
    console.log('点击设备组数量，卡片数据:', cardData)
    
    // 设置选中的卡片数据
    selectedCard.value = {
      ...cardData,
      title: `${cardData.orderName} - 设备组详情`,
      orderName: cardData.orderName,
    }
    
    // 打开DeviceGroupDialog
    deviceGroupDialogVisible.value = true
  }
  
  // 点击待机数量事件处理
  const handleWaitingClick = (cardData) => {
    console.log('点击待机数量，卡片数据:', cardData)
    
    // 设置选中的卡片数据
    selectedCard.value = {
      ...cardData,
      title: `${cardData.orderName} - 待机设备详情`,
      orderName: cardData.orderName,
    }
    
    // 打开WaitingDialog
    waitingDialogVisible.value = true
  }
  
  // 根据设备组代码查看设备
  const viewDevicesByGroupCode = (groupCode: string) => {
    if (deviceGroupDialogRef.value) {
      const devices = deviceGroupDialogRef.value.getDevicesByGroupCode(groupCode)
      const groupName = deviceGroupDialogRef.value.getGroupNameByCode(groupCode)
      
      console.log(`查看设备组 ${groupCode} (${groupName}) 的设备:`, devices)
      
      // 设置选中的卡片数据
      selectedCard.value = {
        orderName: groupName,
        title: `${groupName} - 设备详情`,
        deviceGroup: devices,
        type: 'deviceGroup'
      }
      
      // 打开设备组对话框
      deviceGroupDialogVisible.value = true
    }
  }
  
  // 测试Dialog函数
  // const testDialog = () => {
  //   console.log('测试Dialog函数被调用')
  //   selectedCard.value = {
  //     orderName: '测试设备组',
  //     qty_total: 1000,
  //     num_total: 500,
  //     title: '测试 - 任务总数量详情'
  //   }
  //   totalQtyDialogVisible.value = true
  //   console.log('测试数据设置完成，selectedCard:', selectedCard.value)
  //   console.log('测试状态设置完成，totalQtyDialogVisible:', totalQtyDialogVisible.value)
  // }
  
  // 暴露方法供外部调用
  defineExpose({
    viewDevicesByGroupCode
  })
  </script>
  
  <style scoped>
  .line2-container {
    padding: 0.2rem 0.2rem 0 0;
    width: 100%;
    height: 100%;
    /* overflow: hidden; 防止外层出现滚动条 */
  }
  
  .cards-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row wrap;  /* 水平方向排列，允许换行 */
    gap: 1rem;  /* 使用 gap 替代单独设置 margin */
    padding-right: 0.5rem; /* 为滚动条预留空间 */
    overflow-y: auto;  /* 添加垂直滚动条 */
    align-items: flex-start; /* 确保卡片从顶部对齐 */
}

.card-wrapper {
    height: 100%;
    width: 100%;
    cursor: pointer;
    transition: transform 0.2s ease;
    align-self: flex-start; /* 确保卡片从顶部对齐 */
}

/* 右侧轮播容器：占两列宽度，抵消 gap 影响，避免换行 */
.carousel-wrapper {
    width: calc(66.66% - 0.33rem);
    display: flex;
    align-items: stretch;
    align-self: flex-start; /* 确保从顶部对齐 */
    height: fit-content; /* 自适应内容高度 */
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
    .carousel-wrapper {
      width: calc(50% - 0.5rem);
    }
  }
  
  @media (max-width: 900px) {
    .card-wrapper {
      width: 100%;
    }
    .carousel-wrapper {
      width: 100%;
    }
  }
  
  /* 弹窗内容样式 */
  .dialog-cards-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    max-height: 70vh;
    /* overflow-y: auto; */
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