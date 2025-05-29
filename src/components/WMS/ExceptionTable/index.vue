<template>
    <div class="area">
      <div class="title-container">
        <div class="title">{{ title }}</div>
        <div class="btn-group">
          <el-button 
            type="primary" 
            size="small" 
            @click="handleDetail"
            class="action-btn mr-2"
          >
            查看详情
          </el-button>
          <el-button 
            type="success" 
            size="small" 
            @click="handleExport"
            class="action-btn"
            :disabled="loading"
          >
            导出Excel
          </el-button>
        </div>
      </div>
      <div class="table-area">
        <ScrollBoard v-if="!loading" :config="config" />
        <div v-else class="loading">正在加载......</div>
      </div>
    </div>
  
    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="80%"
      :destroy-on-close="true"
    >
      <div class="detail-table">
        <div class="dialog-toolbar">
          <el-button 
            type="success" 
            size="small" 
            @click="handleExport"
            :disabled="loading"
          >
            导出Excel
          </el-button>
        </div>
        <el-table 
          v-loading="tableLoading"
          :data="paginatedData" 
          border 
          style="width: 100%"
        >
          <el-table-column 
            v-for="header in config.header" 
            :key="header" 
            :prop="header" 
            :label="header" 
          />
        </el-table>
        
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { PropType } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import * as XLSX from 'xlsx'
  
  interface TableConfig {
    header: string[];
    data: any[][];
    index: boolean;
    columnWidth: number[];
    align: string[];
    rowNum: number;
    headerHeight: number;
    headerBGC: string;
    oddRowBGC: string;
    evenRowBGC: string;
    waitTime: number;
    carousel: string;
    showTooltip: boolean;
  }
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    config: {
      type: Object as PropType<TableConfig>,
      required: true
    },
    exportFileName: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['refresh'])
  
  // 状态管理
  const dialogVisible = ref(false)
  const tableLoading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const detailData = ref([])
  
  // 分页数据处理
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return detailData.value.slice(start, end)
  })
  
  // 处理分页
  const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
  }
  
  const handleCurrentChange = (val: number) => {
    currentPage.value = val
  }
  
  // 详情处理
  const handleDetail = () => {
    if (props.loading) {
      ElMessage.warning('数据加载中，请稍后再试')
      return
    }
    
    tableLoading.value = true
    try {
      detailData.value = props.config.data.map((row: any[]) => {
        const obj: any = {}
        props.config.header.forEach((header: string, index: number) => {
          obj[header] = row[index]
        })
        return obj
      })
      total.value = detailData.value.length
    } finally {
      tableLoading.value = false
      dialogVisible.value = true
    }
  }
  
  // 导出处理
  const handleExport = async () => {
    try {
      await ElMessageBox.confirm(
        `确认要导出${props.title}数据吗？`,
        '导出确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info'
        }
      )
      exportToExcel()
    } catch {
      // 用户取消导出，不做任何处理
    }
  }
  
  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new()
      const excelData = [
        props.config.header,
        ...props.config.data
      ]
      const ws = XLSX.utils.aoa_to_sheet(excelData)
      const colWidths = props.config.header.map(() => ({ wch: 15 }))
      ws['!cols'] = colWidths
      
      XLSX.utils.book_append_sheet(wb, ws, props.exportFileName)
      const fileName = `${props.exportFileName}_${new Date().toLocaleDateString()}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      ElMessage.success('导出成功！')
    } catch (error) {
      console.error('导出失败：', error)
      ElMessage.error('导出失败，请重试！')
    }
  }
  </script>
  
  <style scoped>
  .area {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  
  .title-container {
    flex: 0 0 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .title {
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    line-height: 35px;
  }
  
  .btn-group {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    gap: 8px;
  }
  
  .table-area {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }
  
  .detail-table {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .dialog-toolbar {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .action-btn {
    position: static;
    transform: none;
  }
  
  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding: 10px;
  }
  
  :deep(.ScrollBoard) {
    height: 100% !important;
    width: 100% !important;
    box-sizing: border-box;
  }
  
  :deep(.el-table) {
    background-color: transparent;
    color: #333;
  }
  
  :deep(.el-table th) {
    background-color: #0d47a1;
    color: #fff;
  }
  
  :deep(.el-table tr) {
    background-color: #fff;
  }
  
  :deep(.el-pagination) {
    margin-right: 20px;
  }
  
  :deep(.el-loading-mask) {
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  .loading {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }
  </style>