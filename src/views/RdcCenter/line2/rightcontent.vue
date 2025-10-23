


<template>
  <div class="w-[70%] h-[30vh]">
       <dv-border-box12>
           <div class="title">暂无异常的详细数据</div>
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
       
       <!-- 详细内容弹窗 -->
       <el-dialog
           v-model="detailVisible"
           title="详细数据"
           width="80%"
           :before-close="handleClose"
       >
           <div class="detail-content">
               <el-table :data="detailData" border style="width: 100%">
                   <el-table-column prop="id" label="ID" width="80" />
                   <el-table-column prop="计划编号" label="计划编号" width="120" />
                   <el-table-column prop="行动举措" label="行动举措" width="150" />
                   <el-table-column prop="成果要求" label="成果要求" width="150" />
                   <el-table-column prop="状态描述" label="状态" width="100" />
                   <el-table-column prop="负责人名称" label="负责人" width="100" />
                   <el-table-column prop="所属部门" label="所属部门" width="120" />
                   <el-table-column prop="计划完成时间" label="计划完成时间" width="140">
                       <template #default="{ row }">
                           {{ formatDate(row.计划完成时间) }}
                       </template>
                   </el-table-column>
                   <el-table-column prop="实际完成时间" label="实际完成时间" width="140">
                       <template #default="{ row }">
                           {{ formatDate(row.实际完成时间) }}
                       </template>
                   </el-table-column>
                   <el-table-column prop="重要紧急等级" label="重要紧急等级" width="120" />
                   <el-table-column prop="建立时间" label="建立时间" width="140">
                       <template #default="{ row }">
                           {{ formatDate(row.建立时间) }}
                       </template>
                   </el-table-column>
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
import { getPlan4n } from '@/api/getQuiltyinfo'

const overdueList = ref([])
const detailVisible = ref(false)
const detailData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)


// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    const trimmedDate = dateStr.trim()
    if (!trimmedDate) return '--'
    
    try {
        // 处理 YYYYMMDD 格式（如：20251015）
        if (/^\d{8}$/.test(trimmedDate)) {
            const year = trimmedDate.substring(0, 4)
            const month = trimmedDate.substring(4, 6)
            const day = trimmedDate.substring(6, 8)
            const date = new Date(year, month - 1, day) // month 需要减1，因为月份从0开始
            return date.toLocaleDateString()
        }
        
        // 处理其他常见格式
        const date = new Date(trimmedDate)
        if (isNaN(date.getTime())) {
            return '--'
        }
        
        return date.toLocaleDateString()
    } catch (error) {
        console.error('日期解析错误:', error, '原始值:', trimmedDate)
        return '--'
    }
}

// 配置轮播表格
const scrollConfig = computed(() => {
   const defaultRow = ['暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据', '暂无数据']
   return {
       header: ['ID', '计划编号', '行动举措', '成果要求', '状态描述', '负责人名称', '所属部门', '计划完成时间', '实际完成时间', '重要紧急等级', '建立时间'],
       data: overdueList.value.length > 0 
           ? overdueList.value.map(item => [
               item.id?.trim() || '--',
               item.计划编号?.trim() || '--',
               item.行动举措?.trim() || '--',
               item.成果要求?.trim() || '--',
               item.状态描述?.trim() || '--',
               item.负责人名称?.trim() || '--',
               item.所属部门?.trim() || '--',
               formatDate(item.计划完成时间),
               formatDate(item.实际完成时间) || '--',
               item.重要紧急等级?.trim() || '--',
               formatDate(item.建立时间)
           ])
           : [defaultRow],
       index: true,  // 显示序号列
       indexHeader: '序号',
       columnWidth: [60,80],  // 各列宽度
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
   totalItems.value = overdueList.value.length
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
       const res = await getPlan4n(undefined, '转产计划')
       if (res.code === 200 && Array.isArray(res.data)) {
           overdueList.value = res.data
       }
   } catch (error) {
       console.error('获取转产计划数据失败:', error)
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





</style>
