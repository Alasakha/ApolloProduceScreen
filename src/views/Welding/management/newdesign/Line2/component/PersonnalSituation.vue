<template>
    <div class="efficency">
      <dv-border-box12>
        <div v-if="isLoading" class="w-full h-[85%] text-white">
          <dv-loading>Loading...</dv-loading>
        </div>
        <div v-if="!isLoading" class="w-full h-[95%] p-3 grid grid-cols-2 grid-rows-2 gap-2">
          <!-- 焊接三线布局 -->
          <template v-if="isLine3">
            <!-- 白班人数 -->
            <div class="chuchai">
              <div 
                ref="Indicators2" 
                class="w-full h-full cursor-pointer"
                @click="openAttendanceDialog"
              ></div>
            </div>
            <!-- 晚班人数 -->
            <div class="peizhi">
              <div 
                ref="Indicators5" 
                class="w-full h-full cursor-pointer"
                @click="openNighttimeAttendanceDialog"
              ></div>
            </div>
            <!-- 标准人数 -->
            <div class="biaozhun">
              <div ref="Indicators3" class="w-full h-full"></div>
            </div>
            <!-- 实际人数 -->
            <div class="shiji">
              <div 
                ref="Indicators4" 
                class="w-full h-full"
                @click="openReasonDialog"
                style="cursor: pointer;"
              ></div>
              <!-- 警告图标 -->
              <div v-if="showWarning" class="warning-icon-container">
                <el-tooltip
                  :content="EfficentData.reason || '实际人数低于标准人数，可能原因：出勤人数不足等'"
                  placement="left"
                  effect="dark"
                >
                  <!-- <svg class="warn-icon" width="38" height="38" viewBox="0 0 24 24">
                    <polygon points="12,3 22,20 2,20" fill="#FFD600" stroke="#FFA000" stroke-width="2"/>
                    <rect x="11" y="9" width="2" height="5" fill="#FFA000"/>
                    <rect x="11" y="16" width="2" height="2" fill="#FFA000"/>
                  </svg> -->
                </el-tooltip>
              </div>
            </div>
          </template>
          <!-- 焊接一线和二线布局 -->
          <template v-else>
            <!-- 白班配置人数 -->
            <div class="peizhi">
              <div ref="Indicators4" class="w-full h-full"></div>
            </div>
            <!-- 白班出勤人数 -->
            <div class="chuchai">
              <div 
                ref="Indicators2" 
                class="w-full h-full cursor-pointer"
                @click="openAttendanceDialog"
              ></div>
            </div>
            <!-- 晚班配置人数 -->
            <div class="peizhi">
              <div ref="Indicators3" class="w-full h-full"></div>
            </div>
            <!-- 晚班出勤人数 -->
            <div class="chuchai">
              <div 
                ref="Indicators5" 
                class="w-full h-full cursor-pointer"
                @click="openNighttimeAttendanceDialog"
              ></div>
              <!-- 警告图标 -->
              <!-- <div v-if="showWarning" class="warning-icon-container">
                <el-tooltip
                  :content="EfficentData.reason || '出勤人数低于配置人数，可能原因：出勤人数不足等'"
                  placement="left"
                  effect="dark"
                >
                  <svg class="warn-icon" width="38" height="38" viewBox="0 0 24 24">
                    <polygon points="12,3 22,20 2,20" fill="#FFD600" stroke="#FFA000" stroke-width="2"/>
                    <rect x="11" y="9" width="2" height="5" fill="#FFA000"/>
                    <rect x="11" y="16" width="2" height="2" fill="#FFA000"/>
                  </svg>
                </el-tooltip> -->
              <!-- </div> -->
            </div>
          </template>
        </div>
      </dv-border-box12>



      <!-- 出勤人员信息弹窗 -->
      <el-dialog v-model="daytimeAttendanceDialogVisible" title="出勤人员信息" width="70%" :z-index="99999999">
        <div v-if="attendanceLoading" class="text-center py-8">
          <dv-loading>Loading...</dv-loading>
        </div>
        <div v-else-if="attendanceData.length === 0" class="text-center py-8 text-gray-500">
          暂无出勤人员数据
        </div>
        <div v-else class="attendance-list">
          <div class="attendance-header mb-4 p-3 bg-gray-100 rounded">
            <span class="font-bold">生产线：{{ props.prodLine }}</span>
            <span class="ml-4 font-bold">白班人数：{{ attendanceData.length }}人</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div 
              v-for="(member, index) in attendanceData" 
              :key="index"
              class="attendance-item p-3 border rounded hover:bg-gray-50 text-center cursor-pointer transition-all duration-200 hover:shadow-md"
              @click="openReasonInfoDialog(member)"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {{ member.name ? member.name.charAt(0) : '?' }}
                </div>
                <div class="text-center w-full">
                  <div class="font-medium text-gray-800 mb-2">{{ member.name || '未知姓名' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

         <!-- 出勤人员信息弹窗 -->
         <el-dialog v-model="nighttimeAttendanceDialogVisible" title="出勤人员信息" width="70%" :z-index="99999999">
        <div v-if="attendanceLoading" class="text-center py-8">
          <dv-loading>Loading...</dv-loading>
        </div>
        <div v-else-if="nighttimeAttendanceData.length === 0" class="text-center py-8 text-gray-500">
          暂无出勤人员数据
        </div>
        <div v-else class="attendance-list">
          <div class="attendance-header mb-4 p-3 bg-gray-100 rounded">
            <span class="font-bold">生产线：{{ props.prodLine }}</span>
            <span class="ml-4 font-bold">晚班人数：{{ nighttimeAttendanceData.length }}人</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <div 
              v-for="(member, index) in nighttimeAttendanceData" 
              :key="index"
              class="attendance-item p-3 border rounded hover:bg-gray-50 text-center cursor-pointer transition-all duration-200 hover:shadow-md"
              @click="openReasonInfoDialog(member)"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {{ member.name ? member.name.charAt(0) : '?' }}
                </div>
                <div class="text-center w-full">
                  <div class="font-medium text-gray-800 mb-2">{{ member.name || '未知姓名' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <!-- 低于标准人效填写弹窗 -->
      <el-dialog 
        v-model="reasonDialogVisible" 
        title="填写原因" 
        width="50%" 
        :z-index="99999999"
      >
        <el-input
          v-model="customReason"
          type="textarea"
          :rows="6"
          :placeholder="isLine3 ? '请填写实际人数低于标准人数的原因...' : '请填写出勤人数低于配置人数的原因...'"
          maxlength="500"
          show-word-limit
        />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="reasonDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitReason">提交</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- Reason信息弹窗 -->
      <el-dialog 
        v-model="reasonInfoDialogVisible" 
        :title="selectedDevice?.name + ' - 详细信息'" 
        width="40%" 
        :z-index="99999999"
      >
        <div v-if="selectedDevice" class="reason-info-content">
          <div class="info-header p-4 mb-4 rounded">
            <h3 class="text-lg font-bold mb-2">员工信息</h3>
          </div>
          <div class="info-section mb-4">
            <h4 class="section-title font-semibold mb-2">姓名</h4>
            <p class="text-gray-700">{{ selectedDevice.name || '未知姓名' }}</p>
          </div>
          <div class="info-section mb-4">
            <h4 class="section-title font-semibold mb-2">工号</h4>
            <p class="text-gray-700">{{ selectedDevice.employeeId || '未知工号' }}</p>
          </div>
          <div class="info-section mb-4">
            <h4 class="section-title font-semibold mb-2">部门</h4>
            <p class="text-gray-700">{{ selectedDevice.department || '未知部门' }}</p>
          </div>
          <div class="info-section mb-4" v-if="selectedDevice.reason">
            <h4 class="section-title font-semibold mb-2">原因说明</h4>
            <div class="reason-content p-3 rounded">
              <p class="text-gray-700">{{ selectedDevice.reason }}</p>
            </div>
          </div>
          <div class="info-section mb-4" v-if="feedbackMessage">
            <h4 class="section-title font-semibold mb-2">反馈信息</h4>
            <div class="feedback-content p-3 rounded">
              <p class="text-gray-700">{{ feedbackMessage }}</p>
            </div>
          </div>
          <div v-if="showWarning" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 class="section-title font-semibold mb-2">原因填写</h4>
            <el-input
              v-model="newReason"
              type="textarea"
              :rows="4"
              :placeholder="isLine3 ? '请填写导致实际人数低于标准人数的原因...' : '请填写导致出勤人数低于配置人数的原因...'"
              maxlength="500"
              show-word-limit
            />
            <div class="mt-3 text-right">
              <el-button type="primary" size="small" @click="submitDeviceReason">提交原因</el-button>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="reasonInfoDialogVisible = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive, nextTick, computed } from 'vue';
import { eventBus } from '@/utils/eventbus';
import { createGaugeOption } from './gaugeChart';
import { useEcharts } from '@/utils/useEcharts';
import { getEfficiencyBelowAdd } from '@/api/getProduceinfo';
import { ElMessage } from 'element-plus';

// 定义 props
interface Props {
  efficiencyApi: (prodLine: string) => Promise<any>;
  attendanceApi: (prodLine: string) => Promise<any>;
  prodLine: string;
  title?: string;
  refreshEvent?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '人员情况',
  refreshEvent: 'refreshData'
});

const EfficentData = reactive({
  standardEfficiency: null,
  actualEfficiency: null,
  standardEmpNum: null,
  signNum: null, // 白班签到人数
  wanSignNum: null, // 晚班签到人数
  standardDayEmpNum: null, // 白班配置人数
  standardNightEmpNum: null, // 晚班配置人数
  warning: 0,
  reason: '',
});

const showWarning = computed(() => EfficentData.warning === 1);

// 判断是否为焊接三线（prodLine === '8'）
const isLine3 = computed(() => props.prodLine === '8');

const Indicators2 = ref(null);
const Indicators3 = ref(null);
const Indicators4 = ref(null);
const Indicators5 = ref(null);

const isLoading = ref(true);

// 出勤人员对话框相关状态
const daytimeAttendanceDialogVisible = ref(false);
const nighttimeAttendanceDialogVisible = ref(false);
const attendanceLoading = ref(false);
const attendanceData = ref([]);
const nighttimeAttendanceData = ref([]);

// Reason信息弹窗相关状态
const reasonInfoDialogVisible = ref(false);

const selectedDevice = ref(null);
const newReason = ref('');
const feedbackMessage = ref('');

const chart2 = useEcharts(Indicators2);
const chart3 = useEcharts(Indicators3);
const chart4 = useEcharts(Indicators4);
const chart5 = useEcharts(Indicators5);

const drawChart = () => {
  if (isLine3.value) {
    // 焊接三线：左上-配置人数、右上-出勤人数、左下-标准人效、右下-实际人效
    const standardEmpNum = EfficentData.standardEmpNum || 0;
    const attendanceNum = EfficentData.signNum || 0;
    const standardEfficiency = EfficentData.standardEfficiency ?? 0;
    const actualEfficiency = EfficentData.actualEfficiency ?? 0;

    const maxPeople = Math.max(standardEmpNum, attendanceNum, 1);
    const maxEfficiency = Math.max(standardEfficiency, actualEfficiency, 1);

    const option2 = createGaugeOption({
      text: "配置人数",
      data: standardEmpNum,  
      max: maxPeople
    });

    const option5 = createGaugeOption({
      text: "出勤人数",
      data: attendanceNum, 
      max: maxPeople
    });

    const option3 = createGaugeOption({
      text: "标准人效",
      data: standardEfficiency,
      max: maxEfficiency
    });

    const option4 = createGaugeOption({
      text: "实际人效",
      data: actualEfficiency,
      max: maxEfficiency
    });

    chart2.setOption(option2);
    chart5.setOption(option5);
    chart3.setOption(option3);
    chart4.setOption(option4);
  } else {
    // 焊接一线和二线：左上-白班配置人数、右上-白班出勤人数、左下-晚班配置人数、右下-晚班出勤人数
    const option4 = createGaugeOption({
      text: "白班配置人数",
      data: EfficentData.standardDayEmpNum,
      max: Math.max(EfficentData.standardDayEmpNum || 0, EfficentData.signNum || 0) || 100
    });

    const option2 = createGaugeOption({
      text: "白班出勤人数",
      data: EfficentData.signNum,  
      max: Math.max(EfficentData.standardDayEmpNum || 0, EfficentData.signNum || 0) || 100
    });

    const option3 = createGaugeOption({
      text: "晚班配置人数",
      data: EfficentData.standardNightEmpNum,
      max: Math.max(EfficentData.standardNightEmpNum || 0, EfficentData.wanSignNum || 0) || 100
    });

    const option5 = createGaugeOption({
      text: "晚班出勤人数",
      data: EfficentData.wanSignNum, 
      max: Math.max(EfficentData.standardNightEmpNum || 0, EfficentData.wanSignNum || 0) || 100
    });

    chart4.setOption(option4);
    chart2.setOption(option2);
    chart3.setOption(option3);
    chart5.setOption(option5);
  }
};

const fetchData = async () => {
  const res = await props.efficiencyApi(props.prodLine);
  console.log('res:', res);
  
  EfficentData.standardEfficiency = Number(res.data.standardEfficiency) || 0;
  EfficentData.actualEfficiency = Number(res.data.actualEfficiency) || 0;
  EfficentData.standardEmpNum = Number(res.data.standardEmpNum) || 0;
  EfficentData.signNum = Number(res.data.signNum) || 0;
  EfficentData.wanSignNum = Number(res.data.wanSignNum) || 0;
  
  // 获取白班和晚班配置人数，如果API没有返回，则使用standardEmpNum的一半
  EfficentData.standardDayEmpNum = Number(res.data.standardDayEmpNum) || Math.ceil((EfficentData.standardEmpNum || 0) / 2);
  EfficentData.standardNightEmpNum = Number(res.data.standardNightEmpNum) || Math.floor((EfficentData.standardEmpNum || 0) / 2);
  
  if (isLine3.value) {
    // 焊接三线：判断是否需要警告（实际人数低于标准人数）
    const actualEmpNum = EfficentData.signNum + EfficentData.wanSignNum;
    if (actualEmpNum < EfficentData.standardEmpNum) {
      EfficentData.warning = 1;
      EfficentData.reason = '实际人数低于标准人数，可能原因：出勤人数不足等';
    } else {
      EfficentData.warning = 0;
      EfficentData.reason = '';
    }
  } else {
    // 焊接一线和二线：判断是否需要警告（出勤人数低于配置人数）
    const dayWarning = EfficentData.signNum < EfficentData.standardDayEmpNum;
    const nightWarning = EfficentData.wanSignNum < EfficentData.standardNightEmpNum;
    if (dayWarning || nightWarning) {
      EfficentData.warning = 1;
      let reasons = [];
      if (dayWarning) reasons.push('白班出勤人数低于配置人数');
      if (nightWarning) reasons.push('晚班出勤人数低于配置人数');
      EfficentData.reason = reasons.join('，') + '，可能原因：出勤人数不足等';
    } else {
      EfficentData.warning = 0;
      EfficentData.reason = '';
    }
  }
  
  isLoading.value = false;
  nextTick(() => {
    chart2.initChart();
    chart3.initChart();
    chart4.initChart();
    chart5.initChart();
    drawChart();
  });
};

onMounted(() => {
  fetchData();
  eventBus.on(props.refreshEvent, fetchData);
});

onBeforeUnmount(() => {
  eventBus.off(props.refreshEvent, fetchData);
});

const reasonDialogVisible = ref(false);
const customReason = ref('');

function openReasonDialog() {
  reasonDialogVisible.value = true;
  customReason.value = '';
}

async function submitReason() {
  if (!customReason.value.trim()) {
    ElMessage.warning('请填写原因');
    return;
  }
  
  try {
    await getEfficiencyBelowAdd(props.prodLine, customReason.value);
    ElMessage.success('提交成功');
    reasonDialogVisible.value = false;
    customReason.value = '';
    fetchData();
  } catch (error) {
    console.error('提交原因失败:', error);
    ElMessage.error('提交失败，请重试');
  }
}

async function submitDeviceReason() {
  if (!newReason.value.trim()) {
    ElMessage.warning('请填写原因');
    return;
  }
  
  try {
    await getEfficiencyBelowAdd(props.prodLine, newReason.value);
    ElMessage.success('有一些原因已更新！');
    
    // 更新选中设备的原因
    if (selectedDevice.value) {
      selectedDevice.value.reason = newReason.value;
    }
    
    newReason.value = '';
  } catch (error) {
    console.error('提交原因失败:', error);
    ElMessage.error('提交失败，请重试');
  }
}

// 打开出勤人员弹窗
async function openAttendanceDialog() {
  daytimeAttendanceDialogVisible.value = true;
  attendanceLoading.value = true;
  
  try {
    const res = await props.attendanceApi(props.prodLine);
    const signDetail = res.data.signDetail;
    console.log('signDetail:', signDetail);
    if (signDetail && Array.isArray(signDetail)) {
      console.log('res.data:', res.data);
      // 将签到详情转换为信号数组
      attendanceData.value = signDetail.map(item => ({
        name: item.creatorName || item.emp_no,
        employeeId: item.emp_no,
        department: item.cx || '未知部门',
        reason: '暂无原因说明',
        macNo: item.emp_no
      }));
    } else {
      attendanceData.value = [];
    }
  } catch (error) {
    console.error('获取出勤人员信息失败:', error);
    attendanceData.value = [];
  } finally {
    attendanceLoading.value = false;
  }
}

// 打开晚班出勤人员弹窗
async function openNighttimeAttendanceDialog() {
  nighttimeAttendanceDialogVisible.value = true;
  attendanceLoading.value = true;
  
  try {
    const res = await props.attendanceApi(props.prodLine);
    const wanSignDetail = res.data.wanSignDetail;
    console.log('wanSignDetail:', wanSignDetail);
    if (wanSignDetail && Array.isArray(wanSignDetail)) {
      console.log('res.data:', res.data);
      // 将晚班签到详情转换为对象数组
      nighttimeAttendanceData.value = wanSignDetail.map(item => ({
        name: item.creatorName || item.emp_no,
        employeeId: item.emp_no,
        department: item.cx || '未知部门',
        reason: '暂无原因说明',
        macNo: item.emp_no
      }));
    } else {
      nighttimeAttendanceData.value = [];
    }
  } catch (error) {
    console.error('获取晚班出勤人员信息失败:', error);
    nighttimeAttendanceData.value = [];
  } finally {
    attendanceLoading.value = false;
  }
}

// 打开Reason信息弹窗
async function openReasonInfoDialog(device) {
  selectedDevice.value = device;
  newReason.value = ''; // 清空新Reason
  feedbackMessage.value = ''; // 清空回写信息
  reasonInfoDialogVisible.value = true;
}


</script>

<style scoped>
.efficency {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
}

.warning-icon-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.warn-icon {
  vertical-align: middle;
  margin-left: 4px;
  transform: translateY(-1px);
}

.reason-tip {
  color: #FFA000;
  font-size: 1em;
  font-weight: bold;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 2px 10px;
  margin-bottom: 4px;
  max-width: 90%;
  word-break: break-all;
}

.chuchai, .peizhi, .biaozhun, .shiji {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 0; /* 允许flex子项缩小 */
  overflow: hidden; /* 防止内容溢出 */
}

/* Reason信息弹窗样式 */
.reason-info-content {
  color: #333;
}

.info-header {
  background: linear-gradient(135deg, #e0f2fe, #b3e5fc);
  border: 1px solid #81d4fa;
}

.info-section {
  border-left: 4px solid #2196f3;
  padding-left: 16px;
}

.section-title {
  color: #1976d2;
  border-bottom: 2px solid #e3f2fd;
  padding-bottom: 8px;
}

.reason-content {
  background: linear-gradient(135deg, #f5f5f5, #eeeeee);
  border: 1px solid #e0e0e0;
}

.feedback-content {
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  border: 1px solid #a5d6a7;
}

/* 出勤人员卡片样式增强 */
.attendance-item {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.attendance-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #2196f3;
}

.attendance-item .text-sm {
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>