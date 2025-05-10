<template>
  <el-table
    :data="tableData"
    border
    class="custom-table"
    style="width: 100%"
    :header-cell-style="tableHeaderStyle"
  >
    <el-table-column prop="name" label="加工品号" />
    <!-- <el-table-column prop="ref" label="参考值" /> -->
    <el-table-column prop="real" label="实际值" />
  </el-table>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  }
});

const tableHeaderStyle = {
  background: 'linear-gradient(to right, #611ed1, #0e5fff)',
  color: '#b8e6fe',
  fontSize: '14px',
  textAlign: 'center',
};
</script>

<style scoped>
.el-table {
  --el-table-row-hover-bg-color: rgba(14, 95, 255, 0.5);
  background-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-border: 1px solid rgb(83, 234, 253);
  color: white;
  --el-table-border-color: rgb(83, 234, 253);
}

.el-table th {
  font-weight: 600;
}

.el-table td {
  font-weight: 400;
}
</style>