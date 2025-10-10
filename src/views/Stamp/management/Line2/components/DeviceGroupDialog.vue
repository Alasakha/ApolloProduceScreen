<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="设备组详情"
    width="70%"
    class="device-group-dialog"
    :before-close="handleClose"
    destroy-on-close
  >
    <div class="dialog-content">
      <div class="detail-content">
        <div class="header-section">
          <div class="icon-wrapper">
            <div class="device-icon">🏭</div>
          </div>
                         <div class="title-section">
               <h2 class="main-title">设备组信息</h2>
               <p class="subtitle">设备运行状态与生产概览</p>
               
               <!-- 设备卡片列表 -->
               <div class="device-cards-container">
                 <div v-for="(device, index) in showData" :key="index" class="device-card">
                   <div class="device-card-header">
                     <div class="device-number">设备 {{ index + 1 }}</div>
                     
                   </div>
                   
                   <div class="device-card-content">
                     <div class="device-info-row">
                       <span class="info-label">设备组:</span>
                       <span class="info-value">{{ device.groupName }}</span>
                     </div>
                     <div class="device-info-row">
                       <span class="info-label">设备名称:</span>
                       <span class="info-value">{{ device.deviceName }}</span>
                     </div>
                     <div class="device-info-row">
                       <span class="info-label">型号:</span>
                       <span class="info-value">{{ device.model }}</span>
                     </div>
                     <div class="device-info-row">
                       <span class="info-label">制造商:</span>
                       <span class="info-value">{{ device.manufacturer }}</span>
                     </div>
                     <div class="device-info-row">
                       <span class="info-label">仓储位置:</span>
                       <span class="info-value">{{ device.storage }}</span>
                     </div>
                   </div>
                   
                  
                 </div>
               </div>
             </div>
        </div>  
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
const showData = ref([])
interface Props {
  visible: boolean
  data?: any
  type: string
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  type: ''
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()



const staticDeviceData = [
  // 激光设备组 - 4台设备
  // { groupName: '激光设备组', groupCode: 8, macNo: '1020341', manufacturer: '浙江金澳兰机床有限公司', storage: '1001/2001', deviceName: '光纤激光割管机', model: 'T100B' },
  // { groupName: '激光设备组', groupCode: 8, macNo: '1020424', manufacturer: '大族激光智能装备科技(江苏)有限公司', storage: '1001/2001', deviceName: '光纤激光切割机', model: 'G3015-K-H3000' },
  // { groupName: '激光设备组', groupCode: 8, macNo: '10204241', manufacturer: '大族激光智能装备科技(江苏)有限公司', storage: '1001/2001', deviceName: '光纤激光切割机', model: 'G3105PRO-K-H6000' },
  // { groupName: '激光设备组', groupCode: 8, macNo: '10203411', manufacturer: '江苏管力智能装备有限公司', storage: '1001/2001', deviceName: '光纤激光割管机', model: '3KW' },

  // 弯管设备组 - 3台设备
  { groupName: '弯管设备组', groupCode: 1, macNo: '1020149', manufacturer: '和和机械(张家港)有限公司', storage: '1001/2001', deviceName: '全自动弯管机', model: 'SB-39X4A-2S' },
  { groupName: '弯管设备组', groupCode: 1, macNo: '1020150', manufacturer: '和和机械(张家港)有限公司', storage: '1001/2001', deviceName: '全自动弯管机', model: 'SB-39X4A-2S' },
  { groupName: '弯管设备组', groupCode: 1, macNo: '1020273', manufacturer: '张家港市兵丰机械制造有限公司', storage: '1001/2001', deviceName: '半自动弯管机', model: 'SB-38NC' },
  
  // 压机设备组 - 1台设备
  { groupName: '压机设备组', groupCode: 2, macNo: '1020249', manufacturer: '佛山市南海衡盛液压机械有限公司', storage: '1001/2001', deviceName: '315T四柱液压机', model: 'Y32-315T' },
  
  // 缩管设备组 - 1台设备
  { groupName: '缩管设备组', groupCode: 3, macNo: '1020176', manufacturer: '广东省东莞市晨麒金属制品有限公司', storage: '1001/2001', deviceName: '自动缩管机', model: 'SAM-50' },

  // 冲弧设备组 - 2台设备
  { groupName: '冲弧设备组', groupCode: 5, macNo: '1020031', manufacturer: '张家港保税区民联机械科技有限公司', storage: '1001/2001', deviceName: '自动卧式冲弧机', model: 'ML-CH502' },
  // { groupName: '冲弧设备组', groupCode: 5, macNo: '1020033', manufacturer: '张家港市亿格创机械有限公司', storage: '1001/2001', deviceName: '冲弧机', model: 'CN-50' },

  // 手动割管组 - 2台设备
  { groupName: '手动割管组', groupCode: 4, macNo: '1021004', manufacturer: '张家港保税区民联机械科技有限公司', storage: '1001/2001', deviceName: '全自动切管机', model: 'ML-425' },
  { groupName: '手动割管组', groupCode: 4, macNo: '1020226', manufacturer: '永康市志乾机电', storage: '1001/2001', deviceName: '金属圆锯机', model: 'MC-315B' },
  

  // 台钻设备组 - 10台设备
  { groupName: '台钻设备组', groupCode: 6, macNo: '1020217', manufacturer: '杭州双龙机械有限公司', storage: '1001/2001', deviceName: '立式铣床', model: 'Z5040A' },
  { groupName: '台钻设备组', groupCode: 6, macNo: '1021005', manufacturer: '浙江省永康金塔机械厂', storage: '1001/2001', deviceName: '台式钻床', model: 'Z4116/2' },
  { groupName: '台钻设备组', groupCode: 6, macNo: '1021010', manufacturer: '浙江省永康金塔机械厂', storage: '1001/2001', deviceName: '台式钻床', model: 'Z4116' },
  { groupName: '台钻设备组', groupCode: 6, macNo: '1020258', manufacturer: '安徽省黄山台钻有限公司', storage: '1001/2001', deviceName: '自动进刀台式钻床', model: 'JZB4120' },
  { groupName: '台钻设备组', groupCode: 6, macNo: '1020259', manufacturer: '安徽省黄山台钻有限公司', storage: '1001/2001', deviceName: '自动进刀台式钻床', model: 'JZB4120' },
  { groupName: '台钻设备组', groupCode: 6, macNo: '1021006', manufacturer: '浙江西菱股份有限公司', storage: '1001/2001', deviceName: '台式攻丝机', model: 'SWJ-16G' },
  { groupName: '台钻设备组', groupCode: 6, macNo: '1021007', manufacturer: '浙江西菱股份有限公司', storage: '1001/2001', deviceName: '台式攻丝机', model: 'SWJ-16G' },
  // { groupName: '台钻设备组', groupCode: 6, macNo: '1021008', manufacturer: '天成', storage: '1001/2001', deviceName: '台式攻丝机', model: 'SWJ-16G' },
  // { groupName: '台钻设备组', groupCode: 6, macNo: '1021009', manufacturer: '华泰', storage: '1001/2001', deviceName: '台式攻丝机', model: 'SWJ-16G' },
  // { groupName: '台钻设备组', groupCode: 6, macNo: '1021011', manufacturer: '台州市路桥万象电机厂', storage: '1001/2001', deviceName: '砂轮机', model: 'MQJ2325G' },

  // 冲床设备组 - 11台设备
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020180', manufacturer: '浙江铸压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JS-6.3' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020182', manufacturer: '浙江铸压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JS-16' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020221', manufacturer: '上海机床有限公司', storage: '1001/2001', deviceName: '开式固定台压力机', model: 'J21-80' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020222', manufacturer: '上海机床有限公司', storage: '1001/2001', deviceName: '开式固定台压力机', model: 'J21-80' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020223', manufacturer: '上海第二锻压机床厂', storage: '1001/2001', deviceName: '开式固定台压力机', model: 'J21-80' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020220', manufacturer: '浙江锻压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JB23-63' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1021012', manufacturer: '浙江锻压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JF21-100T' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020181', manufacturer: '浙江铸压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JS-6.3' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020219', manufacturer: '浙江铸压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JD23-35' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '10201831', manufacturer: '浙江铸压机床厂', storage: '1001/2001', deviceName: '开式可倾压力机', model: 'JS-16' },
  { groupName: '冲床设备组', groupCode: 7, macNo: '1020298', manufacturer: '金澳兰', storage: '1001/2001', deviceName: '冲床', model: 'ALP-160V' }
]
// 计算设备列表 - 使用写死的数据，支持按组代码筛选

const deviceList = computed(() => {
  return staticDeviceData.map((device, index) => ({
    macNo: device.macNo,
    deviceName: device.deviceName,
    model: device.model,
    machineName: device.manufacturer,
    workNo: `WO-${(index + 1).toString().padStart(4, '0')}`,
    itemName: `${device.groupName}产品`,
    manufacturer: device.manufacturer,
    storage: device.storage,
    groupName: device.groupName,
    groupCode: device.groupCode
    }))
  })


watch(() => props.type, (newType) => {
  console.log('newType', newType)
  // 将string类型的type转换为number进行比较
  const typeNum = parseInt(newType)
  showData.value = deviceList.value.filter(item => typeNum === item.groupCode)
}, { immediate: true })

const handleClose = () => {
  emit('update:visible', false)
}

// 保留props接口以防未来需要，当前使用写死数据
console.log('DeviceGroupDialog props:', props.data?.length || 0)


</script>

<style scoped>
.device-group-dialog :deep(.el-dialog) {
  max-height: 90vh; /* 最大高度占屏幕90% - 从80vh调整到90vh */
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden; /* 防止内部溢出 */

}

.device-group-dialog :deep(.el-dialog__header) {
  overflow-y: auto;

  max-height: calc(90vh - 100px); /* 减去 header/footer 高度 - 从80vh调整到90vh */
  background: linear-gradient(135deg, #2a2a2a, #333);
  border-bottom: 1px solid #444;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

.device-group-dialog :deep(.el-dialog__title) {
  color: #191a1b;
  font-size: 20px;
  font-weight: 600;
}

.device-group-dialog :deep(.el-dialog__close) {
  color: #999;
  font-size: 18px;
}

.device-group-dialog :deep(.el-dialog__close):hover {
  color: #60a5fa;
}

.device-group-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: #1a1a1a;
}

.dialog-content {
  width: 100%;
}

.detail-content {
  color: #fff;
}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #1e40af, #60a5fa);
  border-radius: 12px;
}

.icon-wrapper {
  margin-right: 20px;
}

.device-icon {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
}

.subtitle {
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.stats-summary {
  display: flex;
  gap: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.summary-value.running {
  color: #10b981;
}

.summary-value.waiting {
  color: #f59e0b;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.device-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.device-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.device-card.running::before {
  background: linear-gradient(90deg, #10b981, #22d3ee);
}

.device-card.waiting::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: #555;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #666;
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.status-text {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.device-number {
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.device-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-label {
  font-size: 12px;
  color: #e5e7eb;
  font-weight: 600;
  min-width: 60px;
}

.info-value {
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
  max-width: 140px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-running {
  color: #10b981 !important;
  font-weight: 600;
}

.status-idle {
  color: #f59e0b !important;
  font-weight: 600;
}

.device-progress {
  margin-top: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.progress-percent {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #22d3ee);
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-numbers {
  text-align: center;
  font-size: 11px;
  color: #666;
}

.device-idle {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  margin-top: 16px;
}

.idle-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.idle-text {
  font-size: 12px;
  color: #f59e0b;
  font-weight: 500;
}

.summary-section {
  margin-top: 32px;
}

.summary-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 20px 0;
  border-bottom: 1px solid #444;
  padding-bottom: 12px;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #60a5fa;
}

/* 设备卡片容器 */
.device-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
  max-height: 70vh; /* 从400px调整到500px，增加显示高度 */
  overflow-y: auto;
  padding-right: 10px;
}

/* 设备卡片样式 */
.device-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 16px;
  transition: all 0.3s ease;
}

.device-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 255, 136, 0.1);
}

/* 设备卡片头部 */
.device-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.device-number {
  font-size: 14px;
  font-weight: 600;
  color: #00ff88;
}

.device-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.device-status.running {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.device-status.stopped {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

/* 设备信息行 */
.device-card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.device-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.device-info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: #e5e7eb;
  font-weight: 600;
  min-width: 60px;
}

.info-value {
  font-size: 12px;
  color: #ffffff;
  font-weight: 500;
  text-align: right;
  flex: 1;
  margin-left: 8px;
  word-break: break-all;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 设备进度条样式 */
.device-progress {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
  color: #999;
}

.device-progress .progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.device-progress .progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00cc6a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 滚动条样式 */
.device-cards-container::-webkit-scrollbar {
  width: 6px;
}

.device-cards-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.device-cards-container::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 3px;
}

.device-cards-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 136, 0.5);
}
</style>