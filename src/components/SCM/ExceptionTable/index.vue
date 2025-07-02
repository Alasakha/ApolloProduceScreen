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
      :width="dialogWidth"
      :destroy-on-close="true"
      :fullscreen="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      class="custom-dialog"
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
          height="670"
        >
          <el-table-column label="状态" width="120" fixed="left">
            <template #default="{ row }">
              <StatusCell :completeDate="row['完成期限']" />
            </template>
          </el-table-column>
          <el-table-column 
            v-for="(header, index) in config.fullHeader" 
            :key="header" 
            :prop="header" 
            :label="header" 
            :width="config.dialogWidth[index + 1]"
          />
          <el-table-column prop="source_id_roid" v-if="false" />
          <el-table-column prop="po_arrival_inspection_d_id" v-if="false" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small" 
                @click="openHandleResultDialog(row)"
              >
                修改处理结果
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 处理结果输入对话框 -->
        <el-dialog
          v-model="handleResultVisible"
          title="处理结果"
          width="30%"
          append-to-body
        >
          <el-input
            v-model="handleResult"
            type="textarea"
            :rows="4"
            placeholder="请输入处理结果"
          />
          <el-date-picker
            v-model="completeDate"
            type="date"
            placeholder="请选择完成期限"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="handleResultVisible = false">取消</el-button>
              <el-button 
                type="primary" 
                @click="handleAddResult"
              >
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
        
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
  import { getAbnormalQualityReasonAdd } from '@/api/getPmcinfo'
  import StatusCell from '@/components/SCM/DetailDialog/StatusCell.vue'
  
  interface TableConfig {
    header: string[];
    data: any[][];
    detailData?: any[][];
    rawData?: any[];
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
    fullHeader?: string[];
    dialogWidth?: number[];
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
    },
    dialogWidth: {
      type: String,
      default: '90%'
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
  const handleResult = ref('')
  const currentItemCode = ref('')
  const handleResultVisible = ref(false)
  const docNo = ref('')
  const po_arrival_inspection_d_id = ref('')
  const completeDate = ref('')
  // const route = useRoute()
  // const prodLine = computed(() => route.query.prodLine as string)

  
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
      // 使用 detailData 而不是 data
      const sourceData = props.config.detailData || props.config.data
      const headers = props.config.fullHeader || props.config.header
      detailData.value = sourceData.map((row: any[], index: number) => {
        const obj: any = {}
        // 跳过第一列，从第二列开始
        headers.forEach((header: string, idx: number) => {
          obj[header] = row[idx + 1] // 使用 idx + 1 来跳过第一列
        })
        // 使用rawData中的source_id_roid
        if (props.config.rawData && props.config.rawData[index]) {
          obj.source_id_roid = props.config.rawData[index].source_id_roid
          obj.po_arrival_inspection_d_id = props.config.rawData[index].po_arrival_inspection_d_id
        }
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
  
  // 添加处理结果
  const handleAddResult = async () => {
    if (!handleResult.value) {
      ElMessage.warning('请输入处理结果')
      return
    }
    try {
      await getAbnormalQualityReasonAdd(currentItemCode.value, handleResult.value,
       docNo.value,po_arrival_inspection_d_id.value,completeDate.value)
      ElMessage.success('操作成功')
      handleResultVisible.value = false

      // console.log('当前选中的ID:', currentItemCode.value)
      // console.log('更新前的数据:', JSON.stringify(detailData.value))
      
      // 更新当前行的处理结果
      const index = detailData.value.findIndex(item => item.source_id_roid === currentItemCode.value)
      if (index !== -1) {
        detailData.value[index]['处理结果'] = handleResult.value
        detailData.value[index]['完成期限'] = completeDate.value
        detailData.value = [...detailData.value]
      } else {
        console.error('未找到匹配的行:', currentItemCode.value)
      }
      
      // console.log('更新后的数据:', JSON.stringify(detailData.value))
      emit('refresh')
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  }
  
  // 打开处理结果输入框
  const openHandleResultDialog = (row) => {
    console.log('选中的行数据:', row)
    currentItemCode.value = row.source_id_roid
    handleResult.value = row['处理结果'] === '--' ? '' : (row['处理结果'] || '')
    docNo.value = row['到货单号'] || row['docNo'] || ''
    po_arrival_inspection_d_id.value = row.po_arrival_inspection_d_id
    completeDate.value = row['完成期限'] || ''
    handleResultVisible.value = true
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
    /* background-color: #0d47a1; */
    /* color: #fff; */
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
  
  :deep(.custom-dialog) {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 90vh;
  }
  
  :deep(.custom-dialog .el-dialog__body) {
    flex: 1;
    overflow: auto;
    padding: 20px;
  }
  
  :deep(.custom-dialog .el-dialog__header) {
    padding: 20px;
    margin: 0;
    border-bottom: 1px solid #dcdfe6;
  }
  
  :deep(.custom-dialog .el-dialog__footer) {
    padding: 20px;
    margin: 0;
    border-top: 1px solid #dcdfe6;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>