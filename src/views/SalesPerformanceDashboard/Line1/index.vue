<template>
  <div class="flex">
    <!-- 左侧表格 -->
    <div class="w-1/2">
      <LeftContent @data-updated="updateTableData" />
    </div>
    <!-- 右侧图表 -->
    <div class="w-1/2">
      <RightContent :tableData="tableData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftContent from './leftcontent.vue'
import RightContent from './rightcontent.vue'
import { ref } from 'vue'

const tableData = ref([])

const updateTableData = (data) => {
  tableData.value = data
}
</script>