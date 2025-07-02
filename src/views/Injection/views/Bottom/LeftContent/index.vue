<template>
  <div class='pl-5 pt-1'>
    <div class="flex justify-center items-center text-lg text-white font-bold relative">
      <p class="tracking-widest text-xl ">原材料监控</p>
      <el-button class="absolute right-4" size="small" type="primary" @click="dialogVisible = true">详细</el-button>
    </div>
    <ScrollBoard :config="config" style="width:47vw;height:19vh;"/>
    <el-dialog v-model="dialogVisible" title="原材料监控明细" width="60vw" >
      <el-table :data="tableData"  :loading="tableLoading" style="width: 100%" >
        <el-table-column v-for="(col, idx) in config2.header" :key="col" :label="col" :prop="'col' + idx" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleDetail(scope.row)">操作</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="reasonDialogVisible" title="填写原因" width="30vw">
  <el-input
    v-model="reason"
    type="textarea"
    :rows="4"
    placeholder="请输入原因"
  />
  <template #footer>
    <el-button @click="reasonDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitReason">确定</el-button>
  </template>
</el-dialog>

    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted,onBeforeUnmount, computed } from 'vue'
import { getrawMaterialMonitoring,getRawMaterialMonitoringAdd } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
import  {ElMessage} from 'element-plus'
const selectedCode = ref('')
// 初始化配置对象
const config = reactive({
  header: ['机台号','计划成品产出数','计划原材料用量','计划原材料损耗', '实际产出数','实际原材料用量/kg','实际损耗量','原材料使用率',''], // 表头
  data: [], // 数据
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [50],
  headerHeight: 20
})
const config2 = reactive({
  header: ['机码','机台号','计划成品产出数','计划原材料用量','计划原材料损耗', '实际产出数','实际原材料用量/kg','实际损耗量','原材料使用率','超出原因'], // 表头
  data: [], // 数据
  index: true,
  align: ['center','center','center','center','center','center','center','center'],
  rowNum: 5,
  columnWidth: [50],
  headerHeight: 20  
})
const dialogVisible = ref(false);
const reasonDialogVisible = ref(false);
const reason = ref('');
const currentRow = ref(null);
const tableLoading = ref(false);
const handleDetail = (row) => {
  console.log(row)
  currentRow.value = row;
  reason.value = '';
  reasonDialogVisible.value = true;
  selectedCode.value = row.col0
};

const submitReason = async () => {
  if (!reason.value.trim()) {
    ElMessage.warning('请填写原因');
    return;
  }
  // 这里可以调用接口提交原因，例如
  // await submitReasonApi({ row: currentRow.value, reason: reason.value });
  getRawMaterialMonitoringAdd(selectedCode.value,reason.value)
  reasonDialogVisible.value = false;
  fetchData()
  ElMessage.success('提交成功');
};

// 生成表格数据对象数组，便于el-table渲染
const tableData = computed(() => {
  return config2.data.map(row => {
    const obj: Record<string, any> = {};
    row.forEach((val, idx) => {
      obj['col' + idx] = val;
    });
    return obj;
  });
});



const fetchData = async () => {
  tableLoading.value = true;
  try {
    const res = await getrawMaterialMonitoring();
    if (res && res.code === 200 && res.data) {
      config.data = res.data.map(item => [
        item.ty009,
        item.planOutput,
        Math.round(item.expectedUsage)+'kg',
        Math.round(item.planLoss)+'kg', 
        item.actualOutput,
        Math.round(item.actualOutput2)+'kg',
        Math.round(item.actualLoss)+'kg',
        item.useRate+'%',
      ]);
      config2.data = res.data.map(item => [
        item.machineCode,
        item.ty009,
        item.planOutput,
        Math.round(item.expectedUsage)+'kg',
        Math.round(item.planLoss)+'kg', 
        item.actualOutput,
        Math.round(item.actualOutput2)+'kg',
        Math.round(item.actualLoss)+'kg',
        item.useRate+'%',
        item.reasonList[item.reasonList.length-1]
      ]);
    }
  } catch (error) {
    console.error('数据获取失败:', error);
  } finally {
    tableLoading.value = false;
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
:deep(.ScrollBoard .header) {
  display: flex;
  flex-direction: row;
  font-size: 0.6vw;
}

:deep(.ScrollBoard .rows .row-item){
  font-size: 0.5vw;
}

</style>