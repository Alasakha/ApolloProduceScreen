<template>
    <el-button type="primary" size="small" @click="exportExcel">
      导出Excel
    </el-button>
  </template>
  
  <script setup>
  import * as XLSX from 'xlsx'
  import { defineProps } from 'vue'
  
  const props = defineProps({
    data: { type: Array, required: true },      // 表格数据（对象数组）
    headers: { type: Array, required: true },   // 表头（字符串数组）
    filename: { type: String, default: '导出数据.xlsx' }
  })
  
  function exportExcel() {
    // 1. 组装数据
    const aoa = [props.headers, ...props.data.map(row => props.headers.map((h, idx) => row['col' + idx] ?? ''))]
    // 2. 转sheet
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    // 3. 新建workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    // 4. 导出
    XLSX.writeFile(wb, props.filename)
  }
  </script>