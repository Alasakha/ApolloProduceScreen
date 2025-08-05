<template>
  <div class="flex h-[22vh] 3xl:h-[22vh] 4xl:h-[22vh]">
    <div class="w-2/3">
      <LeftContent @data-updated="updateTableData" />
    </div>
    <div class="w-1/3">
      <RightContent :tableData="tableData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftContent from './leftcotent.vue'
import RightContent from './rightcontent.vue'
import { ref } from 'vue'

const tableData = ref([])

const updateTableData = (data) => {
  tableData.value = data
}
</script>
  