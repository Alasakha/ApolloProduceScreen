<template>
  <div class="equipment-gallery">
    <div class="gallery-grid">
      <div
        v-for="(equipment, index) in equipmentList"
        :key="index"
        class="gallery-item"
        :class="{ active: selectedIndex === index }"
        @click="handleSelect(equipment, index)"
      >
        <div class="equipment-image-container">
          <img 
            v-if="getEquipmentImage(equipment.name)" 
            :src="getEquipmentImage(equipment.name)" 
            :alt="equipment.name"
            class="equipment-image"
          />
          <div v-else class="equipment-image-placeholder">
            <div class="placeholder-icon">📷</div>
          </div>
        </div>
        <div class="equipment-name">{{ equipment.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gebanjiImg from '@/assets/equipment/gebanji.jpg'
import geguanjiImg from '@/assets/equipment/geguanji.jpg'
import wanguanjiImg from '@/assets/equipment/wanguanji.jpg'
import jieyanjiImg from '@/assets/equipment/sonxia.png'

const emit = defineEmits<{
  (e: 'equipment-select', equipment: any): void
}>()

const selectedIndex = ref(0)

// 根据设备名称获取对应的图片
const getEquipmentImage = (name: string): string | null => {
  if (!name) return null
  
  const nameLower = name.toLowerCase()
  
  // 割板机
  if (nameLower.includes('割板') || nameLower.includes('gebanji')) {
    return gebanjiImg
  }
  // 割管机
  if (nameLower.includes('割管') || nameLower.includes('geguanji')) {
    return geguanjiImg
  }
  // 弯管机
  if (nameLower.includes('弯管') || nameLower.includes('wanguanji')) {
    return wanguanjiImg
  }
  // 焊接机器人
  if (nameLower.includes('焊接') || nameLower.includes('jieyanji')) {
    return jieyanjiImg
  }
  
  return null
}

const equipmentList = ref([
  { name: '激光割管机1', status: '运行中', totalRunningTime: '1250小时', nextMaintenanceTime: '2024-12-25' },
  { name: '激光割管机2', status: '待机', totalRunningTime: '980小时', nextMaintenanceTime: '2024-12-20' },
  { name: '激光割管机3', status: '运行中', totalRunningTime: '1100小时', nextMaintenanceTime: '2024-12-22' },
  { name: '自动弯管机1', status: '运行中', totalRunningTime: '1350小时', nextMaintenanceTime: '2024-12-28' },
  { name: '自动弯管机2', status: '待机', totalRunningTime: '890小时', nextMaintenanceTime: '2024-12-18' },
  { name: '激光割板机1', status: '运行中', totalRunningTime: '1200小时', nextMaintenanceTime: '2024-12-24' },
  { name: '激光割板机2', status: '运行中', totalRunningTime: '1050小时', nextMaintenanceTime: '2024-12-21' },
  { name: '松下焊接机器人工作站', status: '运行中', totalRunningTime: '1500小时', nextMaintenanceTime: '2024-12-30' }
])

const handleSelect = (equipment: any, index: number) => {
  selectedIndex.value = index
  emit('equipment-select', equipment)
}

// 组件挂载时自动选择第一个设备
onMounted(() => {
  if (equipmentList.value.length > 0) {
    handleSelect(equipmentList.value[0], 0)
  }
})
</script>

<style scoped>
.equipment-gallery {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  height: 100%;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(0, 150, 255, 0.1);
  border: 2px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 0;
  overflow: hidden;
}

.gallery-item:hover {
  background: rgba(0, 150, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
}

.gallery-item.active {
  background: rgba(0, 212, 255, 0.2);
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.equipment-image-container {
  width: 100%;
  flex: 1;
  min-height: 0;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
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
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 32px;
  opacity: 0.5;
}

.equipment-name {
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  word-break: break-all;
  flex-shrink: 0;
  margin-top: 4px;
  line-height: 1.2;
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .gallery-grid {
    gap: 16px;
  }
  
  .equipment-name {
    font-size: 14px;
  }
  
  .placeholder-icon {
    font-size: 40px;
  }
}
</style>


