<template>
  <div>
    <el-button type="primary" size="small" @click="handleClick" class="text-white">设置计划</el-button>

    <!-- 登录弹框 -->
    <el-dialog
      v-model="loginVisible"
      title="登录验证"
      width="30%"
      :close-on-click-modal="false"
      center
    >
      <div class="flex flex-col gap-4">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          prefix-icon="User"
        />
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          show-password
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginVisible = false">取消</el-button>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 计划设置弹框 -->
    <el-dialog
      v-model="planVisible"
      title="设置车间小时产量"
      width="90%"
      :close-on-click-modal="false"
      @closed="handleDialogClosed"
    >
      <Export v-model="exportVisible" :prod-line="prodLine" />
      <div v-if="planLoading" class="flex flex-col justify-center items-center" style="height: 300px;">
        <dv-loading class="text-white">加载中...</dv-loading>
      </div>
      <div v-else class="flex flex-col">
        <div class="grid grid-cols-8 gap-4 font-bold mb-4 text-center">
          <div>时间</div>
          <div>车型</div>
          <div>计划小时产量</div>
          <div>实际小时产量</div>
          <div>产量差异</div>
          <div>车间小时产量</div>
          <div>原因分析</div>
          <div>责任人</div>
        </div>
        <div v-for="hour in workingHours" :key="hour" class="grid grid-cols-8 gap-4 mb-2 items-center">
          <div class="text-center">{{ hour-1 }}-{{ hour }} 时</div>
          <div class="text-center">{{ carModels[hour] || '' }}</div>
          <div class="text-center">{{ planHourData[hour] || 0  }}</div>
          <div class="text-center">{{ actualHourData[hour] || 0}}</div>
          <div class="text-center">{{ calculateDiff(hour) }}</div>
          <div>
            <el-input-number 
              v-if="!istotalProduct"
              v-model="planNumbers[hour]" 
              :min="0"
              size="small"
              placeholder="请输入产量"
              class="w-full"
            />
            <div  v-else class="text-center">{{planNumbers[hour] }}</div>
          </div>
          <div>
            <el-input 
              v-model="remarks[hour]"
              size="small"
              placeholder="请输入原因分析"
              class="w-full"
            />
          </div>
          <div>
            <el-input 
              v-model="duties[hour]"
              size="small"
              placeholder="请输入责任人"
              class="w-full"
            />
          </div>
        </div>
        <!-- 合计行 -->
        <div class="grid grid-cols-8 gap-4 font-bold text-center bg-[#222] text-[#4E71FF]">
          <div>合计</div>
          <div></div>
          <div>{{ totalPlan }}</div>
          <div>{{ totalActual }}</div>
          <div>{{ totalDiff }}</div>
          <div>{{ totalWorkshop }}</div>
          <div></div>
          <div></div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="success" @click="exportVisible = true">导出</el-button>
          <el-button @click="planVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { insertHourPlan, getCapacityHour } from '@/api/getProduceinfo';
import Export from './Exportvue.vue'
const planLoading = ref(false);
const props = defineProps({
  prodLine: {
    type: String,
    required: true  
  },
  istotalProduct: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update-data']);

// 工作时间范围（6-23点）
const workingHours = computed(() => {
  return Array.from({ length: 17 }, (_, i) => i + 8); // 从7开始，因为hour2=7代表6-7时
});

// 登录相关
const loginVisible = ref(false);
const loginForm = ref({
  username: '',
  password: ''
});

// 数据相关
const planVisible = ref(false);
const planNumbers = ref(Array(24).fill(0));
const remarks = ref(Array(24).fill(''));
const duties = ref(Array(24).fill(''));
const planHourData = ref({});  // 计划小时产量
const actualHourData = ref({}); // 实际小时产量
const carModels = ref(Array(24).fill(''));

// 导出弹框控制
const exportVisible = ref(false);

// 合计
const totalPlan = computed(() => {
  return workingHours.value.reduce((sum, hour) => sum + (Number(planHourData.value[hour]) || 0), 0);
});
const totalActual = computed(() => {
  return workingHours.value.reduce((sum, hour) => sum + (Number(actualHourData.value[hour]) || 0), 0);
});
const totalDiff = computed(() => {
  return totalActual.value - totalPlan.value;
});
const totalWorkshop = computed(() => {
  return workingHours.value.reduce((sum, hour) => sum + (Number(planNumbers.value[hour]) || 0), 0);
});

// 计算产量差异
const calculateDiff = (hour) => {
  const actual = actualHourData.value[hour] || 0;
  const plan = planHourData.value[hour] || 0;
  return -(plan-actual);
};

// 点击设置计划按钮
const handleClick = () => {
  // 开发环境控制 - 设置为 true 时跳过登录
  const isDevMode = true; // 开发时设为 true，生产时设为 false
  
  if (isDevMode) {
    // 开发模式：直接打开计划设置弹框
    handleDevModeOpen();
  } else {
    // 生产模式：需要登录验证
    loginVisible.value = true;
  }
};

// 开发模式直接打开弹框
const handleDevModeOpen = async () => {
  planVisible.value = true;      // 1. 先打开弹窗
  planLoading.value = true;      // 2. 显示 loading
  try {
    // 3. 加载数据
    // 获取所有需要的数据 
    const res = await getCapacityHour(props.prodLine);
    const data = res.data;
    
    // 处理实际产能数据（columnarHour）
    const actualData = {};
    data.columnarHour.forEach(item => {
      actualData[item.hour2] = item.total;
    });
    actualHourData.value = actualData;

    // 处理计划产能数据（planHour）
    const planData = {};
    data.planHour.forEach(item => {
      planData[item.hour2] = item.total;
    });
    planHourData.value = planData;

    // 处理车间小时产量数据（reasonHour）
    const workshopData = {};
    data.reasonHour.forEach(item => {
      workshopData[item.hour2] = item.total;
    });
    updatePlanNumbers(workshopData);

    // 处理备注数据
    const remarkData = {};
    data.reasonHour.forEach(item => {
      remarkData[item.hour2] = item.reason || '';
    });
    updateRemarks(remarkData);

    // 处理责任人数据
    const dutyData = {};
    data.reasonHour.forEach(item => {
      dutyData[item.hour2] = item.duty || '';
    });
    updateDuties(dutyData);

    // 处理车型数据
    const carModelData = {};
    data.planHour.forEach(item => {
      carModelData[item.hour2] = item.description || '';
    });
    updateCarModels(carModelData);
 

  } catch (error) {
    console.error('获取数据失败：', error);
  }
  planLoading.value = false;     // 4. 数据加载完，显示内容
};

// 处理登录
const handleLogin = async () => {
  if( (loginForm.value.username === '1004' && loginForm.value.password === 'abl1004')
      ||
    (loginForm.value.username === '2004' && loginForm.value.password === 'abl2004' )
    ||
    ( loginForm.value.username === '1005'&& loginForm.value.password === 'abl1005' )
    || 
    (loginForm.value.username === '2005'&& loginForm.value.password==='abl2005')) {
    loginVisible.value = false;
    try {
      // 获取所有需要的数据
      const res = await getCapacityHour(props.prodLine);
      const data = res.data;
      
      // 处理实际产能数据（columnarHour）
      const actualData = {};
      data.columnarHour.forEach(item => {
        actualData[item.hour2] = item.total;
      });
      actualHourData.value = actualData;

      // 处理计划产能数据（planHour）
      const planData = {};
      data.planHour.forEach(item => {
        planData[item.hour2] = item.total;
      });
      planHourData.value = planData;

      // 处理车间小时产量数据（reasonHour）
      const workshopData = {};
      data.reasonHour.forEach(item => {
        workshopData[item.hour2] = item.total;
      });
      updatePlanNumbers(workshopData);

      // 处理备注数据
      const remarkData = {};
      data.reasonHour.forEach(item => {
        remarkData[item.hour2] = item.reason || '';
      });
      updateRemarks(remarkData);

      // 处理责任人数据
      const dutyData = {};
      data.reasonHour.forEach(item => {
        dutyData[item.hour2] = item.duty || '';
      });
      updateDuties(dutyData);

      // 处理车型数据
      const carModelData = {};
      data.planHour.forEach(item => {
        carModelData[item.hour2] = item.description || '暂无数据';
      });
      updateCarModels(carModelData);
    } catch (error) {
      console.error('获取数据失败：', error);
    }
    planVisible.value = true;
    // 清空登录信息
    loginForm.value = {
      username: '',
      password: ''
    };
  } else {
    ElMessage.error('用户名或密码错误');
  }
};

// 更新车间小时产量
const updatePlanNumbers = (data) => {
  planNumbers.value = Array(24).fill(0);
  for (const key in data) {
    const index = parseInt(key, 10); // key就是hour2，代表这个小时结束时的时间点
    if (!isNaN(index)) {
      planNumbers.value[index] = parseInt(data[key], 10);
    }
  }
};

// 更新原因分析
const updateRemarks = (data) => {
  remarks.value = Array(24).fill('');
  for (const key in data) {
    const index = parseInt(key, 10);
    if (!isNaN(index)) {
      remarks.value[index] = data[key] || '';
    }
  }
};

// 更新责任人数据
const updateDuties = (data) => {
  duties.value = Array(24).fill('');
  for (const key in data) {
    const index = parseInt(key, 10);
    if (!isNaN(index)) {
      duties.value[index] = data[key] || '';
    }
  }
};

// 更新车型数据
const updateCarModels = (data) => {
  carModels.value = Array(24).fill('');
  for (const key in data) {
    const index = parseInt(key, 10);
    if (!isNaN(index)) {
      carModels.value[index] = data[key] || '暂无数据';
    }
  }
};

// 确认设置计划
const handleConfirm = async () => {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    console.log('当前时间:', now.toLocaleString(), '当前小时:', currentHour);
    
    // 使用本地时间而不是UTC时间
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    console.log('计算的日期:', dateStr);

    // 只保存工作时间范围内的数据
    const saveData = workingHours.value.map(hour => {
      const index = hour;
      if (planNumbers.value[index] > -1 || remarks.value[index] || duties.value[index] || carModels.value[index]) {
        return {
          prodLine: props.prodLine,
          hour: hour.toString(), // hour2=8 代表 7-8时
          date: dateStr,
          reason: remarks.value[index] || '',
          cl: planNumbers.value[index].toString(),
          duty: duties.value[index] || '',
          description: carModels.value[index] || ''
        };
      }
      return null;
    }).filter(item => item !== null);

    if (saveData.length > 0) {
      await insertHourPlan(saveData, 1);  // 保存车间小时产量
      
      // 如果有原因分析，也保存
      const remarkData = saveData.filter(item => item.reason);
      if (remarkData.length > 0) {
        await insertHourPlan(remarkData, 2);
      }

      // 如果有责任人，也保存
      const dutyData = saveData.filter(item => item.duty);
      if (dutyData.length > 0) {
        await insertHourPlan(dutyData, 3);
      }

      ElMessage.success('设置成功');
      planVisible.value = false;
      emit('update-data');
    } else {
      ElMessage.warning('请至少设置一个时段的数据');
    }
  } catch (error) {
    console.error('保存失败：', error);
    ElMessage.error('保存失败，请重试');
  }
};

// 弹框关闭时重置数据
const handleDialogClosed = () => {
  planNumbers.value = Array(24).fill(0);
  remarks.value = Array(24).fill('');
  duties.value = Array(24).fill('');
  carModels.value = Array(24).fill('');
  planLoading.value = false;
};
</script>

<style scoped>
/* :deep(.el-button) {
  background: #1890ff;
  border: none;
  padding: 8px 15px;
  height: auto;
  font-size: 0.8vw;
} */
:deep(.el-button.success-btn) {
     background: #67c23a !important;
     border-color: #67c23a !important;
     color: #fff !important;
   }
:deep(.el-dialog) {
  background: #1a1a1a;
  border: 1px solid #303030;
}

:deep(.el-dialog__title) {
  color: #fff;
}

:deep(.el-dialog__body) {
  color: #fff;
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  background: #2a2a2a;
}

:deep(.el-input__inner) {
  color: #fff;
}

.grid {
  display: grid;
  align-items: center;
}

.grid-cols-8 {
  grid-template-columns: 100px 1fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
}
</style>`