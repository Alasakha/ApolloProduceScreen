<template>
  <div class="header-container">
    <div class="stats-item">
      <span class="label">今日排产工单数：</span>
      <span class="value">{{ stats.totalOrders }}</span>
    </div>
    <div class="stats-item">
      <span class="label">已装工单数：</span>
      <span class="value">{{ stats.completedOrders }}</span>
    </div>
    <div class="stats-item">
      <span class="label">已检工单数：</span>
      <span class="value">{{ stats.inspectedOrders }}</span>
    </div>
    <div class="stats-item">
      <span class="label">达成率：</span>
      <span class="value">{{ stats.completionRate }}%</span>
    </div>
    <div class="stats-item">
      <span class="label">合格率：</span>
      <span class="value">{{ stats.qualifiedRate }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  totalOrders: 0,
  completedOrders: 0,
  inspectedOrders: 0,
  completionRate: 0,
  qualifiedRate: 0
})

// TODO: 添加获取数据的方法
const fetchStats = async () => {
  try {
    // 调用API获取数据
    // const response = await getStampStats()
    // stats.value = response.data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #fff;
  font-size: 16px;
}

.value {
  color: #00ff00;
  font-size: 20px;
  font-weight: bold;
}
</style> 