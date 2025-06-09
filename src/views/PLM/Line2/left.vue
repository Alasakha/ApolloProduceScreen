<template>
   <div class="w-[70%] h-[35vh]">
        <dv-border-box12>
            <div class="title">项目逾期任务看板</div>
            <div class="content-wrapper">
                <ScrollBoard
                    :config="scrollConfig"
                    @click="handleClick"
                />
            </div>
        </dv-border-box12>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getProjectOverdueInfo } from '@/api/getPMLinfo'

const overdueList = ref([])

// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr).toLocaleDateString()
}

// 配置轮播表格
const scrollConfig = computed(() => {
    const defaultRow = ['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
    return {
        header: ['项目编号', '项目名称', '任务名称', '计划完成时间', '变更完成时间'],
        data: overdueList.value.length > 0 
            ? overdueList.value.map(item => [
                item.pno,
                item.projName,
                item.taskName,
                formatDate(item.expectTime),
                formatDate(item.changeTime) || '--'
            ])
            : [defaultRow],
        index: true,  // 显示序号列
        indexHeader: '序号',
        columnWidth: [50],  // 列宽
        align: ['center'],  // 对齐方式
        rowNum: 5,  // 显示行数
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
.title {
    font-size: 1.6rem;
    color: #00eaff;
    text-align: center;
    padding: 0.5rem 0;
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
</style>
