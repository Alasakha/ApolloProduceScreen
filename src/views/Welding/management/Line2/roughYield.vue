<template>
    <div class="yield-container" @click="openDetailDialog">
        <div class="yield-title">
            <h3 class="3xl:text-sm">毛坯直通率</h3>
            <!-- <span class="click-note">(点击进入可以查看和编辑不合格问题明细)</span> -->
        </div>
        <div class="yield-content">
            <!-- 指标标签行 -->
            <div class="metrics-labels">
                <span class="metric-label">今日检验数</span>
                <span class="metric-label">一次合格数</span>
                <span class="metric-label">直通率</span>
                <span class="metric-label">合格数</span>
                <span class="metric-label">合格率</span>
            </div>
            
            <div class="part-section">
                <div class="part-header">车架</div>
                <div class="metrics-line">
                    <span class="metric-item">
                        <span class="metric-label-inline">今日检验数</span>
                        <span class="metric-value">{{ weldingData.cjTotal }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">一次合格数</span>
                        <span class="metric-value">{{ weldingData.cjPass }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">直通率</span>
                        <span class="metric-value">{{ weldingData.cjTotal ? (weldingData.cjPass / weldingData.cjTotal * 100).toFixed(1) + '%' : '--' }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格数</span>
                        <span class="metric-value">{{ handleData(weldingData.cjPass) }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格率</span>
                        <span class="metric-value">{{ getQualifiedRate(weldingData.cjTotal, weldingData.cjPass) }}</span>
                    </span>
                </div>
            </div>
            
            <div class="part-section">
                <div class="part-header">后叉</div>
                <div class="metrics-line">
                    <span class="metric-item">
                        <span class="metric-label-inline">今日检验数</span>
                        <span class="metric-value">{{ handleData(weldingData.hchTotal) }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">一次合格数</span>
                        <span class="metric-value">{{ weldingData.hchPass }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">直通率</span>
                        <span class="metric-value">{{ weldingData.hchTotal ? (weldingData.hchPass / weldingData.hchTotal * 100).toFixed(1) + '%' : '--' }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格数</span>
                        <span class="metric-value">{{ handleData(weldingData.hchPass) }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格率</span>
                        <span class="metric-value">{{ getQualifiedRate(weldingData.hchTotal, weldingData.hchPass) }}</span>
                    </span>
                </div>
            </div>
            
            <div class="part-section">
                <div class="part-header">尾架</div>
                <div class="metrics-line">
                    <span class="metric-item">
                        <span class="metric-label-inline">今日检验数</span>
                        <span class="metric-value">{{ handleData(weldingData.wjTotal) }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">一次合格数</span>
                        <span class="metric-value">{{ weldingData.wjPass }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">直通率</span>
                        <span class="metric-value">{{ weldingData.wjTotal ? (weldingData.wjPass / weldingData.wjTotal * 100).toFixed(1) + '%' : '--' }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格数</span>
                        <span class="metric-value">{{ handleData(weldingData.wjPass) }}</span>
                    </span>
                    <span class="metric-item">
                        <span class="metric-label-inline">合格率</span>
                        <span class="metric-value">{{ getQualifiedRate(weldingData.wjTotal, weldingData.wjPass) }}</span>
                    </span>
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
    padding: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.yield-container:hover {
    box-shadow: 0 0 15px rgba(39, 159, 39, 0.3);
}

.yield-title {
    background: #279f27;
    padding: 8px 12px;
    border-radius: 0;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.yield-title h3 {
    margin: 0;
    color: white;
    flex: 1;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
}

/* 1080p (1920px) */
@media (min-width: 1920px) {
    .yield-title {
        padding: 10px 14px;
    }
    
    .yield-title h3 {
        font-size: 16px;
    }
    
    .yield-content {
        padding: 10px;
        gap: 10px;
    }
    
    .part-section {
        padding: 10px;
        gap: 18px;
    }
    
    .part-header {
        font-size: 16px;
    }
    
    .metrics-line {
        gap: 18px;
    }
    
    .metric-item {
        gap: 6px;
    }
    
    .metric-label-inline,
    .metric-value {
        font-size: 14px;
    }
}

/* 2K (2560px) */
@media (min-width: 2060px) {
    .yield-title {
        padding: 12px 16px;
    }
    
    .yield-title h3 {
        font-size: 16px;
    }
    
    .yield-content {
        padding: 12px;
        gap: 12px;
    }
    
    .part-section {
        padding: 12px;
        gap: 20px;
    }
    
    .part-header {
        font-size: 28px;
    }
    
    .metrics-line {
        gap: 20px;
    }
    
    .metric-item {
        gap: 8px;
    }
    
    .metric-label-inline,
    .metric-value {
        font-size: 26px;
    }
}

/* 4K (3840px) */
@media (min-width: 3800px) {
    .yield-title {
        padding: 16px 20px;
    }
    
    .yield-title h3 {
        font-size: 24px;
    }
    
    .yield-content {
        padding: 16px;
        gap: 16px;
    }
    
    .part-section {
        padding: 16px;
        gap: 24px;
    }
    
    .part-header {
        font-size: 29px;
    }
    
    .metrics-line {
        gap: 24px;
    }
    
    .metric-item {
        gap: 10px;
    }
    
    .metric-label-inline,
    .metric-value {
        font-size: 25px;
    }
}

.click-note {
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
    padding: 8px;
    background: rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.metrics-labels {
    display: none;
}

.metric-label {
    font-size: 11px;
    color: white;
    font-weight: 600;
    text-align: center;
}

.part-section {
    background: transparent;
    border-radius: 0;
    padding: 8px;
    border: 1px solid #279f27;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-height: 0;
}

.part-header {
    /* font-size: 14px; */
    font-weight: 600;
    color: #279f27;
    margin-bottom: 0;
    text-align: left;
    background: transparent;
    padding: 0;
    border-radius: 0;
    white-space: nowrap;
    flex-shrink: 0;
}

.metrics-line {
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    padding: 0;
    background: transparent;
    border-radius: 0;
    border: none;
    flex: 1;
    align-items: center;
}

.metric-item {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;
    justify-content: center;
}

.metric-label-inline {
    /* font-size: 12px; */
    color: white;
    font-weight: 500;
}

.metric-value {
    /* font-size: 12px; */
    color: white;
    /* font-weight: 500; */
}

</style> 