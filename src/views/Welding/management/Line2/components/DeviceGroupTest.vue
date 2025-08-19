<template>
  <div class="device-group-test">
    <div class="test-header">
      <h3>设备组代码映射测试</h3>
      <p>点击下面的设备组代码按钮来查看对应的设备列表</p>
    </div>
    
    <div class="code-buttons">
      <el-button 
        v-for="(groupName, code) in deviceGroupCodes" 
        :key="code"
        type="primary"
        @click="handleGroupCodeClick(code)"
        class="group-code-btn"
      >
        {{ code }} - {{ groupName }}
      </el-button>
    </div>
    
    <div class="device-list" v-if="selectedDevices.length > 0">
      <h4>{{ selectedGroupName }} 设备列表</h4>
      <div class="device-cards">
        <div 
          v-for="device in selectedDevices" 
          :key="device.macNo"
          class="device-card"
          :class="{ running: device.isRunning }"
        >
          <div class="device-header">
            <span class="device-no">{{ device.macNo }}</span>
            <span class="device-status" :class="device.isRunning ? 'running' : 'waiting'">
              {{ device.isRunning ? '运行中' : '待机' }}
            </span>
          </div>
          <div class="device-info">
            <p><strong>厂商:</strong> {{ device.manufacturer }}</p>
            <p><strong>存放部门:</strong> {{ device.storage }}</p>
            <p><strong>工序:</strong> {{ device.processName }}</p>
          </div>
          <div class="device-progress" v-if="device.isRunning">
            <el-progress 
              :percentage="device.progress" 
              :color="getProgressColor(device.progress)"
              :stroke-width="8"
            />
            <div class="progress-text">
              {{ device.num }}/{{ device.planQty }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 设备组代码映射
const deviceGroupCodes = {
  'WG_ALL': '弯管设备组',
  'YJ_ALL': '压机设备组', 
  'SG_ALL': '缩管设备组',
  'GH_ALL': '滚花设备组',
  'CHH_ALL': '冲弧设备组',
  'TZ_ALL': '台钻设备组',
  'CHC_ALL': '冲床设备组'
}

// 选中的设备列表和组名
const selectedDevices = ref([])
const selectedGroupName = ref('')

// 设备数据 - 从DeviceGroupDialog组件复制的数据结构
const staticDeviceData = [
  // 弯管设备组 (WG_ALL) - 3台设备
  { groupName: '弯管设备组', groupCode: 'WG_ALL', macNo: 'SB-39X4A-2S', manufacturer: '和和机械（张家港）有限公司', storage: '1001/2001', isRunning: true, progress: 75, planQty: 100, num: 75 },
  { groupName: '弯管设备组', groupCode: 'WG_ALL', macNo: 'SB-39X4A-2S', manufacturer: '和和机械（张家港）有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 120, num: 0 },
  { groupName: '弯管设备组', groupCode: 'WG_ALL', macNo: 'SB-38NC', manufacturer: '张家港市兵丰机械制造有限公司', storage: '1001/2001', isRunning: true, progress: 60, planQty: 80, num: 48 },
  
  // 压机设备组 (YJ_ALL) - 2台设备  
  { groupName: '压机设备组', groupCode: 'YJ_ALL', macNo: 'Y32-315T', manufacturer: '佛山市南海街金鑫液压机械有限公司', storage: '1001/2001', isRunning: true, progress: 85, planQty: 150, num: 128 },
  { groupName: '压机设备组', groupCode: 'YJ_ALL', macNo: 'QC12Y-8*2500', manufacturer: '安徽中德机床股份有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 200, num: 0 },
  
  // 缩管设备组 (SG_ALL) - 2台设备
  { groupName: '缩管设备组', groupCode: 'SG_ALL', macNo: 'SAM-50', manufacturer: '广东省东莞市晨麒金属制品有限公司', storage: '1001/2001', isRunning: true, progress: 90, planQty: 90, num: 81 },
  { groupName: '缩管设备组', groupCode: 'SG_ALL', macNo: 'LP-3007', manufacturer: '常州龙鹏机械有限公司', storage: '1001/2001', isRunning: true, progress: 45, planQty: 110, num: 50 },
  
  // 滚花设备组 (GH_ALL) - 2台设备
  { groupName: '滚花设备组', groupCode: 'GH_ALL', macNo: 'LP-2008', manufacturer: '常州龙鹏机械有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 160, num: 0 },
  { groupName: '滚花设备组', groupCode: 'GH_ALL', macNo: 'ML-CH502', manufacturer: '张家港农发科技集团机械科技有限公司', storage: '1001/2001', isRunning: true, progress: 65, planQty: 140, num: 91 },
  
  // 冲弧设备组 (CHH_ALL) - 4台设备
  { groupName: '冲弧设备组', groupCode: 'CHH_ALL', macNo: 'CN-50', manufacturer: '张家港市亿格创机械有限公司', storage: '1001/2001', isRunning: true, progress: 80, planQty: 130, num: 104 },
  { groupName: '冲弧设备组', groupCode: 'CHH_ALL', macNo: 'CN-50', manufacturer: '张家港市亿格创机械有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 125, num: 0 },
  { groupName: '冲弧设备组', groupCode: 'CHH_ALL', macNo: 'ML-425', manufacturer: '张家港农发科技集团机械科技有限公司', storage: '1001/2001', isRunning: true, progress: 55, planQty: 180, num: 99 },
  { groupName: '冲弧设备组', groupCode: 'CHH_ALL', macNo: 'MC-315B', manufacturer: '永康市志敏机电', storage: '1001/2001', isRunning: true, progress: 70, planQty: 170, num: 119 },
  
  // 台钻设备组 (TZ_ALL) - 8台设备
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'Z5040A', manufacturer: '杭州双龙机械有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 95, num: 0 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'Z4116/2', manufacturer: '浙江台康金宝塑机厂', storage: '1001/2001', isRunning: true, progress: 40, planQty: 85, num: 34 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'Z4116', manufacturer: '浙江台康金宝塑机厂', storage: '1001/2001', isRunning: true, progress: 35, planQty: 75, num: 26 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'JZB4120', manufacturer: '安徽省黄山台钻有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 105, num: 0 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'JZB4120', manufacturer: '安徽省黄山台钻有限公司', storage: '1001/2001', isRunning: true, progress: 50, planQty: 115, num: 58 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'SWJ-16G', manufacturer: '浙江西菱股份有限公司', storage: '1001/2001', isRunning: true, progress: 85, planQty: 120, num: 102 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'SWJ-16G', manufacturer: '浙江西菱股份有限公司', storage: '1001/2001', isRunning: false, progress: 0, planQty: 100, num: 0 },
  { groupName: '台钻设备组', groupCode: 'TZ_ALL', macNo: 'JS-6.3', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: true, progress: 75, planQty: 90, num: 68 },
  
  // 冲床设备组 (CHC_ALL) - 12台设备
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JS-16', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: true, progress: 95, planQty: 110, num: 105 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JB23-40T', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: false, progress: 0, planQty: 130, num: 0 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'J21-80', manufacturer: '上海机床有限公司', storage: '1001/2001', isRunning: true, progress: 30, planQty: 140, num: 42 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'J21-80', manufacturer: '上海机床有限公司', storage: '1001/2001', isRunning: true, progress: 65, planQty: 150, num: 98 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'J21-80', manufacturer: '上海第二锻压机械厂', storage: '1001/2001', isRunning: false, progress: 0, planQty: 160, num: 0 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JB23-63', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: true, progress: 80, planQty: 135, num: 108 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JF21-100T', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: true, progress: 40, planQty: 125, num: 50 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JS-6.3', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: false, progress: 0, planQty: 115, num: 0 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JD23-35', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: true, progress: 55, planQty: 145, num: 80 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JS-16', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: true, progress: 70, planQty: 155, num: 109 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'JS-16', manufacturer: '浙江锦压机械厂', storage: '1001/2001', isRunning: false, progress: 0, planQty: 165, num: 0 },
  { groupName: '冲床设备组', groupCode: 'CHC_ALL', macNo: 'ALP-160V', manufacturer: '金澳兰', storage: '1001/2001', isRunning: true, progress: 25, planQty: 175, num: 44 }
]

// 点击设备组代码按钮
const handleGroupCodeClick = (groupCode: string) => {
  console.log(`点击设备组代码: ${groupCode}`)
  
  const devices = staticDeviceData.filter(device => device.groupCode === groupCode)
  const groupName = deviceGroupCodes[groupCode]
  
  selectedDevices.value = devices.map(device => ({
    ...device,
    processName: device.isRunning ? `${device.groupName}作业` : '待机'
  }))
  selectedGroupName.value = groupName
  
  console.log(`${groupName} 设备列表:`, selectedDevices.value)
}

// 进度条颜色
const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return '#00ee00'
  if (percentage >= 50) return '#ffaa00'
  return '#ff4444'
}

onMounted(() => {
  console.log('设备组代码映射测试组件已加载')
  console.log('可用的设备组代码:', Object.keys(deviceGroupCodes))
})
</script>

<style scoped>
.device-group-test {
  padding: 1rem;
  background: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
}

.test-header {
  margin-bottom: 2rem;
  text-align: center;
}

.test-header h3 {
  color: #00eeff;
  margin-bottom: 0.5rem;
}

.test-header p {
  color: #cccccc;
  margin: 0;
}

.code-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.group-code-btn {
  min-width: 200px;
  height: 50px;
  font-size: 14px;
  font-weight: bold;
}

.device-list {
  margin-top: 2rem;
}

.device-list h4 {
  color: #00eeff;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.device-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.device-card {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.device-card.running {
  border-color: #00eeff;
  box-shadow: 0 0 10px rgba(0, 238, 255, 0.3);
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 238, 255, 0.2);
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
}

.device-no {
  font-size: 1.1rem;
  font-weight: bold;
  color: #00eeff;
}

.device-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.device-status.running {
  background: rgba(0, 238, 0, 0.2);
  color: #00ee00;
  border: 1px solid #00ee00;
}

.device-status.waiting {
  background: rgba(255, 170, 0, 0.2);
  color: #ffaa00;
  border: 1px solid #ffaa00;
}

.device-info {
  margin-bottom: 1rem;
}

.device-info p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #cccccc;
}

.device-info strong {
  color: #ffffff;
}

.device-progress {
  margin-top: 1rem;
}

.progress-text {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #00eeff;
  font-weight: bold;
}
</style>