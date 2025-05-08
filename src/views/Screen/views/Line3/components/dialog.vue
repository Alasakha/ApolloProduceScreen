<!-- src/components/TableDialog.vue -->
<template>
    <el-dialog
      :model-value="modelValue"
      :title="title"
      :width="width"
      @update:modelValue="val => emit('update:modelValue', val)"
      @close="emit('close')"
    >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        />
      </el-table>
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
  </script>