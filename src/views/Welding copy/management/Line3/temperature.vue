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
                        <span class="param-label">固化炉温度：</span>
                        <span class="param-value">{{ t4Data.curingTemp }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">工作温度：</span>
                        <span class="param-value">{{ t4Data.workTemp }}°C</span>
                    </div>
                </div>
            </div>

            <!-- T6炉PLC -->
            <div class="plc-section">
                <div class="plc-header">T6炉PLC</div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">固化炉温度：</span>
                        <span class="param-value">{{ t6Data.curingTemp }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">工作温度：</span>
                        <span class="param-value">{{ t6Data.workTemp }}°C</span>
                    </div>
                </div>
            </div>

            <!-- 皮膜线PLC -->
            <div class="plc-section">
                <div class="plc-header">皮膜线PLC</div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">固化炉温度：</span>
                        <span class="param-value">{{ filmData.curingTemp }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">工作温度：</span>
                        <span class="param-value">{{ filmData.workTemp }}°C</span>
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
    curingTemp: number     // 固化炉温度
    workTemp: number       // 工作温度
}

interface FilmData {
    curingTemp: number     // 固化炉温度
    workTemp: number       // 工作温度
}

// 响应式数据
const t4Data = ref<FurnaceData>({
    curingTemp: 0,
    workTemp: 0
})

const t6Data = ref<FurnaceData>({
    curingTemp: 0,
    workTemp: 0
})

const filmData = ref<FilmData>({
    curingTemp: 0,
    workTemp: 0
})

// 模拟数据加载函数
const loadTemperatureData = async () => {
    try {
        // 这里应该调用实际的API接口
        // const response = await getTemperatureData()
        
        // 模拟数据
        t4Data.value = {
            curingTemp: Math.floor(Math.random() * 30) + 180,
            workTemp: Math.floor(Math.random() * 30) + 150
        }

        t6Data.value = {
            curingTemp: Math.floor(Math.random() * 30) + 185,
            workTemp: Math.floor(Math.random() * 30) + 155
        }

        filmData.value = {
            curingTemp: Math.floor(Math.random() * 30) + 175,
            workTemp: Math.floor(Math.random() * 30) + 145
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
    font-size: 19px;
    font-weight: 500;
    color: #fff;
    text-align: right;
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
