<template>
  <div class="staffing-container">
    <div class="staffing-header">
      <h3>人员配置信息</h3>
    </div>

    <div class="staffing-content">
      <div class="staffing-item">
        <span class="label">配置人数：</span>
        <span class="value">{{ staffing.configured }}</span>
      </div>
      <div class="staffing-item">
        <span class="label">实际人数：</span>
        <span class="value">{{ staffing.actual }}</span>
      </div>
      <div class="staffing-item">
        <span class="label">标准人数：</span>
        <span class="value">{{ staffing.standard }}</span>
      </div>
      <div class="staffing-item">
        <span class="label">实际人次：</span>
        <span class="value">{{ staffing.actualTimes }}</span>
      </div>
    </div>

    <div class="shift-info">
      <div class="shift-header">取车间段</div>
      <div class="shift-content">
        <!-- 这里可以添加更详细的班次信息 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const staffing = ref({
  configured: 0,
  actual: 0,
  standard: 0,
  actualTimes: 0
})

// TODO: 添加获取数据的方法
const fetchStaffingData = async () => {
  try {
    // const response = await getStaffingInfo()
    // staffing.value = response.data
  } catch (error) {
    console.error('获取人员配置信息失败:', error)
  }
}

onMounted(() => {
  fetchStaffingData()
})
</script>

<style scoped>
.staffing-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
  height: 100%;
}

.staffing-header {
  margin-bottom: 20px;
}

.staffing-header h3 {
  color: #fff;
  margin: 0;
}

.staffing-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.staffing-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #fff;
  font-size: 14px;
}

.value {
  color: #00ff00;
  font-size: 16px;
  font-weight: bold;
}

.shift-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.shift-header {
  color: #fff;
  font-size: 16px;
  margin-bottom: 10px;
}

.shift-content {
  color: #fff;
  font-size: 14px;
}
</style> 