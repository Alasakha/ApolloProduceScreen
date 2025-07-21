<template>
    <div class="w-full h-full flex">
        <dv-border-box13>
            <div ref="chartRef1" class="w-full h-full"></div>
        </dv-border-box13>
    </div>

    <!-- 添加详细信息对话框 -->
    <el-dialog
        v-model="dialogVisible"
        title="故障详细信息"
        width="70%"
        class="custom-dialog"
    >
        <el-table :data="detailData" style="width: 100%" v-loading="loading">
            <el-table-column prop="breakdown_name" label="故障类型" />
            <el-table-column prop="breakdown_name2" label="故障子类型" />
            <el-table-column prop="udf021" label="故障原因" />
            <el-table-column prop="udf022" label="解决方案" />
            <el-table-column prop="udf023" label="处理方式" />
            <el-table-column prop="approvedate" label="审批日期" />
            <el-table-column prop="user_name" label="处理人" />
            <el-table-column prop="item_description" label="产品描述" />
            <el-table-column prop="item_specification" label="产品规格" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="unit_name" label="单位" />
            <el-table-column prop="doc_no" label="单号" />
            <el-table-column prop="khdh" label="客户代号" />
        </el-table>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useEcharts } from '@/utils/useEcharts'
import { createOption } from './chart'
import { getAfterServicePie, getAfterService } from '@/api/getQuiltyinfo'
import { ElMessage } from 'element-plus'

const chartRef1 = ref(null)
// 解构获取方法
const { initChart, setOption, resizeChart, onClick } = useEcharts(chartRef1)

const dialogVisible = ref(false)
const detailData = ref([])
const loading = ref(false)

// 图表点击事件处理
const handleChartClick = (params) => {
    console.log('Chart clicked:', params)
    if (params.data && params.data.breakdown_id) {
        fetchDetailData(params.data.breakdown_id)
    }
}

// 获取详细数据
const fetchDetailData = async (breakdown_id) => {
    loading.value = true
    try {
        const res = await getAfterService(breakdown_id,null,null)
        if (res.code === 200 && Array.isArray(res.data)) {
            detailData.value = res.data
            dialogVisible.value = true
        }
    } catch (error) {
        console.error('获取详细数据失败:', error)
        ElMessage.error('获取详细数据失败')
    } finally {
        loading.value = false
    }
}

const chartData = ref([])
const chartLabels = ref('投诉类别占比')

const fetchData = async () => {
    try {
        const res = await getAfterServicePie()
        if (res.code === 200 && Array.isArray(res.data)) {
            chartData.value = res.data.map(item => ({
                value: item.total,
                name: item.breakdown_name,
                breakdown_id: item.breakdown_id
            }))
        }
    } catch (error) {
        console.error('获取数据失败:', error)
    }
}

const drawChart = () => {
    const option1 = createOption(
        chartLabels.value,
        chartData.value
    )
    nextTick(async () => {
        await initChart()
        setOption(option1)
        onClick(handleChartClick)  // 使用解构出来的onClick方法
    })
}

watch([chartData, chartLabels], () => {
    drawChart()
}, { deep: true })

onMounted(async () => {
    await fetchData()
    drawChart()
    resizeChart()  // 添加resize监听
})

onBeforeUnmount(() => {
    // 清理工作会在useEcharts中自动处理
})
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

.custom-dialog :deep(.el-table) {
    background-color: transparent;
    color: #fff;
}

.custom-dialog :deep(.el-table th),
.custom-dialog :deep(.el-table tr) {
    background-color: transparent;
    color: #0CD3DB;
}

.custom-dialog :deep(.el-table td) {
    background-color: transparent;
    color: #fff;
}
</style>