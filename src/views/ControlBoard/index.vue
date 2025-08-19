<template>
  <div class="control-board">
    <dv-full-screen-container>
      <dv-border-box11 title="浙江阿波罗科技运动有限公司 - 中控大屏" :title-width="500">
        <div class="board-container">
          <!-- 顶部数据区域 -->
          <div class="top-section">
            <DataCard 
              title="今日订单" 
              :value="todayOrders" 
              color="#00FFFF"
            />
            <DataCard 
              title="生产进度" 
              :value="`${productionProgress}%`" 
              color="#00FF00"
            />
            <DataCard 
              title="设备状态" 
              :value="`${activeDevices}/${totalDevices}`" 
              color="#FFA500"
            />
            <DataCard 
              title="库存预警" 
              :value="inventoryWarnings" 
              color="#FF0000"
            />
          </div>

          <!-- 中间地球模型区域 -->
          <div class="center-section">
            <div class="earth-container">
              <EarthModel :modelType="currentModelType" />
            </div>
            <div class="center-info">
              <h2 class="company-title">阿波罗摩托车贸易</h2>
              <p class="company-slogan">全球摩托车贸易领导者</p>
              
              <!-- 模型切换控制 -->
              <div class="model-control">
                <button 
                  @click="currentModelType = 'earth'" 
                  :class="{ active: currentModelType === 'earth' }"
                  class="model-btn"
                >
                  🌍 地球模型
                </button>
                <button 
                  @click="currentModelType = 'motorcycle'" 
                  :class="{ active: currentModelType === 'motorcycle' }"
                  class="model-btn"
                >
                  🏍️ 摩托车模型
                </button>
              </div>
              
              <div class="real-time-data">
                <div class="data-item">
                  <span class="label">实时订单:</span>
                  <span class="value">{{ realTimeOrders }}</span>
                </div>
                <div class="data-item">
                  <span class="label">在线客户:</span>
                  <span class="value">{{ onlineCustomers }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 左侧图表区域 -->
          <div class="left-section">
            <ChartCard title="月度销售趋势" type="line" />
            <ProgressCard title="生产线状态" :items="productionLines" />
          </div>

          <!-- 右侧图表区域 -->
          <div class="right-section">
            <ChartCard title="全球市场分布" type="pie" />
            <StatusCard title="设备运行状态" :items="deviceStatus" />
          </div>

          <!-- 底部进度区域 -->
          <div class="bottom-section">
            <div class="progress-grid">
              <ProgressBar 
                title="订单完成率" 
                :progress="orderCompletionRate" 
                color="success"
              />
              <ProgressBar 
                title="质量合格率" 
                :progress="qualityRate" 
                color="warning"
              />
              <ProgressBar 
                title="交付及时率" 
                :progress="deliveryRate" 
                color="info"
              />
              <ProgressBar 
                title="客户满意度" 
                :progress="satisfactionRate" 
                color="primary"
              />
            </div>
          </div>
        </div>
      </dv-border-box11>
    </dv-full-screen-container>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DataCard from '../../components/DataCard.vue'
import EarthModel from './components/EarthModel.vue'
import ChartCard from './components/ChartCard.vue'
import ProgressCard from './components/ProgressCard.vue'
import StatusCard from './components/StatusCard.vue'
import ProgressBar from './components/ProgressBar.vue'

// 响应式数据
const todayOrders = ref(156)
const productionProgress = ref(87)
const activeDevices = ref(23)
const totalDevices = ref(28)
const inventoryWarnings = ref(3)
const realTimeOrders = ref(12)
const onlineCustomers = ref(89)

// 模型类型控制
const currentModelType = ref('earth')

// 进度数据
const orderCompletionRate = ref(94)
const qualityRate = ref(98)
const deliveryRate = ref(96)
const satisfactionRate = ref(95)

// 生产线数据
const productionLines = ref([
  { name: '生产线A', status: 'running', progress: 85 },
  { name: '生产线B', status: 'running', progress: 72 },
  { name: '生产线C', status: 'maintenance', progress: 0 },
  { name: '生产线D', status: 'running', progress: 93 }
])

// 设备状态数据
const deviceStatus = ref([
  { name: '激光切割机', status: 'online', uptime: '98.5%' },
  { name: '冲压设备', status: 'online', uptime: '96.2%' },
  { name: '焊接设备', status: 'offline', uptime: '0%' },
  { name: '检测设备', status: 'online', uptime: '99.1%' }
])

// 定时器
let timer = null

onMounted(() => {
  // 启动实时数据更新
  timer = setInterval(() => {
    // 模拟实时数据变化
    realTimeOrders.value = Math.floor(Math.random() * 20) + 5
    onlineCustomers.value = Math.floor(Math.random() * 30) + 70
  }, 5000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.control-board {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.board-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: grid;
  grid-template-areas: 
    "top top top top"
    "left center center right"
    "left center center right"
    "bottom bottom bottom bottom";
  grid-template-rows: 120px 1fr 1fr 150px;
  grid-template-columns: 400px 1fr 1fr 400px;
  gap: 20px;
}

.top-section {
  grid-area: top;
  display: flex;
  gap: 20px;
  align-items: center;
}

.center-section {
  grid-area: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.earth-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.center-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.company-title {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.company-slogan {
  color: #00ffff;
  font-size: 16px;
  margin: 0 0 15px 0;
  opacity: 0.8;
}

.real-time-data {
  display: flex;
  gap: 30px;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-item .label {
  color: #888;
  font-size: 12px;
  margin-bottom: 5px;
}

.data-item .value {
  color: #00ffff;
  font-size: 18px;
  font-weight: bold;
}

/* 模型控制按钮样式 */
.model-control {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
}

.model-btn {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.model-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: rgba(0, 255, 255, 0.8);
  transform: translateY(-2px);
}

.model-btn.active {
  background: rgba(0, 255, 255, 0.3);
  border-color: rgba(0, 255, 255, 1);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.model-btn:active {
  transform: translateY(0);
}

.left-section {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-section {
  grid-area: right;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bottom-section {
  grid-area: bottom;
  display: flex;
  align-items: center;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1600px) {
  .board-container {
    grid-template-columns: 350px 1fr 1fr 350px;
  }
}

@media (max-width: 1400px) {
  .board-container {
    grid-template-columns: 300px 1fr 1fr 300px;
  }
}
</style>