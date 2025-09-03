<template>
    <div class="yield-container" @click="openDetailDialog">
        <div class="yield-title">
            <h3 class="3xl:text-sm">毛坯直通率</h3>
            <span class="click-note">(点击进入可以查看和编辑不合格问题明细)</span>
        </div>
        <div class="yield-content">
            <div class="part-section flex w-full">
                <div class="part-header">车架</div>
                <div class="metrics-line">
                    <span class="metric">今日检验数: {{ weldingData.cjTotal  }}</span>
                    <span class="metric">一次合格数: {{weldingData.cjPass}}</span>
                    <span class="metric">直通率: {{ weldingData.cjTotal ? (weldingData.cjPass / weldingData.cjTotal * 100).toFixed(1) : '--' }}%</span>
                    <span class="metric">合格数: {{ handleData(weldingData.cjPass)  }}</span>
                    <span class="metric">合格率: {{ getQualifiedRate(weldingData.cjTotal, weldingData.cjPass) }}</span>
                </div>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">后叉</div>
                <div class="metrics-line">
                    <span class="metric">今日检验数: {{ handleData(weldingData.hchTotal)  }}</span>
                    <span class="metric">一次合格数: {{weldingData.hchPass}}</span>
                    <span class="metric">直通率: {{ weldingData.hchTotal ? (weldingData.hchPass / weldingData.hchTotal * 100).toFixed(1) : '--' }}%</span>
                    <span class="metric">合格数: {{ handleData(weldingData.hchPass)  }}</span>
                    <span class="metric">合格率: {{ getQualifiedRate(weldingData.hchTotal, weldingData.hchPass) }}</span>
                </div>
            </div>
            
            <div class="part-section flex">
                <div class="part-header">尾架</div>
                <div class="metrics-line">
                    <span class="metric">今日检验数: {{ handleData(weldingData.wjTotal) }}</span>
                    <span class="metric">一次合格数: {{weldingData.wjPass}}</span>
                    <span class="metric">直通率: {{ weldingData.wjTotal ? (weldingData.wjPass / weldingData.wjTotal * 100).toFixed(1) : '--' }}%</span>
                    <span class="metric">合格数: {{ handleData(weldingData.wjPass)  }}</span>
                    <span class="metric">合格率: {{ getQualifiedRate(weldingData.wjTotal, weldingData.wjPass) }}</span>
                </div>
            </div>
        </div>
        <!-- <div class="click-note">
            <span>(点击进去可以看不合格问题明细)</span>
        </div> -->
    </div>

    <!-- 不合格明细Dialog -->
    <el-dialog
        v-model="dialogVisible"
        title="不合格问题明细"
        width="80%"
        :before-close="handleClose"
        class="detail-dialog"
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :append-to-body="true"
        :destroy-on-close="true"
        :lock-scroll="false"
        :modal="true"
        :show-close="true"
        :draggable="false"
        :resize="false"
        :z-index="10000"
        :modal-append-to-body="true"

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
                v-loading="loading"
                element-loading-text="数据加载中..."
            >
                <!-- 合并行显示其他属性 -->
                <el-table-column prop="uid" label="日期" width="120" />
                <el-table-column label="工单号" width="150">
                    <template #default="scope">
                        {{ scope.row.ta001 }}{{ scope.row.ta002 }}
                    </template>
                </el-table-column>
                <el-table-column prop="ta006" label="品号" width="120" />
                <el-table-column prop="udf021" label="客户单号" width="150" />
                <el-table-column prop="mb002" label="类型" width="100" />
                <el-table-column prop="mb003" label="规格" width="320" />
                <el-table-column prop="bhgNum" label="不合格数" width="100" />
                <el-table-column prop="updateTime" label="更新时间" width="160" />
                
                <!-- detailList分列展示 -->
                <!-- <el-table-column label="不合格代码" width="120">
                    <template #default="scope">
                        <div v-if="scope.row.detailList && scope.row.detailList.length > 0">
                            <div v-for="(detail, index) in scope.row.detailList" :key="index" class="detail-item">
                                {{ detail.ngNO || '--' }}
                            </div>
                        </div>
                        <span v-else>--</span>
                    </template>
                </el-table-column> -->
                
                <el-table-column label="不合格名称" width="150" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.detailList && scope.row.detailList.length > 0" class="detail-grid-container">
                            <div v-for="(detail, index) in scope.row.detailList" :key="index" class="detail-grid-item">
                                <span class="detail-grid-text">{{ detail.ngName || '--' }}</span>
                            </div>
                        </div>
                        <span v-else class="no-data">--</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="责任部门" width="220" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.detailList && scope.row.detailList.length > 0" class="detail-grid-container">
                            <div v-for="(detail, index) in scope.row.detailList" :key="index" class="detail-grid-item">
                                <span class="detail-grid-text">{{ detail.admin_unit_name || '--' }}</span>
                            </div>
                        </div>
                        <span v-else class="no-data">--</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="问题点数量" width="100" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.detailList && scope.row.detailList.length > 0" class="detail-grid-container">
                            <div v-for="(detail, index) in scope.row.detailList" :key="index" class="detail-grid-item">
                                <span class="detail-grid-text">{{ detail.nums || '--' }}</span>
                            </div>
                        </div>
                        <span v-else class="no-data">--</span>
                    </template>
                </el-table-column>

                <el-table-column label="责任人" width="200" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.detailList && scope.row.detailList.length > 0" class="detail-grid-container">
                            <div v-for="(detail, index) in scope.row.detailList" :key="index" class="detail-grid-item">
                                <span class="detail-grid-text">{{ detail.ngResponPeople || '--' }}</span>
                            </div>
                        </div>
                        <span v-else class="no-data">--</span>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 调试信息 -->
            <div v-if="!loading && detailData.length === 0" class="debug-info">
                <p>调试信息：</p>
                <p>数据长度: {{ detailData.length }}</p>
                <p>错误信息: {{ errorMessage || '无' }}</p>
                <el-button @click="fetchDetailData" type="primary" size="small">重新加载</el-button>
            </div>
        </div>
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getWeldingPass, type WeldingPass } from '@/api/getStampWeldinfo'
import { getWeldingPassDetail, type WeldingPassDetail } from '@/api/getStampWeldinfo'
import { Loading } from '@element-plus/icons-vue'
import { eventBus } from '@/utils/eventbus'

// 焊接数据
const weldingData = ref<WeldingPass>({
    cjTotal: 0,
    cjPass: 0,
    hchTotal: 0,
    hchPass: 0,
    wjTotal: 0,
    wjPass: 0
})

// Dialog控制
const dialogVisible = ref(false)
const detailData = ref<WeldingPassDetail[]>([])
const loading = ref(false)
const errorMessage = ref('')

// 计算合格率
const getQualifiedRate = (total: number, pass: number): string => {
    if (!total || total === 0) return '--'
    const rate = ((pass / total) * 100).toFixed(1)
    return `${rate}%`
}

const handleData = (value: number) => {
    if(value === 0) {
        return 0
    }
    if(value === null) {
        return '--'
    }
    return value.toFixed(0)
}

// 获取数据
const fetchData = async () => {
    try {
        const response = await getWeldingPass()
        weldingData.value = response.data
    } catch (error) {
        console.error('获取焊接数据失败:', error)
    }
}

// 获取明细数据
const fetchDetailData = async () => {
    loading.value = true
    errorMessage.value = ''
    
    try {
        console.log('开始获取明细数据...')
        const response = await getWeldingPassDetail()
        
        // 检查响应结构
        if (!response || !response.data) {

        }
        
        // 确保返回的是数组，如果不是则包装成数组
        if (Array.isArray(response.data)) {
            detailData.value = response.data

        } else {
            detailData.value = [response.data]
  
        }
        
    
        
        if (detailData.value.length === 0) {
            errorMessage.value = '暂无不合格数据'
        }
        
    } catch (error) {
        console.error('获取明细数据失败:', error)
        errorMessage.value = `数据加载失败: ${error.message || '未知错误'}`
        detailData.value = []
    } finally {
        loading.value = false
        console.log('数据加载完成，loading状态:', loading.value)
    }
}

// 打开明细Dialog - 优化：先显示Dialog再加载数据
const openDetailDialog = () => {
    console.log('打开Dialog，当前状态:', dialogVisible.value)
    dialogVisible.value = true
    console.log('Dialog已打开，开始加载数据...')
    // Dialog显示后再加载数据，避免等待时间
    fetchDetailData()
}

// 关闭Dialog
const handleClose = () => {
    console.log('关闭Dialog')
    dialogVisible.value = false
    // 清空数据，避免下次打开时显示旧数据
    detailData.value = []
    errorMessage.value = ''
}

onMounted(() => {
    eventBus.on('refreshData', fetchData)
    fetchData()
})
onBeforeUnmount(() => {
    eventBus.off('refreshData', fetchData)
})
</script>

<style scoped>
.yield-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: 2px solid #32cd32;
    cursor: pointer;
    transition: all 0.3s ease;
}

.yield-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(50, 205, 50, 0.3);
}

.yield-title {
    background: linear-gradient(135deg, #32cd32, #228b22);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.yield-title h3 {
    margin: 0;
    color: white;
    flex: 1;
    text-align: center;
}

.click-note {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    font-style: italic;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    border: 1px dashed rgba(255, 255, 255, 0.5);
    position: absolute;
    right: 12px;
    white-space: nowrap;
}

.yield-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.part-section {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    padding: 8px;
    border: 1px solid #32cd32;
}

.part-header {
    font-size: 14px;
    font-weight: 600;
    color: #32cd32;
    margin-bottom: 8px;
    text-align: center;
    background: rgba(50, 205, 50, 0.1);
    padding: 4px;
    border-radius: 4px;
}

.metrics-line {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    padding: 6px 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    border: 1px solid rgba(50, 205, 50, 0.3);
    width: 90%;
}

.metric {
    font-size: 12px;
    color: #e0e0e0;
    font-weight: 500;
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

.detail-grid-container {
    display: grid;
    grid-template-rows: repeat(auto-fit, minmax(32px, 1fr));
    gap: 2px;
    padding: 4px;
    min-height: 40px;
    align-items: center;
    justify-items: center;
}

.detail-grid-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 32px;
    padding: 4px 8px;
    border-bottom: 1px solid #f0f0f0;
    background: rgba(248, 250, 252, 0.5);
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.detail-grid-item:last-child {
    border-bottom: none;
}

.detail-grid-item:hover {
    background: rgba(248, 250, 252, 0.8);
}

.detail-grid-text {
    display: block;
    text-align: center;
    word-break: break-all;
    line-height: 1.2;
    font-size: 13px;
    color: #333;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.no-data {
    display: inline-block;
    text-align: center;
    color: #909399;
    font-style: italic;
}

.dialog-footer {
    text-align: right;
}

.debug-info {
    margin-top: 20px;
    padding: 15px;
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    color: #606266;
}

.debug-info p {
    margin: 5px 0;
    font-size: 14px;
}

.debug-info .el-button {
    margin-top: 10px;
}
</style> 