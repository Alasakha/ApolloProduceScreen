<template>
    <div class="left-container w-1/3 h-full min-h-[400px]">
        <Title title="焊接一线(安川线)">
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
                        <designSituation :device-type="9" />
                    </div>
                </div>

                <!-- 第一行：日生产计划表格区域 (30%) -->
                <div class="plan-section">
                    <PlanTable 
                        :dashboard-data="dashboardData"
                        :table-data="tableData"
                    />
                </div>

                <!-- 第三行：其他组件区域 (30%) -->
                <div class="components-3row">
                    <div class="component-half">
                        <OneProdLine />
                    </div>
                </div>
            </div>
        </Title>
    </div>
</template>




<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Title from '../component/title.vue'
import PlanTable from '../component/plan/index.vue'
import designSituation from '../component/design/Leftcontent.vue'
import PersonnalSituation from '../component/PersonnalSituation.vue'
import { getMetalworkingEfficiency } from '@/api/getStampinfo'
import { getDayPlanDone, getDayPlanDoneTotal } from '@/api/getStampWeldinfo'
import OneProdLine from './oneProdLine.vue'

// const route = useRoute()
const prodLine = ref('9')

// 定义 API 函数
const efficiencyApi = async (prodLine: string) => {
    return await getMetalworkingEfficiency(prodLine)
}

// 定义 attendanceApi 函数（与 efficiencyApi 使用同一个接口）
const attendanceApi = async (prodLine: string) => {
    return await getMetalworkingEfficiency(prodLine)
}

// 获取日生产计划数据
const fetchPlanData = async () => {
    try {
        // 异步获取汇总数据
        getDayPlanDoneTotal(prodLine.value).then(response => {
            if (response && response.data) {
                dashboardData.value = {
                    total: response.data.total || 0,
                    completed: response.data.done || 0,
                    efficiency: response.data.total > 0 ? Math.round((response.data.done / response.data.total) * 100) : 0
                }
            }
        }).catch(error => {
            console.error('获取汇总数据失败:', error)
        })
        
        // 异步获取详细表格数据
        getDayPlanDone(prodLine.value).then(response => {
            if (response && response.data) {
                // 转换表格数据
                tableData.value = response.data.map((item, index) => ({
                    product: item.label || '--',
                    model: item.cx || '--',
                    plan: item.num || 0,
                    actual: item.done.toString() || '--',
                    difference: (item.num - item.done).toString() || '--',
                    completionRate: item.done > 0 ? Math.round((item.done / item.num) * 100).toString() : '0 ',
                    color: ['orange', 'blue', 'green'][index % 3] as 'orange' | 'blue' | 'green'
                }))
            }
        }).catch(error => {
            console.error('获取表格数据失败:', error)
        })
    } catch (error) {
        console.error('获取日生产计划数据失败:', error)
    }
}

// 组件挂载时获取数据
onMounted(() => {
    fetchPlanData()
})



// 定义表格数据接口
interface DashboardData {
    total: number
    completed: number
    efficiency: number
}

interface TableRowData {
    product: string
    model: string
    plan: number
    actual: string
    difference: string
    completionRate: string
    color: 'orange' | 'blue' | 'green'
}

// 右上角数据卡片数据
const dashboardData = ref<DashboardData>({
    total: 6865,
    completed: 3323,
    efficiency: 48
})

// 表格行数据 - 第二行数据完全由父组件传入
const tableData = ref<TableRowData[]>([
  {
    product: '车架',
    model: '34-2',
    plan: 100,
    actual: '--',
    difference: '--',
    completionRate: '--',
    color: 'orange'
  },
  {
    product: '后叉',
    model: '战娃',
    plan: 80,
    actual: '--',
    difference: '--',
    completionRate: '--',
    color: 'blue'
  },
  {
    product: '尾架',
    model: 'BE13',
    plan: 60,
    actual: '--',
    difference: '--',
    completionRate: '--',
    color: 'green'
  }
])




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