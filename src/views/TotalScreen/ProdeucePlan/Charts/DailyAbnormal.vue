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
    '状态' , '工单号','客户单号','车型名称','工单数量','应完成时间','欠数','处理时长','原因','责任人', '完成期限','警告'
  ],
  data: [
    ['暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据','暂无数据']
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
            item.completeDate ?? '无',
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
    // 修改数据处理逻辑，保留原始数据
    tableData.value = config.data.map((row, index) => {
      // 获取原始数据
      const originalData = rawData.value[index];
      console.log('Processing row:', { displayRow: row, originalData });

      // 构建显示数据
      const displayData = {};
      config.header.forEach((header, idx) => {
        displayData[header] = row[idx];
      });

      // 合并数据，确保API所需字段存在
      return {
        ...displayData,
        工单号: originalData.number || row[1], // 使用 number 作为工单号
        客户单号: originalData.workNo || row[2], // 使用 workNo 作为客户单号
        应完成时间: originalData.dateTime || row[5],
        articleNumber: originalData.articleNumber,
        workNo: originalData.workNo,
        workCenter: originalData.workCenter,
        dateTime: originalData.dateTime,
        // 保留原始数据的引用
        originalData: originalData
      };
    }); 

    console.log('Processed table data:', tableData.value);
    total.value = tableData.value.length;
  } finally {
    tableLoading.value = false;
    detailDialogVisible.value = true;
  }
};

const handleReasonUpdate = async ({ row, reason, duty, completeDate }) => {
  try {
    console.log('更新数据:', { row, reason, duty, completeDate });
    
    // 使用保存的原始数据
    console.log('row',row)
    const originalData = row.originalData;
    
    if (!originalData) {
      console.error('找不到原始数据:', row);
      ElMessage.error('数据不完整，请刷新后重试');
      return;
    }

    const workCenter = (line: string) => {
    switch (line) {
      case'1004':
        return '汽油车组装车间'
      case'1005':
        return '汽油车包装车间'
      case'1006':
        return '电动车组装车间'
      case'1007':
        return '电动车包装车间'
      case'zs':
        return '注塑车间'
      default:
        return ''
    }}// 处理原因更新
    // 组装参数
    const params = {
      prodLine: workCenter(Array.isArray(prodLine) ? prodLine[0] : prodLine),
      doc_no: originalData.workNo,
      item_code: originalData.articleNumber,
      pc_date: originalData.dateTime,
      reason,
      duty,
      completeDate
    };

    console.log('发送参数:', params);

    // 调用API
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
      // 更新本地数据
      const index = config.data.findIndex(item => 
        item[2] === originalData.workNo || 
        item[1] === originalData.number
      );
      
      if (index !== -1) {
        config.data[index][8] = reason;
        config.data[index][9] = duty;
        config.data[index][10] = completeDate;
        
        // 更新表格数据
        const tableIndex = tableData.value.findIndex(item => 
          item.workNo === originalData.workNo || 
          item.工单号 === originalData.number
        );
        if (tableIndex !== -1) {
          tableData.value[tableIndex]['原因'] = reason;
          tableData.value[tableIndex]['责任人'] = duty;
          tableData.value[tableIndex]['完成期限'] = completeDate;
        }
      }
      
      // 刷新数据
      fetchData();
    } else {
      console.error('API响应错误:', res);
      ElMessage.error(res?.message || '保存失败，请重试');
    }
  } catch (error) {
    console.error('处理异常:', error);
    ElMessage.error('操作失败: ' + (error.message || '未知错误'));
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
 