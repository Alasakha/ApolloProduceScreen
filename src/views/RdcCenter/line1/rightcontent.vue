<template>
  <div class="w-[70%] h-[30vh]">
       <dv-border-box12>
           <div class="title">本月研发升级计划</div>
           <div class="content-wrapper">
               <ScrollBoard
                   :config="scrollConfig"
                   @click="handleClick"
               />
               <!-- 详细按钮 -->
               <div class="detail-button-wrapper">
                   <el-button 
                       type="primary" 
                       size="small" 
                       @click="showDetail"
                       class="detail-button"
                   >
                       详细
                   </el-button>
               </div>
           </div>
       </dv-border-box12>
       
       <!-- 详细数据弹窗 -->
       <el-dialog
           v-model="detailVisible"
           title="详细数据"
           width="90%"
           :before-close="handleClose"
           @close="handleDialogClose"
       >
           <div class="detail-content">
               <!-- 筛选条件 -->
               <div class="filter-wrapper">
                   <el-select
                       v-model="filterStatus"
                       placeholder="选择完成状态"
                       clearable
                       class="filter-item"
                       @change="handleFilterChange"
                   >
                       <el-option label="按时完成" value="按时完成" />
                       <el-option label="逾期完成" value="逾期完成" />
                       <el-option label="待完成" value="待完成" />
                       <el-option label="逾期" value="逾期" />
                   </el-select>
                   <el-input
                       v-model="filterPno"
                       placeholder="输入项目编号"
                       clearable
                       class="filter-item"
                       @input="handleFilterChange"
                   />
               </div>
               
               <el-table :data="paginatedData" border style="width: 100%">
                   <el-table-column prop="pno" label="项目编号" width="120" />
                   <el-table-column prop="projName" label="项目名称" width="150" />
                   <el-table-column prop="taskName" label="任务名称" width="150" />
                   <el-table-column prop="expectTime" label="计划完成时间" width="140">
                       <template #default="scope">
                           {{ formatDate(scope.row.expectTime) }}
                       </template>
                   </el-table-column>
                   <el-table-column prop="changeTime" label="变更完成时间" width="140">
                       <template #default="scope">
                           {{ formatDate(scope.row.changeTime) || '--' }}
                       </template>
                   </el-table-column>
                   <el-table-column prop="completeTime" label="实际完成时间" width="140">
                       <template #default="scope">
                           {{ formatDate(scope.row.completeTime) || '--' }}
                       </template>
                   </el-table-column>
                   <el-table-column prop="completionStatus" label="完成状态" width="120">
                       <template #default="scope">
                           <span :class="getStatusClass(scope.row.completionStatus)">
                               {{ scope.row.completionStatus }}
                           </span>
                       </template>
                   </el-table-column>
                   <el-table-column prop="executant" label="责任人" width="100" />
               </el-table>
               
               <!-- 分页 -->
               <div class="pagination-wrapper">
                   <el-pagination
                       v-model:current-page="currentPage"
                       v-model:page-size="pageSize"
                       :page-sizes="[10, 20, 50, 100]"
                       :total="totalItems"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                   />
               </div>
           </div>
       </el-dialog>
   </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { getProjectOverdueMainInfo } from '@/api/getPMLinfo'

const overdueList = ref([])
const detailVisible = ref(false)
const detailData = ref([])
const filteredDetailData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

// 筛选条件
const filterStatus = ref('')
const filterPno = ref('')

// 筛选数据
const applyFilter = () => {
   let result = detailData.value
   
   // 按状态筛选
   if (filterStatus.value) {
       result = result.filter(item => {
           const status = getCompletionStatus(item)
           return status === filterStatus.value
       })
   }
   
   // 按项目编号筛选
   if (filterPno.value) {
       result = result.filter(item => 
           item.pno && item.pno.includes(filterPno.value)
       )
   }
   
   filteredDetailData.value = result
   totalItems.value = result.length
   currentPage.value = 1 // 重置到第一页
}

// 计算分页后的数据，包含状态判断
const paginatedData = computed(() => {
   const start = (currentPage.value - 1) * pageSize.value
   const end = start + pageSize.value
   return filteredDetailData.value.slice(start, end).map(item => ({
       ...item,
       completionStatus: getCompletionStatus(item)
   }))
})

// 格式化日期
const formatDate = (dateStr) => {
   if (!dateStr) return '--'
   return new Date(dateStr).toLocaleDateString()
}

// 判断完成状态
const getCompletionStatus = (item) => {
   const { sts, expectTime, completeTime } = item
   const now = new Date()
   const expectDate = new Date(expectTime)
   
   // 1. 先判断是否为C（完成）
   if (sts === 'C') {
       // 2. 如果是C说明完成，判断实际完成时间是否超过计划完成时间
       if (completeTime) {
           const completeDate = new Date(completeTime)
           return completeDate > expectDate ? '逾期完成' : '按时完成'
       } else {
           // 如果没有实际完成时间，按当前时间判断
           return now > expectDate ? '逾期完成' : '按时完成'
       }
   } else {
       // 3. 如果不是C说明未完成，判断是否超过计划完成时间
       return now > expectDate ? '逾期' : '待完成'
   }
}

// 获取状态样式类
const getStatusClass = (status) => {
   switch (status) {
       case '按时完成':
           return 'status-on-time'
       case '逾期完成':
           return 'status-overdue-complete'
       case '待完成':
           return 'status-pending'
       case '逾期':
           return 'status-overdue'
       default:
           return 'status-default'
   }
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
               getCompletionStatus(item),
               item.executant
           ])
           : [defaultRow],
       index: true,  // 显示序号列
       indexHeader: '序号',
        columnWidth: [60],  // 各列宽度
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

// 显示详细数据
const showDetail = () => {
   detailVisible.value = true
   detailData.value = overdueList.value
   applyFilter() // 应用筛选
}

// 筛选变化处理
const handleFilterChange = () => {
   applyFilter()
}

// 弹窗关闭时重置筛选
const handleDialogClose = () => {
   filterStatus.value = ''
   filterPno.value = ''
}

// 关闭弹窗
const handleClose = () => {
   detailVisible.value = false
}

// 分页处理
const handleSizeChange = (val) => {
   pageSize.value = val
   currentPage.value = 1
}

const handleCurrentChange = (val) => {
   currentPage.value = val
}

// 获取数据
const fetchData = async () => {
   try {
       const res = await getProjectOverdueMainInfo()
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
}

.content-wrapper {
    height: calc(100% - 2rem);
    padding: 0.5rem 0.8rem 0.8rem 0.8rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
}

/* 详细按钮样式 */
.detail-button-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}

.detail-button {
    background: linear-gradient(135deg, #00eaff, #0099cc) !important;
    border: none !important;
    color: #fff !important;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0, 234, 255, 0.3);
    transition: all 0.3s ease;
}

.detail-button:hover {
    background: linear-gradient(135deg, #0099cc, #00eaff) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 234, 255, 0.5);
}

/* 详细内容弹窗样式 */
.detail-content {
    max-height: 70vh;
    overflow-y: auto;
}

.pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

/* 表格样式优化 */
:deep(.el-table) {
    background-color: #0a1f3d;
    color: #fff;
}

:deep(.el-table th) {
    background-color: #0f2749 !important;
    color: #00eaff !important;
    border-color: #003666 !important;
}

:deep(.el-table td) {
    background-color: #0a1f3d !important;
    color: #fff !important;
    border-color: #003666 !important;
}

:deep(.el-table tr:hover td) {
    background-color: #003666 !important;
}

:deep(.el-table--border) {
    border-color: #003666 !important;
}

/* 分页样式 */
:deep(.el-pagination) {
    color: #fff;
}

:deep(.el-pagination .el-pager li) {
    background-color: #0a1f3d;
    color: #fff;
    border: 1px solid #003666;
}

:deep(.el-pagination .el-pager li:hover) {
    background-color: #003666;
    color: #00eaff;
}

:deep(.el-pagination .el-pager li.is-active) {
    background-color: #00eaff;
    color: #0a1f3d;
}

/* 弹窗样式 */
:deep(.el-dialog) {
    background-color: #0a1f3d;
    border: 1px solid #003666;
}

:deep(.el-dialog__header) {
    background-color: #0f2749;
    color: #00eaff;
    border-bottom: 1px solid #003666;
}

:deep(.el-dialog__title) {
    color: #00eaff;
}

:deep(.el-dialog__close) {
    color: #00eaff;
}

:deep(.el-dialog__body) {
    background-color: #0a1f3d;
    color: #fff;
}

/* 状态样式 */
.status-on-time {
    color: #4caf50;
    font-weight: bold;
    background: rgba(76, 175, 80, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #4caf50;
}

.status-overdue-complete {
    color: #ff9800;
    font-weight: bold;
    background: rgba(255, 152, 0, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #ff9800;
}

.status-pending {
    color: #2196f3;
    font-weight: bold;
    background: rgba(33, 150, 243, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #2196f3;
}

.status-overdue {
    color: #f44336;
    font-weight: bold;
    background: rgba(244, 67, 54, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #f44336;
}

.status-default {
    color: #9e9e9e;
    font-weight: bold;
    background: rgba(158, 158, 158, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #9e9e9e;
}

/* 筛选区域样式 */
.filter-wrapper {
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
    align-items: center;
}

.filter-item {
    flex: 1;
    max-width: 300px;
}

:deep(.filter-item .el-input__wrapper) {
    background-color: #0f2749;
    border-color: #003666;
}

:deep(.filter-item .el-input__wrapper:hover) {
    border-color: #00eaff;
}

:deep(.filter-item .el-input__inner) {
    color: #fff;
}

:deep(.filter-item .el-select__wrapper) {
    background-color: #0f2749;
    border-color: #003666;
}

:deep(.filter-item .el-select__wrapper:hover) {
    border-color: #00eaff;
}

:deep(.filter-item .el-select__placeholder) {
    color: #8c8c8c;
}





</style>