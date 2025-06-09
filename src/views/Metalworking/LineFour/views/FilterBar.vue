<template>
    <div class="flex gap-2 items-center mb-2">
      <el-select v-model="localFilter.caigou" placeholder="采购员" clearable style="width:120px">
        <el-option v-for="item in caigouList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="localFilter.cangguan" placeholder="仓管员" clearable style="width:120px">
        <el-option v-for="item in cangguanList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="localFilter.jianyan" placeholder="检验员" clearable style="width:120px">
        <el-option v-for="item in jianyanList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button type="primary" size="small" @click="emitFilter">筛选</el-button>
      <el-button size="small" @click="resetFilter">重置</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue'
  const props = defineProps({
    caigouList: Array,
    cangguanList: Array,
    jianyanList: Array,
    filter: Object
  })
  const emit = defineEmits(['update:filter'])
  
  const localFilter = ref({ ...props.filter })
  
  watch(() => props.filter, (val) => {
    Object.assign(localFilter.value, val)
  })
  
  function emitFilter() {
    emit('update:filter', { ...localFilter.value })
  }
  function resetFilter() {
    localFilter.value = { caigou: '', cangguan: '', jianyan: '' }
    emitFilter()
  }
  </script>