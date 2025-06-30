<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="dialogWidth"
    class="custom-dialog"
    @update:modelValue="val => emit('update:modelValue', val)"
    @close="emit('close')"
  >
    <div class="table-wrapper">
      <el-table :data="paginatedData" height="100%" style="width: 100%">
        <el-table-column
          v-for="col in columns.slice(0, columns.length - 1)"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">填写</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 总数 & 分页 -->
      <div class="pagination-wrapper">
        <div>共 {{ tableData.length }} 条</div>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          size="small"
        />
      </div>
    </div>

    <!-- 填写弹窗 -->
    <el-dialog v-model="dialogVisible" title="填写" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="不良问题">
          <el-input v-model="form.reason" />
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="form.way" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="clearForm">清空</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>

      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getAbnormalHandleAdd } from '@/api/getQuiltyinfo'
const dialogVisible = ref(false)
const form = ref({
  reason: '',
  way: ''
})
const props = defineProps<{
  modelValue: boolean
  title: string
  width?: string
  tableData: any[]
  columns: Array<{
    prop: string
    label: string
    width?: string | number
  }>
}>()
const uid = ref('')
const emit = defineEmits(['update:modelValue', 'close', 'refresh'])

const dialogWidth = '90%'

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 计算当前页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.tableData.slice(start, start + pageSize.value)
})

// 点击填写异常按钮
const handleEdit = (row) => {
  console.log(row)
  dialogVisible.value = true
  form.value.reason = row.ngReason
  form.value.way = row.ngHandle
  uid.value = row.uid
}

// 点击确认上传
const handleSubmit = () => {
  getAbnormalHandleAdd(uid.value, form.value.way, form.value.reason).then(res => {
    if (res.code === 200) {
      ElMessage.success('上传成功')
      dialogVisible.value = false // 关闭填写弹窗
      emit('refresh') // 通知父组件刷新数据
    } else {
      ElMessage.error('上传失败')
    }
  })
}

// 清空表单
const clearForm = () => {
  form.value.reason = ''
  form.value.way = ''
}
</script>

<style scoped>
.custom-dialog {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  font-size: 16px; /* 默认字体大小加大 */
}

/* 可选：分页组件字体大小更大一些 */
::v-deep(.el-pagination) {
  font-size: 16px;
}
</style>

