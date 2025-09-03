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



// 设备数据（根据Excel表格数据）
const staticDeviceData = [
  // 备料设备组 - 仅保留 groupCode 为 12 的设备
  { groupName: '备料设备组', groupCode: 12, macNo: '1020527', deviceName: '二轴硬模机', model: '100T压床', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020485', deviceName: '自动数控38弯管机', model: '38型', manufacturer: '新中和精工', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '10204851', deviceName: '自动数控38弯管机', model: '38型', manufacturer: '新中和精工', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020522', deviceName: '单头钻床', model: '标准型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020523', deviceName: '双头钻孔机', model: '双头型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020524', deviceName: '中管钻孔机', model: '中管专用', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020525', deviceName: '上下叉切槽打扁冲孔机', model: '复合型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020526', deviceName: '上管双头冲弧机', model: '双头型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020528', deviceName: '卧式冲弧机', model: '卧式型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020529', deviceName: '桥管双头冲弧机', model: '双头型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020530', deviceName: '单头铣弧机', model: '单头型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020531', deviceName: '上叉铣弧机', model: '上叉专用', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020532', deviceName: '下叉铣弧机', model: '下叉专用', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020533', deviceName: '手动攻牙机', model: '手动型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020534', deviceName: '简易倒角机', model: '简易型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020535', deviceName: '单头钻床', model: '标准型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020536', deviceName: '双头钻孔机', model: '双头型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020559', deviceName: '中管钻孔机', model: '中管专用', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020556', deviceName: '车把单头头缩管机', model: '单头型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020557', deviceName: '车把滚花机', model: '滚花型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020470', deviceName: '精密冲床', model: '45T', manufacturer: '莱富机械', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020471', deviceName: '精密冲床', model: '25T', manufacturer: '莱富机械', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020472', deviceName: '精密冲床', model: '25T', manufacturer: '莱富机械', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020473', deviceName: '精密冲床', model: '60T', manufacturer: '莱富机械', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1020474', deviceName: '精密冲床', model: '60T', manufacturer: '莱富机械', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '1021022', deviceName: '立式带锯床', model: '立式型', manufacturer: '未知', storage: '铝车架厂' },
  { groupName: '备料设备组', groupCode: 12, macNo: '10210221', deviceName: '下料机', model: '标准型', manufacturer: '未知', storage: '铝车架厂' },
  
  // 后段设备组
  { groupName: '后段设备组', groupCode: 13, macNo: '1020555', deviceName: '立式中管铰孔机', model: '立式型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020503', deviceName: 'T4炉', model: '双燃烧机', manufacturer: '江苏玮嘉', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020509', deviceName: 'T6炉', model: '双燃烧机', manufacturer: '江苏玮嘉', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020507', deviceName: '皮膜线', model: '标准型', manufacturer: '江苏玮嘉', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020554', deviceName: '中管切沟机', model: '中管专用', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020558', deviceName: '对眼机', model: '标准型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020552', deviceName: '数控车首管镗孔铣平倒角机', model: '数控型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020551', deviceName: '五通攻牙机', model: '五通型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '后段设备组', groupCode: 13, macNo: '1020553', deviceName: '数控碟刹铣平机', model: '数控型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  
  // 焊接设备组 - 唐山松下氩弧焊机（根据图片表格数据）
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020543', deviceName: '前三角校正台', model: '标准型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020542', deviceName: '前后三角组立机', model: '组立型', manufacturer: '昆山万同和机械有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020458', deviceName: '唐山松下氩弧焊机1', model: 'YC-350WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020459', deviceName: '唐山松下氩弧焊机2', model: 'YC-350WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020460', deviceName: '唐山松下氩弧焊机3', model: 'YC-350WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020461', deviceName: '唐山松下氩弧焊机4', model: 'YC-350WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020462', deviceName: '唐山松下氩弧焊机5', model: 'YC-350WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020463', deviceName: '唐山松下氩弧焊机6', model: 'YC-350WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020464', deviceName: '唐山松下氩弧焊机7', model: 'YC-300WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020465', deviceName: '唐山松下氩弧焊机8', model: 'YC-300WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020466', deviceName: '唐山松下氩弧焊机9', model: 'YC-300WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020467', deviceName: '唐山松下氩弧焊机10', model: 'YC-300WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020468', deviceName: '唐山松下氩弧焊机11', model: 'YC-300WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' },
  { groupName: '焊接设备组', groupCode: 14, macNo: '1020469', deviceName: '唐山松下氩弧焊机12', model: 'YC-300WX(N型)', manufacturer: '唐山松下产业机器有限公司', storage: '铝车架厂' }
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.device-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
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
  font-size: 13px;
  color: #ffffff;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
  max-width: 120px;
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
  gap: 8px;
}

.device-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.device-info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  min-width: 70px;
}

.info-value {
  font-size: 13px;
  color: #fff;
  font-weight: 400;
  text-align: right;
  flex: 1;
  margin-left: 10px;
  word-break: break-all;
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