<template>
  <div class="line3-container flex">
    <!-- <TechBorderBox width="800px" height="360px">
  <div style="color:#fff;font-size:20px;">这里是内容</div>
</TechBorderBox> -->
      <!-- <dv-border-box-12 class="chart-box">
          <div class="box-title">生产异常</div>
        <AbnormalList ></AbnormalList>
      </dv-border-box-12> -->
      
      <dv-border-box-12 class="chart-box">
          <div class="title-container">
            <div class="box-title">工单异常</div>
            <el-button 
              type="primary" 
              size="small" 
              @click="handleDetail"
              class="action-btn"
            >
              查看详情
            </el-button>
          </div>
          <AbnormalProduce ref="abnormalProduceRef" :headers="scrollHeaders"/>
      </dv-border-box-12>

      <!-- 使用封装的详情表格组件 -->
      <DetailTable
        v-model="detailDialogVisible"
        title="工单异常详情"
        :headers="tableHeaders"
        :data="tableData"
        :loading="tableLoading"
        @update:reason="handleReasonUpdate"
      />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
// import AbnormalList from './ScrollTable/leftcontent.vue'
// 工单异常
import AbnormalProduce from './ScrollTable/rightcontent.vue'
import DetailTable from '@/components/totalScreen/DetailTable/index.vue'
import { ElMessage } from 'element-plus';

const abnormalProduceRef = ref(null);
const detailDialogVisible = ref(false);
const tableLoading = ref(false);
const tableData = ref([]);
const tableHeaders = ref([
  '状态', '客户单号', '工单号', '车型名称', '工单数量', '应完成时间', '欠数', '处理时长', '原因', '责任人', '完成期限'
]);
const scrollHeaders = ref([
  '状态', '客户单号', '工单号', '车型名称', '工单数量', '应完成时间', '欠数', '处理时长','警告'
]);
// 处理详情按钮点击
const handleDetail = async () => {
  if (!abnormalProduceRef.value) {
    ElMessage.warning('组件未加载完成，请稍后再试');
    return;
  }
  
  tableLoading.value = true;
  try {
    console.log('获取表格数据中...');
    // 从AbnormalProduce组件获取数据
    const config = abnormalProduceRef.value.config;
    if (!config || !config.data) {
      throw new Error('组件数据未初始化');
    }

    console.log('原始数据:', config.data);
    
    // 检查数据格式
    if (!Array.isArray(config.data) || config.data.length === 0) {
      throw new Error('数据格式错误或为空');
    }

    // 转换数据格式
    tableData.value = config.data.map((row, rowIndex) => {
      if (!Array.isArray(row)) {
        console.error(`行 ${rowIndex} 数据格式错误:`, row);
        return null;
      }

      const rowData = {};
      tableHeaders.value.forEach((header, index) => {
        rowData[header] = row[index] || '无';
      });
      return rowData;
    }).filter(Boolean); // 过滤掉无效数据

    if (tableData.value.length === 0) {
      throw new Error('数据转换后为空');
    }

    console.log('转换后的表格数据:', tableData.value);
    detailDialogVisible.value = true;
  } catch (error) {
    console.error('获取或处理数据失败:', error);
    ElMessage.error(error.message || '获取数据失败，请刷新后重试');
  } finally {
    tableLoading.value = false;
  }
};

// 处理原因更新
const handleReasonUpdate = async ({ row, reason, duty, completeDate }) => {
  try {
    if (!abnormalProduceRef.value) {
      throw new Error('组件未初始化完成，请刷新页面重试');
    }

    console.log('准备更新数据:', { row, reason, duty, completeDate });
    await abnormalProduceRef.value.handleReasonUpdate({ row, reason, duty, completeDate });
    
    // 更新成功后，重新获取表格数据
    if (detailDialogVisible.value) {
      await handleDetail();
    }
  } catch (error) {
    console.error('更新数据失败:', error);
    ElMessage.error(error.message || '更新失败，请重试');
  }
};
</script>

<style scoped>
.line3-container {
  padding: 0.5rem;
}

.chart-box {
  height: 25vh;
  padding: 1rem;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.box-title {
  font-size: 0.8vw;
  font-weight: bold;
  color: #fff;
  letter-spacing: 0.3vw;
  text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
}

.action-btn {
  margin-left: 10px;
  background: #2575fc;
  border: none;
}

.action-btn:hover {
  background: #1e65e6;
}

.chart-container {
  flex: 1;
  width: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 300px;
  position: relative;
  background: #000;
}
.svg-frame{
  width: 100%;
  height: 100%;
  object-fit: fill; /* 或 contain/cover 看需求 */
}
</style> 