<template>
    <div class="temperature-container" :class="{ 'warning-container': hasWarning }">
        <div class="temperature-title" :class="{ 'warning-title': hasWarning }">
            <h3>温度监控</h3>
            <div v-if="hasWarning" class="warning-badge">⚠️ 温度异常</div>
        </div>
        <div class="temperature-content">
            <!-- T4炉PLC -->
            <div class="plc-section" :class="{ 'warning-section': t4Warning }">
                <div class="plc-header" :class="{ 'warning-header': t4Warning }">
                    T4炉PLC
                    <span v-if="t4Warning" class="warning-icon">⚠️</span>
                </div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">标准温度(±5°C)：</span>
                        <span class="param-value">{{ t4Data.standard }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">实际温度：</span>
                        <span class="param-value" :class="{ 'warning-value': t4Warning, 'offline-value': t4Data.actual === 0 }">
                            <template v-if="t4Data.actual === 0">
                                <span class="offline-text">未开机</span>
                            </template>
                            <template v-else>
                                {{ t4Data.actual }}°C
                                <span v-if="t4Warning" class="warning-diff">
                                    ({{ t4Diff > 0 ? '+' : '' }}{{ t4Diff.toFixed(1) }}°C)
                                </span>
                            </template>
                        </span>
                    </div>
                </div>
            </div>

            <!-- T6炉PLC -->
            <div class="plc-section" :class="{ 'warning-section': t6Warning }">
                <div class="plc-header" :class="{ 'warning-header': t6Warning }">
                    T6炉PLC
                    <span v-if="t6Warning" class="warning-icon">⚠️</span>
                </div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">标准温度(±5°C)：</span>
                        <span class="param-value">{{ t6Data.standard }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">实际温度：</span>
                        <span class="param-value" :class="{ 'warning-value': t6Warning, 'offline-value': t6Data.actual === 0 }">
                            <template v-if="t6Data.actual === 0">
                                <span class="offline-text">未开机</span>
                            </template>
                            <template v-else>
                                {{ t6Data.actual }}°C
                                <span v-if="t6Warning" class="warning-diff">
                                    ({{ t6Diff > 0 ? '+' : '' }}{{ t6Diff.toFixed(1) }}°C)
                                </span>
                            </template>
                        </span>
                    </div>
                </div>
            </div>

            <!-- 皮膜线PLC -->
            <div class="plc-section" :class="{ 'warning-section': pmxWarning }">
                <div class="plc-header" :class="{ 'warning-header': pmxWarning }">
                    皮膜线PLC
                    <span v-if="pmxWarning" class="warning-icon">⚠️</span>
                </div>
                <div class="plc-params">
                    <div class="param-item">
                        <span class="param-label">标准温度(±5°C)</span>
                        <span class="param-value">{{ pmxData.standard }}°C</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">实际温度：</span>
                        <span class="param-value" :class="{ 'warning-value': pmxWarning, 'offline-value': pmxData.actual === 0 }">
                            <template v-if="pmxData.actual === 0">
                                <span class="offline-text">未开机</span>
                            </template>
                            <template v-else>
                                {{ pmxData.actual }}°C
                                <span v-if="pmxWarning" class="warning-diff">
                                    ({{ pmxDiff > 0 ? '+' : '' }}{{ pmxDiff.toFixed(1) }}°C)
                                </span>
                            </template>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getTemperature1 } from '@/api/getStampWeldinfo'

// 定义数据类型
interface TemperatureData {
    standard: number    // 标准温度
    actual: number      // 实际温度
}

// 响应式数据
const t4Data = ref<TemperatureData>({
    standard: 0,
    actual: 0
})

const t6Data = ref<TemperatureData>({
    standard: 0,
    actual: 0
})

const pmxData = ref<TemperatureData>({
    standard: 0,
    actual: 0
})

// 温度差值计算
const t4Diff = computed(() => t4Data.value.actual - t4Data.value.standard)
const t6Diff = computed(() => t6Data.value.actual - t6Data.value.standard)
const pmxDiff = computed(() => pmxData.value.actual - pmxData.value.standard)

// 警告判断：超过标准温度±5度（温度为0时不触发警告，表示未开机）
const t4Warning = computed(() => t4Data.value.actual !== 0 && Math.abs(t4Diff.value) > 5)
const t6Warning = computed(() => t6Data.value.actual !== 0 && Math.abs(t6Diff.value) > 5)
const pmxWarning = computed(() => pmxData.value.actual !== 0 && Math.abs(pmxDiff.value) > 5)

// 是否有任何警告
const hasWarning = computed(() => t4Warning.value || t6Warning.value || pmxWarning.value)

// 定时器引用
let refreshTimer: NodeJS.Timeout | null = null

// 加载温度数据
const loadTemperatureData = async () => {
    try {
        const response = await getTemperature1()
        const tempData = response.data
        
        // T4炉数据
        t4Data.value = {
            standard: tempData.t4Standard,
            actual: tempData.t4
        }
        
        // T6炉数据
        t6Data.value = {
            standard: tempData.t6Standard,
            actual: tempData.t6
        }
        
        // 皮膜线数据
        pmxData.value = {
            standard: tempData.pmxStandard,
            actual: tempData.pmx
        }
    } catch (error) {
        console.error('加载温度数据失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    eventBus.on('refreshData', loadTemperatureData)
    loadTemperatureData()
    
    // 设置定时刷新（每30秒刷新一次）
    refreshTimer = setInterval(loadTemperatureData, 30000)
})

onBeforeUnmount(() => {
    eventBus.off('refreshData', loadTemperatureData)
    if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
    }
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
    transition: border-color 0.3s ease;
}

.temperature-container.warning-container {
    border: 2px solid #ff9800;
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
}

.temperature-title {
    background: linear-gradient(135deg, #1e90ff, #4169e1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    text-align: center;
    position: relative;
    transition: background 0.3s ease;
}

.temperature-title.warning-title {
    background: linear-gradient(135deg, #ff9800, #ff6b00);
}

.temperature-title h3 {
    margin: 0;
    color: white;
    font-size: 14px;
}

.warning-badge {
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 12px;
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 4px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
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
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.plc-section.warning-section {
    border: 2px solid #ff9800;
    box-shadow: 0 0 8px rgba(255, 152, 0, 0.4);
    animation: warning-glow 2s infinite;
}

@keyframes warning-glow {
    0%, 100% {
        box-shadow: 0 0 8px rgba(255, 152, 0, 0.4);
    }
    50% {
        box-shadow: 0 0 15px rgba(255, 152, 0, 0.7);
    }
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
    transition: background 0.3s ease, color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

.plc-header.warning-header {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
}

.warning-icon {
    font-size: 16px;
    animation: shake 0.5s infinite;
}

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-2px);
    }
    75% {
        transform: translateX(2px);
    }
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
    transition: color 0.3s ease;
}

.param-value.warning-value {
    color: #ff9800;
    font-weight: 600;
}

.warning-diff {
    font-size: 12px;
    margin-left: 4px;
    color: #ff6b00;
    font-weight: 600;
}

.offline-value {
    color: #888 !important;
}

.offline-text {
    font-size: 14px;
    color: #888;
    font-style: italic;
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
