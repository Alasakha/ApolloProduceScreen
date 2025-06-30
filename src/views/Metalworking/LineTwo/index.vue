<template>
    <div class="metalworking h-[27vh] p-4 flex gap-2">
        <div class="h-full w-full" >
          <div class="content w-full h-full flex">
            <Charts2 />
            <Charts />
  
          </div>
        </div>

        <dv-border-box-8 class="h-full" :dur="12">
          <div class="content w-full h-full">
              <div class="title text-white text-2xl bold h-[10%] w-full flex justify-between items-center ">
                <div class="ml-4"><span>入库信息</span> <span class="text-sm text-gray-100 mr-3">Inventory information </span></div>
                <el-button type="primary" size="small" @click="dialogVisible = true">查看详细</el-button>
              </div>
              <div class="h-[90%] w-full relative">
                <Scroll_Board />
              </div>
              <DialogDetail v-model:visible="dialogVisible" :table-data="dialogTableData"
               :headers="dialogheaders" :column-width="columnWidth" />
          </div>
        </dv-border-box-8>
    </div>
</template>

<script setup>
import Charts from './views/charts/charts.vue'
import { ref, computed } from 'vue';
import DataCard from '@/components/DataCard.vue';
import Scroll_Board from './views/scrollboard.vue'
import DialogDetail from './views/dialog-detail.vue'
import { useScrollBoardData } from './views/scrollboardDataHook'
import Charts2 from './views/charts/charts2.vue'

const dialogVisible = ref(false)
// 获取表格数据和表头
const { tableData, headers, columnWidth, dialogTableData, dialogheaders } = useScrollBoardData()
</script>

<style scoped>
.content {
    /* Add your styles here */
    /* background-color: #15A3EF80; */
    border-radius: 12px;
}
.title{
  background-color: #1c4f8d;
  margin-left: 2px;
  margin-right: 2px;
}
</style>