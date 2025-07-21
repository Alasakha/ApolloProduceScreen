<template>
    <dv-border-box13 class="w-full h-full">
      <div class="flex  w-full h-full p-2 box-border text-white">
        <div
          class="flex-1 flex justify-center items-center w-full text-lg font-bold text-cyan-300 tracking-wide drop-shadow-lg py-2"
          style="letter-spacing: 2px;"
        >
          {{ props.title1 }}
        </div>
        <div class="flex-1">
          <div ref="Indicators1" class="w-full h-full"></div>
        </div>
        <div class="flex-1 flex flex-col justify-center items-center">
          <div class="text-lg font-bold text-cyan-300 tracking-wide drop-shadow-lg py-2"
            style="letter-spacing: 2px;">
            {{ props.title2 }}
          </div>
          <!-- 添加详情按钮 -->
          <el-button type="primary" size="small" @click="openDetailDialog">
            详细信息
          </el-button>
        </div>
        <div class="flex-1">
          <div ref="Indicators2" class="w-full h-full cursor-pointer" @click="openDialog"></div>
        </div>
      </div>
    </dv-border-box13>

    <!-- 添加对话框组件 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="40%"
      class="custom-dialog"
    >
      <div class="dialog-content">
        <el-form :model="formData" label-width="220px" v-loading="loading">
          <!-- <el-form-item :label="props.title2">
            <el-input v-model="formData.value" type="number" placeholder="请输入数值"></el-input>
          </el-form-item> -->
          <el-form-item label="原因">
            <el-input
              v-model="formData.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入原因分析"
            ></el-input>
          </el-form-item>
          <el-form-item label="应对措施">
            <el-input
              v-model="formData.countermeasure"
              type="textarea"
              :rows="3"
              placeholder="请输入应对措施"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="详细信息" width="80%" class="custom-dialog">
      <el-table :data="detailData" style="width: 100%" v-loading="detailLoading" height="500">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="doc_date" label="单据日期" width="100" />
        <el-table-column prop="doc_no" label="单号" width="150" />
        <el-table-column prop="customer_name" label="客户名称" width="120" />
        <el-table-column prop="documentName" label="客户类型" width="100" />
        <el-table-column prop="description" label="问题描述" show-overflow-tooltip />
        <el-table-column prop="approveDate" label="审批日期" width="150" />
      </el-table>
    </el-dialog>
  </template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { createGaugeOption } from './charts';
import { useEcharts } from '@/utils/useEcharts';
import { ElMessage } from 'element-plus';
import { getServiceRequestReasonAdd, getServiceRequestReason, getServiceRequestDetail } from '@/api/getQuiltyinfo';

const props = defineProps({
    title1: {
        type: String,
        required: true
    },
    title2: {
        type: String,
        required: true
    },
    data1:{
        type: Number,
        required: true
    },
    data2:{
        type: Object,
        required: true,
    }
});

const emit = defineEmits(['update-data']);

// 对话框相关的响应式变量
const dialogVisible = ref(false);
const dialogTitle = ref('');
const formData = ref({
    reason: '',
    countermeasure: ''
});
const loading = ref(false);

// 新增的响应式变量
const detailDialogVisible = ref(false);
const detailData = ref([]);
const detailLoading = ref(false);

// 获取type值的方法
const getTypeByTitle = (title: string) => {
    const typeMap: { [key: string]: number } = {
        '月度客诉目标': 1,
        '月度大客户投诉目标': 2,
        '月度常规客诉投诉目标': 3,
        '月度跨境投诉目标': 4,
        '月度配件投诉目标': 5,
        '月度国内客户投诉目标': 6
    };
    return typeMap[title] || 1;
};

// 获取已有的原因和应对措施
const fetchExistingData = async (type: number) => {
    try {
        loading.value = true;
        const response = await getServiceRequestReason(type);
        if (response?.data) {
            formData.value = {
                reason: response.data.reason || '',
                countermeasure: response.data.solve || ''
            };
        }
    } catch (error) {
        console.error('获取数据失败:', error);
        ElMessage.error('获取历史数据失败');
    } finally {
        loading.value = false;
    }
};

// 打开对话框的方法
const openDialog = async () => {
    dialogTitle.value = `${props.title2}原因分析`;
    // 清空表单，避免显示上次的数据
    formData.value = {
        reason: '',
        countermeasure: ''
    };
    dialogVisible.value = true;
    
    // 获取已有数据
    const type = getTypeByTitle(props.title1);
    await fetchExistingData(type);
};

// 提交表单的方法
const handleSubmit = async () => {
    if (!formData.value.reason) {
        ElMessage.warning('请输入原因分析');
        return;
    }

    if (!formData.value.countermeasure) {
        ElMessage.warning('请输入应对措施');
        return;
    }

    try {
        const type = getTypeByTitle(props.title1);
        await getServiceRequestReasonAdd(
            type,
            formData.value.reason,
            formData.value.countermeasure
        );

        dialogVisible.value = false;
        ElMessage.success('提交成功');
        
        // 可选：通知父组件更新数据
        emit('update-data', {
            type,
            reason: formData.value.reason,
            countermeasure: formData.value.countermeasure
        });
    } catch (error) {
        ElMessage.error('提交失败，请重试');
        console.error('提交失败:', error);
    }
};

// 新增的响应式变量
const getRequestParams = () => {
  const params = {
    documentName: null,
    hasAccessory: 0,
    isCrossBorder: 0,
    customer_name: null
  };

  switch (props.title1) {
    case '月度大客户投诉目标':
      params.documentName = '大客户';
      params.customer_name = 'GW';
      break;
    case '月度常规客诉投诉目标':
      params.documentName = '常规客户';
      params.customer_name = 'GW';
      break;
    case '月度跨境投诉目标':
      params.isCrossBorder = 1;
      break;
    case '月度配件投诉目标':
      params.hasAccessory = 1;
      break;
    case '月度国内客户投诉目标':
      params.hasAccessory = 1;
      params.customer_name = 'HZ20000';
      break;
  }

  return params;
};

// 打开详情对话框
const openDetailDialog = async () => {
  detailLoading.value = true;
  detailDialogVisible.value = true;
  try {
    const params = getRequestParams();
    const res = await getServiceRequestDetail(
      params.documentName,
      params.hasAccessory,
      params.isCrossBorder,
      params.customer_name
    );
    if (res.code === 200) {
      detailData.value = res.data;
    }
  } catch (error) {
    console.error('获取详细数据失败:', error);
    ElMessage.error('获取详细数据失败');
  } finally {
    detailLoading.value = false;
  }
};

const Indicators1 = ref(null);
const Indicators2 = ref(null);
const chart1 = useEcharts(Indicators1);
const chart2 = useEcharts(Indicators2);

// 存储清理函数
const cleanupFunctions = ref<{
    chart1: (() => void) | null;
    chart2: (() => void) | null;
}>({
    chart1: null,
    chart2: null
});

const drawChart = () => {

    const { option: option1, startAnimation } = createGaugeOption({
        text: "图表1",
        data: props.data1,
        max: props.data1
    });

let warnLevel: 'normal' | 'warn' | 'danger' = 'normal';

if (props.title1 === '月度客诉目标') {
  const val = props.data2.data;
  if (val > 10) {
    warnLevel = 'danger';
  } else if (val > 5) {
    warnLevel = 'warn';
  } else {
    warnLevel = 'normal';
  }
}

if(props.title1==='月度大客户投诉目标' ||props.title1=== '月度配件投诉目标' || props.title1==='月度国内客户投诉目标'){
    const val = props.data2.data;
  if (val > 1) {
    warnLevel = 'danger';
  } else if (val > 0) {
    warnLevel = 'warn';
  } else {
    warnLevel = 'normal';
  }
}


if (props.title1 === '月度常规客诉投诉目标') {
  const val = props.data2.data;
  if (val > 7) {
    warnLevel = 'danger';
  } else if (val > 5) {
    warnLevel = 'warn';
  } else {
    warnLevel = 'normal';
  }
}


const { option: option2, startAnimation: startAnimation2 } = createGaugeOption({
  text: "图表2",
  data: props.data2.data,
  max:  props.data2.max,
  warnLevel  // 把警告标志传进去
});

    // 使用nextTick确保DOM已更新
    nextTick(() => {
        chart1.setOption(option1);
        chart2.setOption(option2);

        // 启动动画
        requestAnimationFrame(() => {
            cleanupFunctions.value.chart1 = startAnimation(chart1);
            cleanupFunctions.value.chart2 = startAnimation2(chart2);
        });
    });
};

const bindChartClick = () => {
  chart1.getChart()?.on('click', () => {
    dialogVisible.value = true;
  });
  
  chart2.getChart()?.on('click', () => {
    dialogVisible.value = true;
  });
};

const fetchData = async () => {
    try {
        // 初始化图表
        await Promise.all([
            chart1.initChart(),
            chart2.initChart()
        ]);
        drawChart();
        bindChartClick(); // 绑定点击事件
    } catch (error) {
        console.error('初始化图表失败:', error);
    }
};
watch(() => props.data2.data, (newVal) => {
  if (newVal !== 0) {
    drawChart();
  }
});
onMounted(() => {
    fetchData();
});

// 清理动画
onBeforeUnmount(() => {
    if (cleanupFunctions.value.chart1) {
        cleanupFunctions.value.chart1();
    }
    if (cleanupFunctions.value.chart2) {
        cleanupFunctions.value.chart2();
    }
});

</script>

<style scoped>
.custom-dialog :deep(.el-dialog) {
  background: rgba(0, 19, 47, 0.9);
  border: 1px solid #0CD3DB;
  backdrop-filter: blur(4px);
}

.custom-dialog :deep(.el-dialog__title) {
  color: #0CD3DB;
}

.custom-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid rgba(12, 211, 219, 0.3);
}

.custom-dialog :deep(.el-input__inner),
.custom-dialog :deep(.el-textarea__inner) {
  background: rgba(0, 19, 47, 0.5);
  border: 1px solid rgba(12, 211, 219, 0.3);
  color: #fff;
}

.custom-dialog :deep(.el-form-item__label) {
  color: #0CD3DB;
}

.dialog-footer button {
  margin-left: 10px;
}

.custom-dialog :deep(.el-table) {
  background-color: transparent;
}

.custom-dialog :deep(.el-table th),
.custom-dialog :deep(.el-table tr) {
  background-color: rgba(0, 19, 47, 0.5);
  color: #0CD3DB;
}

.custom-dialog :deep(.el-table td) {
  background-color: rgba(0, 19, 47, 0.3);
  color: #fff;
}

.custom-dialog :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: rgba(0, 19, 47, 0.4);
}

.custom-dialog :deep(.el-button) {
  background: transparent;
  border-color: #0CD3DB;
  color: #0CD3DB;
}

.custom-dialog :deep(.el-button:hover) {
  background: rgba(12, 211, 219, 0.1);
  border-color: #0CD3DB;
  color: #fff;
}
</style>