<template>
  
  <dv-border-box-9 class="box1 w-full h-full">
    <div class="wrapper flex flex-col h-full">
     <div class="title-container">
       <h2>工单异常</h2>
       <el-button 
         type="primary" 
         size="small" 
         @click="handleDetail"
         class="action-btn"
       >
         查看详情
       </el-button>
     </div>
          
     <!-- 如果没有数据，显示暂无数据 -->
     <div v-if="!isLoading && isDataEmpty" class="empty-container">
       暂无数据
     </div>
     
     <!-- 数据加载完成且非空时显示图表 -->
      <div class="tablebox w-full h-[90%]">
         <!-- 如果正在加载，显示 loading -->
       <dv-loading v-if="isLoading">Loading...</dv-loading>

        <ScrollBoard v-if="!isLoading && !isDataEmpty" :config="config" @click="clickHandler" :rowClassName="rowClassName" :cellClassName="cellClassName" />
      </div>
    </div>
  </dv-border-box-9>

  <!-- 弹窗部分 -->
<el-dialog v-model="dialogVisible" title="详细信息" width="50%">
  <div v-for="(label, index) in config.header" :key="index" class="mb-2" :z-index="99999999">
    <strong>{{ label }}：</strong>{{ selectedItem[index+1] }}
  </div>
</el-dialog>

<!-- 使用封装的详情表格组件 -->
<DetailTable
  v-model="detailDialogVisible"
  title="工单异常详情"
  :headers="config.header"
  :data="tableData"
  :loading="tableLoading"
  @update:reason="handleReasonUpdate"
/>
</template>

<script setup lang="ts">
import { ref, onMounted ,onBeforeUnmount,reactive, } from 'vue';
import ScrollBoard from '@/components/datav/ScrollBoard.vue'
import DetailTable from '@/components/totalScreen/DetailTable/index.vue'
import { fetchClosingRateData } from './fetchMesData';
import { useRoute } from 'vue-router';
import { eventBus } from '@/utils/eventbus';  
import { ElMessage } from 'element-plus';
import { getAbnormalUnfinishedAdd } from '@/api/getProduceinfo.js';
import dayjs from 'dayjs';
// import dayjs from 'dayjs'; // 推荐用 dayjs 处理日期

const dialogVisible = ref(false);//弹窗控制
const detailDialogVisible = ref(false);
const selectedItem = ref({});
const route = useRoute();
const prodLine = route.query.prodLine;

const isLoading = ref(true);
const isDataEmpty = ref(false);
const tableLoading = ref(false);

const total = ref(0);
const tableData = ref([]);


const config = reactive({
  header: [
    '状态', '客户单号', '工单号','车型名称','工单数量','应完成时间','欠数','处理时长','原因','责任人', '完成期限','警告'
  ],
  data: [
    ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据', false]
  ],
  index: true,
  columnWidth: [50],
  align: [],
  rowNum:6,
  showTooltip: true,
})

const rawData = ref([]); // 新增

const fetchData = () => {
  let line = Array.isArray(prodLine) ? prodLine[0] : prodLine;
  fetchClosingRateData(line)
    .then((res) => {
      if (res && res.length > 0) {
        rawData.value = res; // 保存原始数据
        config.data = res.map(item => {
          const completeDate = item.completeDate ?? '';
          const reason = item.reason ?? '';
          let isOverdue = '否';
          // 只有处理结果和完成时间都不为空时才判断日期，否则直接为true
          if (reason && completeDate) {
            isOverdue = dayjs().isAfter(dayjs(completeDate), 'day') ? '是' : '否';
          } else {
            isOverdue = '是';
          }
          return [
            '未完工',
            item.number ?? '无',
            item.workNo ?? '无',
            item.specifications ?? '无',
            Number(item.productionQuantity) ?? '无',
            item.dateTime  ?? '无',
            Number(item.productionQuantity)-Number(item.inboundQuantity),
            item.daysBetween != null ? item.daysBetween + '天' : '无',
            item.reason ?? '无',
            item.duty  ?? '无',
            completeDate,
            isOverdue // 最后一项只用于变色，不展示
          ];
        });
        isDataEmpty.value = false;
      } 
    })
    .catch((error) => {
      console.error('Error fetching data:', error);  // 错误回调
      isDataEmpty.value = true; // 如果发生错误，显示暂无数据
    })
    .finally(() => {
      isLoading.value = false;  // 无论成功失败，都结束加载
    });
};

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

  // 清理定时器，避免组件卸载后定时器继续执行
  onBeforeUnmount(() => {
    eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
  });


  const clickHandler = (row) => {
  selectedItem.value = row.row; // 直接保存整行
  dialogVisible.value = true;
};

// 处理详情按钮点击
const handleDetail = () => {
  if (isLoading.value) {
    ElMessage.warning('数据加载中，请稍后再试');
    return;
  }
  
  tableLoading.value = true;
  try {
    tableData.value = config.data.map((row) => {
      const rowData = {};
      config.header.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    }); 
    total.value = tableData.value.length;
  } finally {
    tableLoading.value = false;
    detailDialogVisible.value = true;
  }
};


// 处理原因更新
const handleReasonUpdate = async ({ row, reason, duty, completeDate }) => {
  try {
    // 通过唯一标识找到原始数据（假设用工单号 workNo）
    const origin = rawData.value.find(item => item.workNo === row['工单号']);
    if (!origin) {
      ElMessage.error('未找到原始数据，无法上传');
      return;
    }
    // 组装参数
    const params = {
      prodLine: origin.workCenter,
      doc_no: origin.workNo,
      item_code: origin.articleNumber,
      pc_date: origin.dateTime,
      reason,
      duty,
      completeDate
    };
    // 假设接口返回 { code: 200, ... }
    const res = await getAbnormalUnfinishedAdd(
      params.prodLine,
      params.doc_no,
      params.item_code,
      params.pc_date,
      params.reason,
      params.duty,
      params.completeDate
    );
    if (res && (res.code === 200 || res.status === 200)) {
      ElMessage.success('保存成功');
      row['原因'] = reason;
      row['责任人'] = duty;
      row['完成期限'] = completeDate;
    } else {
      ElMessage.error('保存失败');
    }
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

function rowClassName(row) {
  const lastIndex = row.ceils.length - 1;
  return row.ceils[lastIndex] === '是' ? 'overdue-row' : '';
}

function cellClassName(row, ci) {
  const lastIndex = row.ceils.length - 1;
  return (ci === lastIndex - 1 && row.ceils[lastIndex] === '是') ? 'overdue-cell' : '';
}
</script>


<style scoped>
.box1 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: aliceblue;
  padding: 20px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

h2 {
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
}

.action-btn {
  margin-left: 10px;
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

.overdue-row {
  background: #ffeaea !important;
  color: #e03030 !important;
}
.overdue-cell {
  color: #e03030 !important;
  font-weight: bold;
}
</style>
 