<template>
    <div class="temperature-container">
        <div class="temperature-title">
            <h3>温度监控</h3>
        </div>
        <div class="temperature-content">
            <!-- T4炉PLC -->
            <div class="plc-section">
                <div class="plc-header">T4炉PLC</div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">炉内超温：</span>
                        <span class="param-value" :class="{ 'status-yes': t4Data.overTemp, 'status-no': !t4Data.overTemp }">
                            {{ t4Data.overTemp ? '是' : '否' }}
                        </span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">温度到达：</span>
                        <span class="param-value" :class="{ 'status-yes': t4Data.tempReached, 'status-no': !t4Data.tempReached }">
                            {{ t4Data.tempReached ? '是' : '否' }}
                        </span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">保温计时：</span>
                        <span class="param-value">{{ t4Data.holdingTime }}分钟</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">计时结束：</span>
                        <span class="param-value" :class="{ 'status-yes': t4Data.timerEnd, 'status-no': !t4Data.timerEnd }">
                            {{ t4Data.timerEnd ? '是' : '否' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- T6炉PLC -->
            <div class="plc-section">
                <div class="plc-header">T6炉PLC</div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">炉内超温：</span>
                        <span class="param-value" :class="{ 'status-yes': t6Data.overTemp, 'status-no': !t6Data.overTemp }">
                            {{ t6Data.overTemp ? '是' : '否' }}
                        </span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">温度到达：</span>
                        <span class="param-value" :class="{ 'status-yes': t6Data.tempReached, 'status-no': !t6Data.tempReached }">
                            {{ t6Data.tempReached ? '是' : '否' }}
                        </span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">保温计时：</span>
                        <span class="param-value">{{ t6Data.holdingTime }}分钟</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">计时结束：</span>
                        <span class="param-value" :class="{ 'status-yes': t6Data.timerEnd, 'status-no': !t6Data.timerEnd }">
                            {{ t6Data.timerEnd ? '是' : '否' }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 皮膜线PLC -->
            <div class="plc-section">
                <div class="plc-header">皮膜线PLC</div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">生产计量：</span>
                        <span class="param-value">{{ filmData.productionCount }}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">工作温度：</span>
                        <span class="param-value">{{ filmData.workTemp }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">超温状态：</span>
                        <span class="param-value" :class="{ 'status-yes': filmData.overTemp, 'status-no': !filmData.overTemp }">
                            {{ filmData.overTemp ? '是' : '否' }}
                        </span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">固化炉温度：</span>
                        <span class="param-value">{{ filmData.curingTemp }}°C</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'

// 定义数据类型
interface FurnaceData {
    overTemp: boolean      // 炉内超温
    tempReached: boolean   // 温度到达
    holdingTime: number    // 保温计时（分钟）
    timerEnd: boolean      // 计时结束
}

interface FilmData {
    productionCount: number  // 生产计量
    workTemp: number         // 工作温度
    overTemp: boolean        // 超温状态
    curingTemp: number       // 固化炉温度
}

// 响应式数据
const t4Data = ref<FurnaceData>({
    overTemp: false,
    tempReached: false,
    holdingTime: 0,
    timerEnd: false
})

const t6Data = ref<FurnaceData>({
    overTemp: false,
    tempReached: false,
    holdingTime: 0,
    timerEnd: false
})

const filmData = ref<FilmData>({
    productionCount: 0,
    workTemp: 0,
    overTemp: false,
    curingTemp: 0
})

// 模拟数据加载函数
const loadTemperatureData = async () => {
    try {
        // 这里应该调用实际的API接口
        // const response = await getTemperatureData()
        
        // 模拟数据
        t4Data.value = {
            overTemp: Math.random() > 0.8,
            tempReached: Math.random() > 0.3,
            holdingTime: Math.floor(Math.random() * 60),
            timerEnd: Math.random() > 0.7
        }

        t6Data.value = {
            overTemp: Math.random() > 0.8,
            tempReached: Math.random() > 0.3,
            holdingTime: Math.floor(Math.random() * 60),
            timerEnd: Math.random() > 0.7
        }

        filmData.value = {
            productionCount: Math.floor(Math.random() * 1000),
            workTemp: Math.floor(Math.random() * 50) + 150,
            overTemp: Math.random() > 0.9,
            curingTemp: Math.floor(Math.random() * 30) + 180
        }
    } catch (error) {
        console.error('加载温度数据失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    eventBus.on('refreshData', loadTemperatureData)
    loadTemperatureData()
})

onBeforeUnmount(() => {
    eventBus.off('refreshData', loadTemperatureData)
})
</script>

<style scoped>
.temperature-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 2px solid #1e90ff;
}

.temperature-title {
    background: linear-gradient(135deg, #1e90ff, #4169e1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    text-align: center;
}

.temperature-title h3 {
    margin: 0;
    color: white;
    font-size: 14px;
}

.temperature-content {
    flex: 1;
    display: flex;
    /* flex-direction: column; */
    gap: 8px;
    width: 100%;
}

.plc-section {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #1e90ff;
    width: 100%;
}

.plc-header {
    font-size: 14px;
    font-weight: 600;
    color: #1e90ff;
    margin-bottom: 8px;
    text-align: center;
    background: rgba(30, 144, 255, 0.1);
    padding: 4px;
    border-radius: 4px;
}

.plc-params {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 6px;
    height: 90%;
}

.param-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    border: 1px solid rgba(30, 144, 255, 0.3);
}

.param-label {
    font-size: 12px;
    color: #ccc;
    flex-shrink: 0;
    min-width: 80px;
}

/* 大屏幕字体 */
@media (min-width: 1800px) {    
    .param-label {
        font-size: 16px;
    }
}

@media (min-width: 2500px) {    
    .param-label {
        font-size: 18px;
    }
}

.param-value {
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    text-align: right;
}

.status-yes {
    color: #ff4444;
    font-weight: bold;
}

.status-no {
    color: #00ff00;
    font-weight: bold;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .param-item {
        padding: 4px 8px;
        min-height: 28px;
    }
    
    .param-label {
        font-size: 11px;
        min-width: 70px;
    }
    
    .param-value {
        font-size: 12px;
    }
}
</style>
