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
      <el-table :data="paginatedData" max-height="60vh" style="width: 100%">
        <template v-for="col in columns" :key="col.prop">
          <el-table-column
            v-if="col.prop !== 'action'"
            :prop="col.prop"
            :label="col.label"
            :width="col.width+'px'"
          />
        </template>
        <el-table-column
          v-if="columns.some(col => col.prop === 'action')"
          prop="action"
          label="操作"
          :width="120"
        >
          <template #default="{ row }">
            <el-button size="small" @click="handleFill(row)">填写</el-button>
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
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getAbnormalHandleAdd } from '@/api/getQuiltyinfo'

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

const emit = defineEmits(['update:modelValue', 'close'])

const dialogWidth = '90%'

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)

// 计算当前页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.tableData.slice(start, start + pageSize.value)
})

const handleFill = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入处理结果', '处理结果', {
      confirmButtonText: '提交',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '处理结果不能为空'
    })
    await getAbnormalHandleAdd(row.uid, value)
    ElMessage.success('提交成功')
    // 实时更新表格内容
    row.ngHandle = value
  } catch (e) {
    // 用户取消或接口异常
  }
}

console.log('columns:', props.columns)
console.log('data:', paginatedData.value)
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

