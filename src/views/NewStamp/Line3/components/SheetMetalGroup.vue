<template>
  <div class="sheet-metal-group h-full flex flex-col gap-3">
    <!-- 上部分：人员信息 -->
    <div class="personnel-section">
      <PersonnelPanel :title="'钣金组'" :data="personnelData" />
    </div>

    <!-- 下部分：关键设备生产监控 -->
    <div class="equipment-section flex-1">
      <div class="section-title">关键设备生产监控</div>
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-text">数据加载中...</div>
      </div>
      <!-- 空数据状态 -->
      <div v-else-if="equipmentList.length === 0" class="empty-state">
        <div class="empty-text">暂无数据</div>
      </div>
      <!-- 设备列表 -->
      <div v-else class="equipment-list">
        <EquipmentCard
          v-for="(equipment, index) in equipmentList"
          :key="'equipment-' + index"
          :equipment="equipment"
          @click="handleEquipmentClick(equipment)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getBanjinMachine, type BanjinMachineItem } from '@/api/getStampWeldinfo'
import PersonnelPanel from './PersonnelPanel.vue'
import EquipmentCard from './EquipmentCard.vue'
import { getMetalworkingEfficiency } from '@/api/getStampinfo'
// 加载状态
const loading = ref(false)

// 人员数据
const personnelData = ref({
  configured: 10,
  current: 8,
  dayShift: 3,
  nightShift: 0
})

// 设备列表（合并所有设备，不分类）
const equipmentList = ref<Array<{
  name: string
  workOrderName: string
  partNumber: string
  status: string
  todayPlan: number
  completed: number
  progress: number
  macName: string
}>>([])

// 将API数据转换为组件需要的格式
const transformEquipmentData = (apiData: BanjinMachineItem[]) => {
  return apiData.map((item) => {
    const todayPlan = parseFloat(String(item.ty004)) || 0
    const completed = item.num || 0
    const progress = todayPlan > 0 ? Math.round((completed / todayPlan) * 100) : 0
    
    return {
      name: item.macNo || '未知设备',
      workOrderName: item.item_description || '暂无品名',
      partNumber: item.processName || '暂无工序',
      status: item.state || '待机',
      todayPlan,
      completed,
      progress,
      macName: item.macName || '未知设备'
    }
  })
}

const fetchData = async () => {
  try {
    loading.value = true
    const res = await getBanjinMachine()
    
    if (res.code === 200) {
      // 处理空数据情况
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // 将所有设备合并到一个列表中，不分类
        equipmentList.value = transformEquipmentData(res.data)
      } else {
        // 接口返回空数组或null，设置为空数组
        equipmentList.value = []
      }
    } else {
      console.error('获取板金组数据失败:', res.message)
      equipmentList.value = []
    }
  } catch (error) {
    console.error('获取板金组数据失败:', error)
    equipmentList.value = []
  } finally {
    loading.value = false
  }
}

const fetchPersonnelPanelData = async () => {
  try {
    const res = await getMetalworkingEfficiency(13) // 13代表管件组
    if (res.code === 200) {
      personnelData.value = {
        configured: res.data.standardEmpNum,
        current: res.data.signNum,
        dayShift: res.data.signNum, // 假设白班出勤人数等于实际人数
        nightShift: res.data.wanSignNum // 假设夜班出勤人数为0
      }
    }
  } catch (error) {
    console.error('获取管件组人员信息失败:', error)
  }
}

const handleEquipmentClick = (equipment: any) => {
  // TODO: 打开设备详情弹窗
  console.log('点击设备:', equipment)
}

onMounted(() => {
  fetchData()
  fetchPersonnelPanelData()
  eventBus.on('refreshData', fetchData)
})

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.sheet-metal-group {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  padding: 12px;
}

.personnel-section {
  flex-shrink: 0;
}

.equipment-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.section-title {
  color: #00d4ff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  flex-shrink: 0;
}

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
  min-height: 0;
  overflow: visible;
}

.equipment-list:last-child {
  margin-bottom: 0;
}

.equipment-list :deep(.equipment-card) {
  flex: 1;
  min-height: 0;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.loading-text {
  color: #8cc8ff;
  font-size: 22px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.empty-text {
  color: #8cc8ff;
  font-size: 14px;
  opacity: 0.7;
}
</style>

