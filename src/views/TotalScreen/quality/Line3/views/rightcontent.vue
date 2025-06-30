<template>
<dv-border-box10>
  <div class="content w-[98%] h-full mx-auto">
      <div class="h-[15%]">
        <GlobalTitle title="错漏检累计次数"/>
      </div>

      <div class="flex justify-center items-center h-[80%] w-full">
         <ScrollBoard :config="config" class="w-full h-full"/>
      </div>
  </div>

  <div class="btn-group">
    <el-button 
      type="primary" 
      size="small" 
      @click="handleDetail"
      class="action-btn"
    >
      查看详情
    </el-button>
  </div>

  <!-- 详情弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    title="错漏检累计次数详情"
    width="90%"
    :destroy-on-close="true"
    :fullscreen="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="custom-dialog"
  >
    <div class="detail-table">
      <el-table 
        v-loading="tableLoading"
        :data="paginatedData" 
        border 
        style="width: 100%"
        height="670"
      >
        <el-table-column 
          v-for="(header, index) in config.header" 
          :key="header" 
          :prop="header" 
          :label="header" 
          :fixed="index === 0"
        />
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</dv-border-box10>

</template>


<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { getMistakesAndOmissions } from '@/api/getQuiltyinfo'
import { eventBus } from '@/utils/eventbus';
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()
const prodLine = route.query.prodLine as string || ''

// 状态管理
const dialogVisible = ref(false)
const tableLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailData = ref([])

// 初始化 配置对象
const config = reactive({
  header: ['车间','故障时间','故障原因', '原因分析','责任单位', '错漏检责任人'],
  data: [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']] as string[][],
  index: true,
  align: [],
  rowNum: 6,
  columnWidth: [50],
  headerHeight: 20
})

// 分页数据处理
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return detailData.value.slice(start, end)
})

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 详情处理
const handleDetail = () => {
  if (tableLoading.value) {
    ElMessage.warning('数据加载中，请稍后再试')
    return
  }
  
  tableLoading.value = true
  try {
    detailData.value = config.data.map((row: any[]) => {
      const obj: Record<string, any> = {}
      config.header.forEach((header: string, index: number) => {
        obj[header] = row[index]
      })
      return obj
    })
    total.value = detailData.value.length
  } finally {
    tableLoading.value = false
    dialogVisible.value = true
  }
}

// 获取数据
const fetchData = async () => {
  try {
    const res = await getMistakesAndOmissions(prodLine); // 获取接口数据
    // 假设返回的数据格式是数组，每个元素包含 { macNo, isFinish, guZhangTypeName, dutyDeptName }
    if (res && res.data) {
      // 转换数据格式以适应表格
      config.data = res.data.map(item => [
        item.macNo,
        item.startTime, // 不良原因
        item.guZhangTypeName,
        item.startRemark,
        item.dutyDeptName, // 时间
        item.udf03, // 责任人
      ]);
    }else {
      config.data = [['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']];
    }
  } catch (error) {
    console.error('数据获取失败:', error);
  }
}

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});


  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });
</script>

<style scoped>
.btn-group {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
}

.action-btn {
  position: static;
  transform: none;
}

.detail-table {
  max-height: 60vh;
  overflow-y: auto;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 10px;
}

:deep(.el-table) {
  background-color: transparent;
  color: #333;
}

:deep(.el-table th) {
  background-color: #0d47a1;
}

:deep(.el-table tr) {
  background-color: #fff;
}

:deep(.el-pagination) {
  margin-right: 20px;
}

:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.custom-dialog) {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
}

:deep(.custom-dialog .el-dialog__body) {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

:deep(.custom-dialog .el-dialog__header) {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.custom-dialog .el-dialog__footer) {
  padding: 20px;
  margin: 0;
  border-top: 1px solid #dcdfe6;
}
</style>