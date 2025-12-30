<template>
  <div class="equipment-info">
    <div class="title">自动化智能生产设备</div>
    <div class="info-container">
      <!-- 设备图片 -->
      <div class="equipment-image-container">
        <img 
          v-if="equipmentImage" 
          :src="equipmentImage" 
          :alt="equipmentInfo.name"
          class="equipment-image"
        />
        <div v-else class="equipment-image-placeholder">
          <div class="placeholder-text">设备图片</div>
        </div>
      </div>
      
      <!-- 设备信息 -->
    <div class="info-panel">
        <div class="info-item">
          <div class="info-label">设备状态</div>
          <div class="info-value">{{ equipmentInfo.status }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">总运行时间</div>
          <div class="info-value">{{ equipmentInfo.totalRunningTime }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">下次保养时间</div>
          <div class="info-value">{{ equipmentInfo.nextMaintenanceTime }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">设备名称</div>
          <div class="info-value">{{ equipmentInfo.name }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="instruction">
      说明:点击下面设备图示,上面设备及设备信息自动切换
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import gebanjiImg from '@/assets/equipment/gebanji.jpg'
import geguanjiImg from '@/assets/equipment/geguanji.jpg'
import wanguanjiImg from '@/assets/equipment/wanguanji.jpg'
import jieyanjiImg from '@/assets/equipment/sonxia.png'
import { getSingleMachineInfo, type SingleMachineInfoItem } from '@/api/equipment'

const props = defineProps<{
  selectedEquipment?: any
}>()

const machineList = ref<SingleMachineInfoItem[]>([])
const equipmentInfo = ref({
  name: '激光割管机1',
  status: '运行中',
  totalRunningTime: '1250小时',
  nextMaintenanceTime: '2024-12-25'
})

// 获取机器信息
const fetchMachineInfo = async () => {
  try {
    const res = await getSingleMachineInfo()
    if (res.code === 200 && res.data) {
      machineList.value = res.data
      // 如果有选中的设备，更新信息
      if (props.selectedEquipment) {
        updateEquipmentInfo(props.selectedEquipment)
      } else if (machineList.value.length > 0) {
        // 默认显示第一个设备
        const firstMachine = machineList.value[0]
        updateEquipmentInfoFromMachine(firstMachine)
      }
    }
  } catch (error) {
    console.error('获取机器信息失败:', error)
  }
}

// 从接口数据更新设备信息
const updateEquipmentInfoFromMachine = (machine: SingleMachineInfoItem) => {
  equipmentInfo.value = {
    name: machine.macName || '未知设备',
    status: machine.state || '待机',
    totalRunningTime: `${machine.powerOnTime}小时`,
    nextMaintenanceTime: machine.nextBaoyangTime || '-'
  }
}

// 根据选中的设备更新信息
const updateEquipmentInfo = (equipment: any) => {
  // 如果 equipment 有 macNo 或 macName，从接口数据中查找
  if (equipment?.macNo || equipment?.macName) {
    const machine = machineList.value.find(
      m => m.macNo === equipment.macNo || m.macName === equipment.macName || m.macName === equipment.name
    )
    if (machine) {
      updateEquipmentInfoFromMachine(machine)
      return
    }
  }
  
  // 否则使用传入的数据
  equipmentInfo.value = {
    name: equipment.name || equipment.macName || '未知设备',
    status: equipment.status || equipment.state || '待机',
    totalRunningTime: equipment.totalRunningTime || `${equipment.powerOnTime || 0}小时`,
    nextMaintenanceTime: equipment.nextMaintenanceTime || equipment.nextBaoyangTime || '-'
  }
}

// 根据设备名称获取对应的图片
const getEquipmentImage = (name: string): string | null => {
  if (!name) return null
  
  const nameLower = name.toLowerCase()
  
  // 割板机
  if (nameLower.includes('割板') || nameLower.includes('gebanji')) {
    return gebanjiImg
  }
  // 割管机
  if (nameLower.includes('切管') ||  nameLower.includes('割管')) {
    return geguanjiImg
  }
  // 弯管机
  if (nameLower.includes('弯管') || nameLower.includes('wanguanji')) {
    return wanguanjiImg
  }
  // 焊接机器人
  if (nameLower.includes('焊') || nameLower.includes('jieyanji')) {
    return jieyanjiImg
  }
  
  return null
}

// 计算当前设备的图片
const equipmentImage = computed(() => {
  return getEquipmentImage(equipmentInfo.value.name)
})

watch(() => props.selectedEquipment, (newEquipment) => {
  if (newEquipment) {
    updateEquipmentInfo(newEquipment)
  }
}, { immediate: true })

onMounted(() => {
  fetchMachineInfo()
})
</script>

<style scoped>
.equipment-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  color: #00d4ff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  min-height: 0;
}

.equipment-image-container {
  flex: 0 0 auto;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(0, 150, 255, 0.1);
  border: 2px solid rgba(0, 212, 255, 0.3);
  padding: 8px;
  width: 100%;
}

.equipment-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

.equipment-image-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(0, 150, 255, 0.1);
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
}

.info-panel {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 12px;
  min-height: 0;
  overflow-y: auto;
  align-content: start;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(0, 150, 255, 0.2);
}

.info-label {
  color: #ffffff;
  font-size: 14px;
}

.info-value {
  color: #00d4ff;
  font-size: 16px;
  font-weight: bold;
}

.instruction {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-align: center;
  padding: 8px;
  background: rgba(0, 150, 255, 0.1);
  border-radius: 4px;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .title {
    font-size: 20px;
  }
  
  .info-label {
    font-size: 16px;
  }
  
  .info-value {
    font-size: 18px;
  }
  
  .instruction {
    font-size: 14px;
  }
}
</style>


