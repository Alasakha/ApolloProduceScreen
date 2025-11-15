<template>
    <div class="quality-container">
        <div class="quality-title">
            <div class="title-content">
                <h3>今日不良问题(责任人分类)</h3>
            </div>
            <div class="title-actions">
                <el-button 
                    type="primary" 
                    size="small" 
                    @click="openDetailDialog('全部')"
                    class="detail-button"
                >
                    查看详细
                </el-button>
            </div>
        </div>
        <div class="chart-container">
            <EChartsPieChart
                :data="chartData"
                :radius="chartConfig.radius"
                :center="chartConfig.center"
                :start-angle="chartConfig.startAngle"
                :end-angle="chartConfig.endAngle"
                :show-label="chartConfig.showLabel"
                :show-value="chartConfig.showValue"
                :show-pointer="chartConfig.showPointer"
                :show-legend="chartConfig.showLegend"
                :empty-text="chartData && chartData.length > 0 ? '' : '暂无数据'"
                :empty-text-color="'#00ff00'"
                theme="dark"
                @click="handleChartClick"
                ref="pieChartRef"
            />
        </div>

        <!-- 明细Dialog -->
        <el-dialog
            v-model="dialogVisible"
            title="责任人问题明细"
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
                    <el-table-column prop="ngName" label="不合格名称" width="150" />
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
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import EChartsPieChart from '@/components/EChartsPieChart.vue'
import type { PieChartItem } from '@/components/EChartsPieChart.vue'
import { getTodayBadIssuesPerson, getTodayBadIssuesDetail, type TodayBadIssuesPerson } from '@/api/getStampWeldinfo'
import { getAbnormalHandleAdd } from '@/api/getQuiltyinfo'

// 定义 props
interface Props {
    prodLine?: string
}

const props = withDefaults(defineProps<Props>(), {
    prodLine: '1003' // 默认使用1003，如果接口需要其他值可以传入
})

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
const apiData = ref<TodayBadIssuesPerson[]>([])

// 图表数据 - 从API数据转换
const chartData = computed((): PieChartItem[] => {
    if (!apiData.value || apiData.value.length === 0) {
        return []
    }
    
    // 将API数据转换为图表数据格式
    return apiData.value.map((item, index) => ({
        name: item.ngResponPeople || '未知',
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

// 图表配置 - 半环图配置
const chartConfig = computed(() => ({
    radius: ['40%', '70%'] as [string, string], // 环形：内半径40%，外半径70%
    center: ['50%', '50%'] as [string, string], // 中心点居中
    startAngle: 180, // 从180度开始（左侧）
    endAngle: 0, // 到0度结束（右侧），形成下半圆
    showLabel: true,
    showValue: true,
    showPointer: true,
    showLegend: false, // 半环图隐藏图例，使用标签显示
    theme: 'dark',
    colors: [
        '#FF6B6B', // 红色 - 高对比度
        '#4ECDC4', // 青色 - 高对比度
        '#45B7D1', // 蓝色 - 高对比度
        '#96CEB4', // 绿色 - 高对比度
        '#FFC53D', // 黄色 - 高对比度
        '#B37FEB'  // 紫色 - 高对比度
    ]
}))

// 获取今日不良问题(责任人分类)数据
const fetchTodayBadIssuesPerson = async () => {
    try {
        console.log('开始获取今日不良问题(责任人分类)数据，生产线:', props.prodLine)
        
        const response = await getTodayBadIssuesPerson(props.prodLine)
        console.log('API响应数据:', response)
        
        if (response && response.data && response.data.length > 0) {
            apiData.value = response.data
            console.log('今日不良问题(责任人分类)数据:', apiData.value)
        } else {
            console.warn('API返回数据为空')
            apiData.value = []
        }
        
    } catch (error) {
        console.error('获取今日不良问题(责任人分类)数据失败:', error)
        apiData.value = []
    }
}

// 处理图表点击
const handleChartClick = (params: any) => {
    console.log('点击了图表项:', params)
    if (params.name) {
        openDetailDialog(params.name)
    }
}

// 打开明细Dialog
const openDetailDialog = (personName: string) => {
    console.log('打开明细Dialog，责任人:', personName)
    dialogVisible.value = true
    fetchDetailData(personName)
}

// 获取明细数据
const fetchDetailData = async (personName: string) => {
    loading.value = true
    errorMessage.value = ''
    
    try {
        console.log('开始获取明细数据，责任人:', personName, '生产线:', props.prodLine)
        
        const response = await getTodayBadIssuesDetail(props.prodLine)
        console.log('明细数据API响应:', response)
        
        if (response && response.data) {
            // 如果选择了特定责任人，过滤数据
            if (personName !== '全部') {
                detailData.value = response.data.filter(item => item.ngResponPeople === personName)
            } else {
                detailData.value = response.data
            }
            console.log('明细数据加载完成:', detailData.value)
        } else {
            detailData.value = []
            console.warn('明细数据API返回为空')
        }
        
    } catch (error: any) {
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

// 定时刷新数据
let refreshTimer: NodeJS.Timeout | null = null

// 启动定时刷新
const startAutoRefresh = () => {
    refreshTimer = setInterval(() => {
        fetchTodayBadIssuesPerson()
    }, 180000) // 每3分钟刷新一次
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
    await fetchTodayBadIssuesPerson()
    
    // 启动自动刷新
    startAutoRefresh()
})

// 组件卸载时清理定时器
onUnmounted(() => {
    stopAutoRefresh()
})

</script>

<style scoped>
.quality-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 0 8px;
    width: 100%;
}

.quality-title {
    background: #279f27;
    padding: 8px 16px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.title-actions {
    display: flex;
    gap: 8px;
}

.quality-title h3 {
    margin: 0;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}

.detail-button {
    background: linear-gradient(135deg, #4A90E2, #357ABD);
    border: none;
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
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
    height: 100%;
    overflow: hidden;
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

