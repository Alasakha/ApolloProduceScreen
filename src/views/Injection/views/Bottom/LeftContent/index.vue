<template>
  <div class='pl-5 pt-1'>
    <div class="flex justify-center items-center text-lg text-white font-bold relative">
      <p class="tracking-widest text-xl ">原材料投入产出监控</p>
      <div class="absolute right-4 flex gap-2">
        <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="day">本日</el-radio-button>
        </el-radio-group>
        <el-button size="small" type="primary" @click="dialogVisible = true">详细</el-button>
      </div>
    </div>
    <div class="relative" style="width:47vw;height:19vh;">
      <materialScrollBoard :config="config" style="width:47vw;height:25vh;"/>
      <div v-if="boardLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <el-icon class="is-loading" style="font-size: 24px; color: #409eff;">
          <Loading />
        </el-icon>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="`原材料投入产出监控明细 - ${timeRangeText}`" width="70vw" >
      <el-table :data="tableData"  :loading="tableLoading" style="width: 100%" >
        <el-table-column label="序号" type="index" width="80" align="center" />
        <el-table-column v-for="(col, idx) in dialogHeaders" :key="col" :label="col" :prop="'col' + idx" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted,onBeforeUnmount, computed } from 'vue'
import { getInputOutput } from '@/api/getInjection'
import { eventBus } from '@/utils/eventbus';
import  {ElMessage} from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import materialScrollBoard from '@/components/datav/MaterialScrollBoard.vue'

// 时间维度：month-本月, week-本周, day-本日
const timeRange = ref<'month' | 'week' | 'day'>('month')

// 格式化日期为 YYYY-MM-DD（使用本地时间，避免时区问题）
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取日期范围
// 修正：月的开始时间应为本月1号，不是上个月31号
const getDateRange = (range: 'month' | 'week' | 'day') => {
  const today = new Date()
  const endDay = formatLocalDate(today) // YYYY-MM-DD
  let startDay = ''
  if (range === 'day') {
    startDay = endDay
  } else if (range === 'week') {
    // 以周一为一周开始
    const dayOfWeek = today.getDay()
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // 周一为0
    const monday = new Date(today)
    monday.setDate(today.getDate() - diff)
    startDay = formatLocalDate(monday)
  } else { // month
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    startDay = formatLocalDate(firstDay)
  }
  return { startDay, endDay }
}

// 时间维度文本
const timeRangeText = computed(() => {
  const map = { month: '本月', week: '本周', day: '本日' }
  return map[timeRange.value]
})

// 本月表头
const monthHeaders = ['材料规格','月计划产出数', '月计划用量', '实际产出数','实际用量', '产出回料重量', '产出比', '损耗率']
// 本周表头
const weekHeaders = [ '材料规格',  '周计划产出数','周计划用量', '实际产出数','实际用量',  '产出回料重量', '产出比', '损耗率']
// 本日表头
const dayHeaders = ['材料规格',  '日计划产出数','日计划用量', '实际产出数','实际用量',  '产出回料重量', '产出比', '损耗率']

// 滚动表格配置
const config = reactive({
  header: monthHeaders,
  data: [],
  index: true,
  align: ['center','center','center','center','center','center','center','center','center'],
  rowNum: 7,
  columnWidth: [50],
  headerHeight: 20
})

// 对话框表头
const dialogHeaders = computed(() => {
  if (timeRange.value === 'month') return monthHeaders
  if (timeRange.value === 'week') return weekHeaders
  return dayHeaders
})

// 对话框表格数据
const tableData = computed(() => {
  return config.data.map(row => {
    const obj: Record<string, any> = {};
    row.forEach((val, idx) => {
      obj['col' + idx] = val;
    });
    return obj;
  });
})

const dialogVisible = ref(false);
const tableLoading = ref(false);
const boardLoading = ref(false);

// 计算产出比
const calculateOutputRatio = (actualOutput: number, actualUsage: number) => {
  if (!actualUsage || actualUsage === 0) return '0.00'
  return (actualOutput / actualUsage).toFixed(2)
}

// 计算损耗率
const calculateLossRate = (actualUsage: number, actualOutput: number) => {
  if (!actualUsage || actualUsage === 0) return '0.00%'
  const rate = ((actualUsage - actualOutput) / actualUsage * 100).toFixed(2)
  return rate + '%'
}

// 处理时间维度切换
const handleTimeRangeChange = () => {
  fetchData()
}

// 获取数据
const fetchData = async () => {
  boardLoading.value = true;
  tableLoading.value = true;
  try {
    const { startDay, endDay } = getDateRange(timeRange.value)
    const res = await getInputOutput(startDay, endDay);
    
    if (res && res.code === 200 && res.data) {
      const { itemList = [], ty004 = 0, te011 = 0, lot_att21 = '0' } = res.data
      
      // 更新表头
      if (timeRange.value === 'month') {
        config.header = monthHeaders
        config.align = ['center','center','center','center','center','center','center','center','center']
      } else if (timeRange.value === 'week') {
        config.header = weekHeaders
        config.align = ['center','center','center','center','center','center','center','center','center']
      } else {
        config.header = dayHeaders
        config.align = ['center','center','center','center','center','center','center','center','center']
      }
      
      // 处理数据
      config.data = itemList.map((item: any) => {
        const actualUsage = parseFloat(item.issued_qty) || 0
        const planUsage = parseFloat(item.required_qty) || 0
        const actualOutput = parseFloat(te011) || 0
        const planOutput = parseFloat(ty004) || 0
        const recycleWeight = parseFloat(lot_att21) || 0
        
        const baseData = [

          item.item_description || item.item_specification || '-',
          planOutput,
          planUsage.toFixed(2) + 'kg',
          actualOutput,
          actualUsage.toFixed(2) + 'kg',
          
          recycleWeight.toFixed(2) + 'kg'
        ]
        
        // 所有时间维度都需要添加产出比和损耗率
        const outputRatio = calculateOutputRatio(actualOutput, actualUsage)
        const lossRate = calculateLossRate(actualUsage, actualOutput)
        baseData.push(outputRatio, lossRate)
        
        return baseData
      })
    } else {
      // 接口返回失败时，清空数据
      config.data = []
    }
  } catch (error) {
    console.error('数据获取失败:', error);
    ElMessage.error('数据获取失败');
    // 出错时清空数据
    config.data = []
  } finally {
    boardLoading.value = false;
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