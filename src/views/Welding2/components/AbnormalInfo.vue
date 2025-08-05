<template>
  <div class="abnormal-container">
    <div class="abnormal-header">
      <h3>工单异常</h3>
    </div>
    
    <div class="abnormal-content">
      <el-table
        :data="abnormalData"
        style="width: 100%"
        :header-cell-style="{ background: '#0d47a1', color: '#fff' }"
      >
        <el-table-column prop="status" label="状态" width="80" />
        <el-table-column prop="orderNo" label="工单号" />
        <el-table-column prop="customerNo" label="客户单号" />
        <el-table-column prop="model" label="车型名称" />
        <el-table-column prop="quantity" label="工单数量" width="100" />
        <el-table-column prop="dueTime" label="应完成时间" width="150" />
        <el-table-column prop="shortage" label="欠数" width="80" />
        <el-table-column prop="duration" label="处理时长" width="100" />
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="responsible" label="责任人" width="100" />
        <el-table-column prop="deadline" label="完成期限" width="150" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const abnormalData = ref([])

// TODO: 添加获取数据的方法
const fetchAbnormalData = async () => {
  try {
    // const response = await getAbnormalData()
    // abnormalData.value = response.data
  } catch (error) {
    console.error('获取异常数据失败:', error)
  }
}

onMounted(() => {
  fetchAbnormalData()
})
</script>

<style scoped>
.abnormal-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 15px;
}

.abnormal-header {
  margin-bottom: 15px;
}

.abnormal-header h3 {
  color: #fff;
  margin: 0;
}

:deep(.el-table) {
  background-color: transparent;
}

:deep(.el-table tr) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-table td) {
  color: #fff;
}

:deep(.el-table--border) {
  border-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-color: rgba(255, 255, 255, 0.1);
}
</style> 