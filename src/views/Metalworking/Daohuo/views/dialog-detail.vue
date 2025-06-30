<template>
  <el-dialog :model-value="visible" @update:model-value="$emit('update:visible', $event)" title="详细信息" width="80vw" :modal="true" :close-on-click-modal="false" :style="{ maxHeight: '80vh' }">
    <div class="flex justify-end mb-2">
      <ExportExcel :data="filteredData" :headers="headers" filename="明细导出.xlsx" />
    </div>
    <FilterBar
      :caigou-list="caigouList"
      :cangguan-list="cangguanList"
      :jianyan-list="jianyanList"
      :filter="filter"
      @update:filter="val => filter = val"
    />
    <div style="max-height:60vh;overflow:auto;">
      <el-table :data="pagedData" border style="width: 100%">
        <el-table-column v-for="(col, idx) in headers" :key="col" 
        :label="col" :prop="'col' + idx" :width="columnWidth?.[idx] || undefined" />
      </el-table>
    </div>
    <div class="flex justify-center mt-4">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredData.length"
        :page-size="pageSize"
        :page-sizes="[10, 50, 100]"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        small
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import FilterBar from './FilterBar.vue'
import ExportExcel from '@/components/ExportExcel.vue'

const props = defineProps({
  visible: Boolean,
  tableData: Array,
  headers: Array,
  columnWidth: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:visible'])

const filter = ref({ caigou: '', cangguan: '', jianyan: '' })

// 提取唯一选项
const caigouList = computed(() => [...new Set(props.tableData.map(i => i.col0).filter(Boolean))])
const cangguanList = computed(() => [...new Set(props.tableData.map(i => i.col1).filter(Boolean))])
const jianyanList = computed(() => [...new Set(props.tableData.map(i => i.col2).filter(Boolean))])

// 筛选后的数据
const filteredData = computed(() =>
  props.tableData.filter(row =>
    (!filter.value.caigou || row.col0 === filter.value.caigou) &&
    (!filter.value.cangguan || row.col1 === filter.value.cangguan) &&
    (!filter.value.jianyan || row.col2 === filter.value.jianyan)
  )
)

// 分页
const pageSize = ref(10)
const currentPage = ref(1)
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

// 筛选时重置分页
watch(filter, () => { currentPage.value = 1 }, { deep: true })
</script> 