<template>
    <div class="left-container w-1/3 h-full min-h-[400px]">
        <Title title="焊接三线(手工线)">
            <div class="content-wrapper">
                <!-- 第三行：其他组件区域 (30%) -->
                <div class="components-row">
                    <div class="component-half">
                        <PersonnalSituation 
                            :efficiency-api="efficiencyApi"
                            :attendance-api="attendanceApi"
                            :prod-line="prodLine"
                            title="人员情况"
                            refresh-event="refreshData"
                        />
                    </div>
                    <div class="component-half">
                        <WorkOrderClosingRate :work-order-data-prop="workOrderData" />
                    </div>
                </div>

                <!-- 第一行：日生产计划表格区域 (30%) -->
                <div class="plan-section">
                    <PlanTable 
                        :daily-data-prop="dailyPlanData"
                        :monthly-data-prop="monthlyPlanData"
                    />
                </div>

                <!-- 第三行：其他组件区域 (30%) -->
                <div class="components-3row">
                    <div class="component-half">
                        <PersonBadIssues />
                    </div>
                </div>
            </div>
        </Title>
    </div>
</template>




<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import Title from '../component/title.vue'
import PlanTable from '../component/plan/index.vue'
import WorkOrderClosingRate from '../component/WorkOrderClosingRate.vue'
import PersonnalSituation from '../component/PersonnalSituation.vue'
import PersonBadIssues from './PersonBadIssues.vue'
import { getMetalworkingEfficiency } from '@/api/getStampinfo'
import { getTodayProduction, getMonthProduction } from '@/api/getStampWeldinfo'
import { eventBus } from '@/utils/eventbus'
// import { getDayPlanDone, getDayPlanDoneTotal } from '@/api/getStampWeldinfo'
// import OneProdLine from './oneProdLine.vue'
// const route = useRoute()
const prodLine = ref('8')

// 日生产计划和月生产计划数据
const dailyPlanData = ref<any>(null)
const monthlyPlanData = ref<any>(null)

// 工单结单率 mock 数据
const workOrderData = ref({
  categoryData: {
    categoryA: {
      shouldComplete: 8,        // 今日应完结工单数（A类）
      onTimeComplete: 7,        // 今日及时完结数（A类）
      completionRate: 87.5,    // 完结率（A类）
      canClick: true
    },
    regular: {
      shouldComplete: 7,        // 今日应完结工单数（常规）
      onTimeComplete: 5,        // 今日及时完结数（常规）
      completionRate: 71.4,    // 完结率（常规）
      canClick: true
    }
  },
  // 保留原有字段用于兼容
  monthCompletedOrders: 125,
  onTimeOrders: 98,
  closingRate: 78.4,
  todayCompletedOnTime: 15,
  todayOnTimeCompleted: 12,
  todayClosingRate: 80.0
})

// 获取日生产计划和月生产计划数据
const fetchPlanData = async () => {
  try {
    // 同时调用日数据和月数据接口，传入产线1003
    const [dailyRes, monthlyRes] = await Promise.all([
      getTodayProduction('1003'),
      getMonthProduction('1003')
    ])
    
    dailyPlanData.value = dailyRes
    monthlyPlanData.value = monthlyRes
  } catch (error) {
    console.error('获取生产计划数据失败:', error)
  }
}
// 定义 API 函数
const efficiencyApi = async (prodLine: string) => {
    return await getMetalworkingEfficiency(prodLine)
}

// 定义 attendanceApi 函数（与 efficiencyApi 使用同一个接口）
const attendanceApi = async (prodLine: string) => {
    return await getMetalworkingEfficiency(prodLine)
}

// 获取日生产计划数据 - 暂时注释，使用暂无数据
// const fetchPlanData = async () => {
//     try {
//         // 异步获取汇总数据
//         getDayPlanDoneTotal(prodLine.value).then(response => {
//             if (response && response.data) {
//                 dashboardData.value = {
//                     total: response.data.total || 0,
//                     completed: response.data.done || 0,
//                     efficiency: response.data.total > 0 ? Math.round((response.data.done / response.data.total) * 100) : 0
//                 }
//             }
//         }).catch(error => {
//             console.error('获取汇总数据失败:', error)
//         })
//         
//         // 异步获取详细表格数据
//         getDayPlanDone(prodLine.value).then(response => {
//             if (response && response.data) {
//                 // 转换表格数据
//                 tableData.value = response.data.map((item, index) => ({
//                     product: item.label || '--',
//                     model: item.cx || '--',
//                     plan: item.num || 0,
//                     actual: item.done.toString() || '--',
//                     difference: (item.num - item.done).toString() || '--',
//                     completionRate: item.done > 0 ? Math.round((item.done / item.num) * 100).toString() : '0 ',
//                     color: ['orange', 'blue', 'green'][index % 3] as 'orange' | 'blue' | 'green'
//                 }))
//             }
//         }).catch(error => {
//             console.error('获取表格数据失败:', error)
//         })
//     } catch (error) {
//         console.error('获取日生产计划数据失败:', error)
//     }
// }

// 组件挂载时获取数据
onMounted(() => {
    fetchPlanData()
    eventBus.on('refreshData', fetchPlanData)
})

onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchPlanData)
})




</script>
<style scoped>
.left-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 8px;
    padding: 8px;
}

.plan-section {
    height: 26%;
    min-height: 200px;
}

.components-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 25%; /* 占30%高度 */
    gap: 8px; /* 两个组件之间的间距 */
}

.components-3row {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40%; /* 占30%高度 */
    gap: 8px; /* 两个组件之间的间距 */
}

/* 中间空白区域 */
.middle-space {
    height: 30%;
}

.component-half {
    flex: 1;
    width: 50%;
    height: 100%;
    min-width: 0; /* 防止内容溢出 */
    display: flex;
    flex-direction: column;
}
</style>