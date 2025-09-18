<template>
    <div class="equipment-container">
        <div class="equipment-title">
            <h3>设备状态</h3>
        </div>
        <div class="equipment-content">
            <div class="equipment-cards">
                <div class="equipment-card total">
                    <div class="card-label">设备组数量</div>
                    <div class="card-value">{{ equipmentData.total ?? '--' }}</div>
                </div>

                <div class="equipment-card running">
                    <div class="card-label">开机数量</div>
                    <div class="card-value">{{ equipmentData.running ?? '--' }}</div>
                </div>
                
                <div class="equipment-card fault">
                    <div class="card-label">故障数量</div>
                    <div class="card-value">{{ equipmentData.guzhang ?? '--' }}</div>
                </div>
                
                <div class="equipment-card standby">
                    <div class="card-label">待机数量</div>
                    <div class="card-value">{{ equipmentData.hold ?? '--' }}</div>
                </div>
            </div>
            
            <!-- 设备状态统计 -->
            <div class="equipment-summary">
                <div class="summary-item">
                    <span class="summary-label">开机率:</span>
                    <span class="summary-value">{{ runningRate }}%</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">故障率:</span>
                    <span class="summary-value">{{ faultRate }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from '@/utils/eventbus'
import { getEquipment, type Equipment } from '@/api/getStampinfo'

// 响应式数据
const equipmentData = ref<Equipment>({
    running: 0,
    guzhang: 0,
    total: 0,
    hold: 0
})

// 计算属性 - 运行率
const runningRate = computed(() => {
    if (equipmentData.value.total === 0) return '--'
    return ((equipmentData.value.running / equipmentData.value.total) * 100).toFixed(1)
})

// 计算属性 - 故障率
const faultRate = computed(() => {
    if (equipmentData.value.total === 0) return '--'
    return ((equipmentData.value.guzhang / equipmentData.value.total) * 100).toFixed(1)
})

// 加载设备数据
const loadEquipmentData = async () => {
    try {
        const response = await getEquipment()
        equipmentData.value = response.data
    } catch (error) {
        console.error('加载设备数据失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    eventBus.on('refreshData', loadEquipmentData)
    loadEquipmentData()
})

onBeforeUnmount(() => {
    eventBus.off('refreshData', loadEquipmentData)
})
</script>

<style scoped>
.equipment-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 2px solid #1e90ff;
}

.equipment-title {
    background: linear-gradient(135deg, #1e90ff, #4169e1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    text-align: center;
}

.equipment-title h3 {
    margin: 0;
    color: white;
    font-size: 14px;
}

.equipment-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.equipment-cards {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.equipment-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: 8px;
    border: 1px solid;
    background: rgba(0, 0, 0, 0.15);
    min-height: 80px;
}

.equipment-card.running {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.2);
}

.equipment-card.fault {
    border-color: #ff4444;
    background: rgba(255, 68, 68, 0.2);
}

.equipment-card.standby {
    border-color: #ffaa00;
    background: rgba(255, 170, 0, 0.2);
}

.equipment-card.total {
    border-color: #1e90ff;
    background: rgba(30, 144, 255, 0.2);
}

.card-label {
    font-size: 12px;
    color: #fff;
    margin-bottom: 8px;
    text-align: center;
    font-weight: 500;
}

.card-value {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    text-align: center;
}

.equipment-summary {
    display: flex;
    justify-content: space-around;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    border: 1px solid rgba(30, 144, 255, 0.3);
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.summary-label {
    font-size: 16px;
    color: #1e90ff;
    font-weight: 500;
}

.summary-value {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}
</style>
