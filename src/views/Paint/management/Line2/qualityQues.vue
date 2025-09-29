<template>
    <div class="quality-container w-full h-full p-2">
        <div class="quality-title">
            <div class="title-content">
                <div class="text-lg font-bold text-white mb-1 text-center" style="letter-spacing: 2px;">
                    今日质量TOP问题
                </div>
            </div>
            <el-button 
                type="primary" 
                size="small" 
                @click="openDetailDialog('全部')"
                class="detail-button"
            >
                查看详细
            </el-button>
        </div>
        <div class="chart-container">
            <EChartsPieChart
                :data="chartData"
                :title="chartConfig.title"
                :radius="chartConfig.radius"
                :center="chartConfig.center"
                :show-label="chartConfig.showLabel"
                :show-value="chartConfig.showValue"
                :show-pointer="chartConfig.showPointer"
                :empty-text="chartData && chartData.length > 0 ? '' : '→ 暂无数据'"
                :empty-text-color="'#00ff00'"
                @click="handleChartClick"
                ref="pieChartRef"
            />
        </div>
        
        <!-- 明细Dialog -->
        <el-dialog
            v-model="dialogVisible"
            title="质量问题明细"
            width="80%"
            :before-close="handleClose"
            class="detail-dialog"
            :close-on-click-modal="false"
            :close-on-press-escape="true"
            :append-to-body="true"
            :destroy-on-close="true"
        >
            <div class="detail-content">
                <div v-if="loading" class="loading-container">
                    <el-icon class="is-loading"><Loading /></el-icon>
                    <span>数据加载中...</span>
                </div>
                
                <el-table 
                    v-else 
                    :data="detailData" 
                    border 
                    style="width: 100%"
                    :empty-text="errorMessage || '暂无数据'"
                >
                    <el-table-column prop="createDate" label="日期" width="220" />
                    <el-table-column prop="udf021" label="客户单号" width="150" />
                    <el-table-column prop="ta006" label="品号" width="140" />
                    <el-table-column prop="mb002" label="品名" width="230" />
                    <el-table-column prop="mb003" label="规格型号" width="340" />
                    <el-table-column prop="ngNO" label="不合格代码" width="120" />
                    <!-- <el-table-column prop="ngName" label="不合格名称" width="150" /> -->
                    <el-table-column prop="admin_UNIT_NAME" label="责任部门" width="120" />
                    <el-table-column prop="ngResponPeople" label="责任人" width="100" />
                    <el-table-column prop="nums" label="数量" width="80" />
                    <el-table-column prop="ngReason" label="原因" width="120" />
                    <el-table-column prop="ngHandle" label="处理方式" width="120" />
                    <el-table-column label="操作" width="100">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="handleEdit(scope.row)">填写</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                

            </div>
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 填写原因弹窗 -->
        <el-dialog 
            v-model="reasonDialogVisible" 
            title="填写原因/处理方式" 
            width="40%"
            :close-on-click-modal="false"
            :before-close="handleReasonDialogClose"
            destroy-on-close
            append-to-body
        >
            <el-form :model="reasonForm" label-width="120px">
                <el-form-item label="不良问题">
                    <el-input v-model="reasonForm.reason" placeholder="请输入不良问题原因" />
                </el-form-item>
                <el-form-item label="处理方式">
                    <el-input v-model="reasonForm.way" placeholder="请输入处理方式" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="clearReasonForm">清空</el-button>
                    <el-button @click="reasonDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleReasonSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed,onUnmounted  } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import EChartsPieChart from '@/components/EChartsPieChart.vue'
import type { PieChartItem } from '@/components/EChartsPieChart.vue'
import { getTodayBadIssues, getTodayBadIssuesDetail, type TodayBadIssues } from '@/api/getStampWeldinfo'
import { getAbnormalHandleAdd } from '@/api/getQuiltyinfo'
import { useRoute } from 'vue-router'

const route = useRoute()
const prodLine = route.query.prodLine as string

// 图表引用
const pieChartRef = ref()

// Dialog控制
const dialogVisible = ref(false)
const detailData = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

// 填写原因相关
const reasonDialogVisible = ref(false)
const reasonForm = ref({
    reason: '',
    way: ''
})
const currentRowUid = ref('')



// 真实API数据
const apiData = ref<TodayBadIssues[]>([])

// 图表数据 - 从API数据转换
const chartData = computed((): PieChartItem[] => {
    if (!apiData.value || apiData.value.length === 0) {
        return []
    }
    
    // 将API数据转换为图表数据格式
    return apiData.value.map((item, index) => ({
        name: item.ngName,
        value: item.total,
        color: getDefaultColor(index)
    }))
})

// 获取默认颜色
const getDefaultColor = (index: number): string => {
    const colors = [
        '#4A90E2', '#7B68EE', '#9370DB', '#8A2BE2', 
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8E8', '#F7DC6F'
    ]
    return colors[index % colors.length]
}

// 图表配置 - 优化字体颜色和可读性
const chartConfig = computed(() => ({
    title: '质量TOP问题分布',
    radius: '70%',
    center: ['50%', '50%'] as [string, string],
    showLabel: true,
    showValue: true,
    showPointer: true,
    theme: 'dark',
    // 自定义颜色配置，确保高对比度
    colors: [
        '#FF6B6B', // 红色 - 高对比度
        '#4ECDC4', // 青色 - 高对比度
        '#45B7D1', // 蓝色 - 高对比度
        '#96CEB4', // 绿色 - 高对比度
        '#FFC53D', // 黄色 - 高对比度
        '#B37FEB'  // 紫色 - 高对比度
    ]
}))

// 获取今日不良TOP问题数据
const fetchTodayBadIssues = async () => {
    try {
        console.log('开始获取今日不良TOP问题数据，生产线:', prodLine)
        
        const response = await getTodayBadIssues(prodLine)
        console.log('API响应数据:', response)
        
        if (response && response.data) {
            apiData.value = response.data
            console.log('今日不良TOP问题数据:', apiData.value)
        } else {
            console.warn('API返回数据为空')
            apiData.value = []
        }
        
    } catch (error) {
        console.error('获取今日不良TOP问题数据失败:', error)
        apiData.value = []
    }
}

// 处理图表点击
const handleChartClick = (params: any) => {
    console.log('🎯 Paint组件收到图表点击事件:', params)
    console.log('点击参数详情:', {
        name: params.name,
        value: params.value,
        dataIndex: params.dataIndex,
        seriesName: params.seriesName,
        seriesType: params.seriesType
    })
    
    if (params.name) {
        console.log('✅ 有效点击，准备打开明细Dialog，类别:', params.name)
        openDetailDialog(params.name)
    } else {
        console.warn('⚠️ 点击事件缺少name参数:', params)
    }
}

// 打开明细Dialog
const openDetailDialog = (category: string) => {
    console.log('打开明细Dialog，类别:', category)
    dialogVisible.value = true
    fetchDetailData(category)
}

// 获取明细数据
const fetchDetailData = async (category: string) => {
    loading.value = true
    errorMessage.value = ''
    
    try {
        console.log('开始获取明细数据，类别:', category, '生产线:', prodLine)
        
        const response = await getTodayBadIssuesDetail(prodLine)
        console.log('明细数据API响应:', response)
        
        if (response && response.data) {
            // 如果选择了特定类别，过滤数据
            if (category !== '全部') {
                detailData.value = response.data.filter(item => item.ngName === category)
            } else {
                detailData.value = response.data
            }
            console.log('明细数据加载完成:', detailData.value)
        } else {
            detailData.value = []
            console.warn('明细数据API返回为空')
        }
        
    } catch (error) {
        console.error('获取明细数据失败:', error)
        errorMessage.value = `数据加载失败: ${error.message || '未知错误'}`
        detailData.value = []
    } finally {
        loading.value = false
    }
}

// 关闭Dialog
const handleClose = () => {
    dialogVisible.value = false
    detailData.value = []
    errorMessage.value = ''
}

// 定时刷新数据
let refreshTimer: NodeJS.Timeout | null = null

// 启动定时刷新
const startAutoRefresh = () => {
    refreshTimer = setInterval(() => {
        
        fetchTodayBadIssues()
    }, 60000) // 每分钟刷新一次
}

// 停止定时刷新
const stopAutoRefresh = () => {
    if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
    }
}

onMounted(async () => {
    // 初始加载数据
    await fetchTodayBadIssues()
    
    // 启动自动刷新
    startAutoRefresh()
})

// 组件卸载时清理定时器
onUnmounted(() => {
    stopAutoRefresh()
})

// 处理填写按钮点击
const handleEdit = (row: any) => {
    console.log('点击填写按钮，行数据:', row)
    reasonDialogVisible.value = true
    reasonForm.value.reason = row.ngReason || ''
    reasonForm.value.way = row.ngHandle || ''
    currentRowUid.value = row.uid
}

// 处理原因提交
const handleReasonSubmit = () => {
    if (!currentRowUid.value) {
        ElMessage.error('缺少必要参数')
        return
    }
    
    getAbnormalHandleAdd(currentRowUid.value, reasonForm.value.way, reasonForm.value.reason)
        .then(res => {
            if (res.code === 200) {
                ElMessage.success('提交成功')
                reasonDialogVisible.value = false
                // 刷新明细数据
                fetchDetailData('全部')
            } else {
                ElMessage.error('提交失败')
            }
        })
        .catch(error => {
            console.error('提交失败:', error)
            ElMessage.error('提交失败')
        })
}

// 清空原因表单
const clearReasonForm = () => {
    reasonForm.value.reason = ''
    reasonForm.value.way = ''
}

// 关闭原因对话框
const handleReasonDialogClose = () => {
    reasonDialogVisible.value = false
    clearReasonForm()
}

// 监听生产线变化
// watch(prodLine, () => {
//     fetchTodayBadIssues()
// })


</script>

<style scoped>
.quality-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(34, 211, 238, 0.3);
    overflow: hidden; /* 防止内容溢出 */
    box-sizing: border-box;
}

.quality-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.title-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.department-info {
    color: #87CEEB;
    font-size: 12px;
    font-weight: 500;
    margin-top: 2px;
}

.detail-button {
    background: linear-gradient(135deg, #4A90E2, #357ABD);
    border: none;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 12px;
    padding: 4px 8px;
}

.detail-button:hover {
    background: linear-gradient(135deg, #357ABD, #2E6DA4);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

.chart-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 0; /* 允许容器收缩 */
    padding: 8px;
    box-sizing: border-box;

}

.description-box {
    background: rgba(135, 206, 235, 0.2);
    padding: 12px;
    border-radius: 6px;
    border: 1px solid rgba(135, 206, 235, 0.3);
}

.description-box p {
    margin: 0;
    font-size: 12px;
    color: #2c3e50;
    line-height: 1.4;
    text-align: center;
}

/* Dialog样式 */
.detail-dialog {
    background: rgba(0, 0, 0, 0.8);
}

.detail-content {
    max-height: 60vh;
    overflow-y: auto;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #909399;
}

.loading-container .el-icon {
    font-size: 24px;
    margin-bottom: 12px;
}

.dialog-footer {
    text-align: right;
}


</style>