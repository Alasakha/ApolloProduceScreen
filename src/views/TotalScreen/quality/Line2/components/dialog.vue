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
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
defineProps<{
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

// 设置大屏下更宽的默认宽度
const dialogWidth = '90%'
</script>

<style scoped>
.custom-dialog {
  /* 让对话框高度尽量占满大屏 */
  max-height: 90vh;
  display: flex;
  flex-direction: column;

}

/* 包裹表格容器，使其撑满对话框剩余空间 */
/* .table-wrapper {
  flex: 1;
  overflow: auto;
  max-height: 70vh; /* 避免对话框溢出屏幕 */
/* } */ 

/* .custom-dialog { */
    /*scoped 模式下  background-color 不生效 直接写到style*/
    /* color: white;
    background-color: rgb(26, 57, 116) !important;
    border-radius: 10px;
    
} */


</style>
