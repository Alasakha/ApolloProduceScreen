<template>
   <div class="w-[70%] h-[35vh]">
        <dv-border-box12>
            <div class="title-section">
                <div class="title">项目逾期任务看板</div>
                <button class="detail-btn" @click="showDetail = true">详细</button>
            </div>
            <div class="content-wrapper">
                <ScrollBoard
                    :config="scrollConfig"
                    @click="handleClick"
                />
            </div>
        </dv-border-box12>
        
        <!-- 详细内容弹窗 -->
        <div v-if="showDetail" class="detail-modal" @click="showDetail = false">
            <div class="detail-content" @click.stop>
                <div class="detail-header">
                    <h3>项目逾期任务详细信息</h3>
                    <button class="close-btn" @click="showDetail = false">×</button>
                </div>
                <div class="detail-body">
                    <div v-if="overdueList.length === 0" class="no-data">
                        暂无逾期任务数据
                    </div>
                    <div v-else class="table-container">
                        <table class="detail-table">
                            <thead>
                                <tr>
                                    <th>任务名称</th>
                                    <th>项目编号</th>
                                    <th>项目名称</th>
                                    <th>状态</th>
                                    <th>计划完成时间</th>
                                    <th>变更完成时间</th>
                                    <th>实际完成时间</th>
                                    <th>责任人</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in overdueList" :key="index" class="table-row">
                                    <td class="task-name">{{ item.taskName }}</td>
                                    <td>{{ item.pno }}</td>
                                    <td>{{ item.projName }}</td>
                                    <td>
                                        <span class="status-badge" :class="getStatusClass(item.sts)">
                                            {{ item.sts }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(item.expectTime) }}</td>
                                    <td>{{ formatDate(item.changeTime) || '--' }}</td>
                                    <td>{{ formatDate(item.completeTime) || '--' }}</td>
                                    <td>{{ item.executant }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getProjectOverdueInfo } from '@/api/getPMLinfo'

const overdueList = ref([])
const showDetail = ref(false)

// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr).toLocaleDateString()
}

// 配置轮播表格
const scrollConfig = computed(() => {
    const defaultRow = ['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据','暂无数据']
    return {
        header: ['项目编号', '项目名称', '任务名称', '计划完成时间', '变更完成时间','实际完成时间','完成状态','责任人'],
        data: overdueList.value.length > 0 
            ? overdueList.value.map(item => [
                item.pno,
                item.projName,
                item.taskName,
                formatDate(item.expectTime),
                formatDate(item.changeTime) || '--',
                formatDate(item.completeTime) || '--',
                item.sts,
                item.executant
            ])
            : [defaultRow],
        index: true,  // 显示序号列
        indexHeader: '序号',
        columnWidth: [50],  // 列宽
        align: ['center'],  // 对齐方式
        rowNum: 7,  // 显示行数
        headerBGC: '#0f2749',  // 表头背景色
        oddRowBGC: '#003666',  // 奇数行背景色
        evenRowBGC: '#0a1f3d',  // 偶数行背景色
        waitTime: 2000,  // 轮播时间间隔
        headerHeight: 35,  // 表头高度
        columnHeight: 35,  // 行高
        hoverPause: true,  // 鼠标悬停暂停轮播
        headerFontSize: 14,  // 表头字体大小
        bodyFontSize: 14    // 内容字体大小
    }
})

// 点击事件处理
const handleClick = ({ row, ceil, rowIndex, columnIndex }) => {
    console.log('点击了:', overdueList.value[rowIndex])
}

// 获取状态样式类
const getStatusClass = (status) => {
    switch (status) {
        case '已完成':
            return 'status-completed'
        case '进行中':
            return 'status-progress'
        case '逾期':
            return 'status-overdue'
        default:
            return 'status-default'
    }
}

// 获取数据
const fetchData = async () => {
    try {
        const res = await getProjectOverdueInfo()
        if (res.code === 200 && Array.isArray(res.data)) {
            overdueList.value = res.data
        }
    } catch (error) {
        console.error('获取逾期任务数据失败:', error)
    }
}

// 定时刷新数据
let timer
onMounted(() => {
    fetchData()
    // 每5分钟刷新一次数据
    timer = setInterval(fetchData, 5 * 60 * 1000)
})

onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer)
    }
})
</script>

<style scoped>
.title-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
}

.title {
    font-size: 1.6rem;
    color: #00eaff;
    text-align: center;
    flex: 1;
}

.detail-btn {
    background: linear-gradient(135deg, #00eaff, #0099cc);
    color: #000;
    border: none;
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 234, 255, 0.3);
}

.detail-btn:hover {
    background: linear-gradient(135deg, #0099cc, #00eaff);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 234, 255, 0.4);
}

.content-wrapper {
    height: calc(100% - 3rem);
    padding: 0.5rem;
}

:deep(.ScrollBoard) {
    width: 100%;
    height: 100%;
}

:deep(.ScrollBoard .header) {
    color: #00eaff !important;
    font-weight: bold;
}

:deep(.ScrollBoard .rows .ceil) {
    color: #fff !important;
    transition: all 0.3s;
}

:deep(.ScrollBoard .rows:hover .ceil) {
    background-color: rgba(0, 234, 255, 0.1) !important;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(0, 32, 64, 0.3);
}

::-webkit-scrollbar-thumb {
    background: #00eaff;
    border-radius: 3px;
}

/* 详细弹窗样式 */
.detail-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}

.detail-content {
    background: linear-gradient(135deg, #0a1f3d, #003666);
    border: 2px solid #00eaff;
    border-radius: 12px;
    width: 80%;
    max-width: 1000px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 234, 255, 0.3);
}

.detail-header {
    background: linear-gradient(90deg, #00eaff, #0099cc);
    color: #000;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
}

.detail-header h3 {
    margin: 0;
    font-size: 1.2rem;
}

.close-btn {
    background: none;
    border: none;
    color: #000;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
}

.detail-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
}

.no-data {
    text-align: center;
    color: #fff;
    font-size: 1.1rem;
    padding: 2rem;
}

/* 表格样式 */
.table-container {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid rgba(0, 234, 255, 0.3);
}

.detail-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(0, 234, 255, 0.02);
    font-size: 0.9rem;
}

.detail-table thead {
    background: linear-gradient(90deg, #00eaff, #0099cc);
    color: #000;
}

.detail-table th {
    padding: 1rem 0.8rem;
    text-align: left;
    font-weight: bold;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    white-space: nowrap;
}

.detail-table th:last-child {
    border-right: none;
}

.detail-table tbody tr {
    border-bottom: 1px solid rgba(0, 234, 255, 0.2);
    transition: all 0.3s ease;
}

.detail-table tbody tr:hover {
    background: rgba(0, 234, 255, 0.1);
    transform: scale(1.01);
    box-shadow: 0 2px 8px rgba(0, 234, 255, 0.2);
}

.detail-table td {
    padding: 0.8rem;
    color: #fff;
    border-right: 1px solid rgba(0, 234, 255, 0.1);
    vertical-align: middle;
}

.detail-table td:last-child {
    border-right: none;
}

.task-name {
    color: #00eaff;
    font-weight: bold;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status-badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    text-align: center;
    min-width: 60px;
}

.status-completed {
    background: #4caf50;
    color: #fff;
}

.status-progress {
    background: #ff9800;
    color: #fff;
}

.status-overdue {
    background: #f44336;
    color: #fff;
}

.status-default {
    background: #666;
    color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .detail-content {
        width: 95%;
        margin: 1rem;
    }
    
    .detail-table {
        font-size: 0.8rem;
    }
    
    .detail-table th,
    .detail-table td {
        padding: 0.6rem 0.4rem;
    }
    
    .task-name {
        max-width: 120px;
    }
    
    .status-badge {
        font-size: 0.7rem;
        padding: 0.1rem 0.4rem;
        min-width: 50px;
    }
}

@media (max-width: 480px) {
    .detail-table {
        font-size: 0.7rem;
    }
    
    .detail-table th,
    .detail-table td {
        padding: 0.4rem 0.2rem;
    }
    
    .task-name {
        max-width: 80px;
    }
}
</style>
