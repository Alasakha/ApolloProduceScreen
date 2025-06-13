<!-- <template>
   <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
       <div class="table_container" style="flex: 1; position: relative;">
<el-table
    v-if="size >= 1.5"
  :data="tableData"
  border
  style="position: absolute; height: 100%; width: 100%; overflow-y: auto;"
  :row-style="rowStyle"
  :cell-style="tableCellStyle"
  :header-cell-style="tableHeaderStyle"
  height="100%"
>

    <el-table-column :label="tableTitle">
      <el-table-column :prop="'name'" :label="productLabel" />

      <el-table-column prop="real" label="实际值" />
    </el-table-column>
  </el-table>
  </div>
  </div>
</template> -->
<!-- 
<script setup>
import { defineProps,ref } from 'vue';
const size =  ref( window.devicePixelRatio)

console.log('当前设备像素比:', size.value);



const tableHeaderStyle = {
  background: 'linear-gradient(to right, #611ed1, #0e5fff)',
  color: '#b8e6fe',
  fontSize: '0.5vw',
  textAlign: 'center',
};

const tableCellStyle = {
  fontSize: `${16 / window.devicePixelRatio}px`,
  textAlign: 'center'
};

</script> -->
<!-- 
<style scoped>
.el-table {
  --el-table-row-hover-bg-color: rgba(14, 95, 255, 0.5);
  background-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-border: 1px solid rgb(83, 234, 253);
  color: white;
  --el-table-border-color: rgb(83, 234, 253);
}

:deep(.el-table th),
:deep(.el-table td) {
  padding: 0;
}


</style> -->
<template>
  <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
    <div class="table_container" style="flex: 1; position: relative;">
      <el-table
        :data="tableData"
        border
        style="position: absolute; height: 100%; width: 100%; overflow-y: auto;"
        :row-style="getRowStyle"
        :cell-style="getCellStyle"
        :header-cell-style="getHeaderStyle"
        height="100%"
      >
        <el-table-column :label="tableTitle">
          <el-table-column :prop="'name'" label="工艺参数" />
          <el-table-column prop="real" label="实际值" />
          <el-table-column prop="real" label="参数" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, computed } from 'vue';

const size = ref(window.devicePixelRatio);

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  tableTitle: {
    type: String,
    default: 'XX机台'
  },
  productLabel: {
    type: String,
    default: '加工品号'
  }
});

function updateSize() {
  size.value = window.devicePixelRatio;
}

onMounted(() => {
  window.addEventListener('resize', updateSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});

const getRowStyle = computed(() => {
  return () => ({
    height: size.value >= 1.5 ? '32px' : '35px'
  });
});

const getCellStyle = computed(() => {
  return () => ({
    fontSize: size.value >= 1.5 ? '14px' : '13px',
    textAlign: 'center',
    padding: '8px'
  });
});

const getHeaderStyle = computed(() => {
  return {
    background: '#2575fc',
    color: 'white',
    fontSize: size.value >= 1.5 ? '16px' : '14px',
    textAlign: 'center',
    padding: '8px'
  };
});
</script>

<style scoped>
.el-table {
  --el-table-row-hover-bg-color: #2575fc;
  background-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-border: 1px solid rgb(83, 234, 253);
  color: white;
  --el-table-border-color: rgb(83, 234, 253);
}

:deep(.el-table th),
:deep(.el-table td) {
  padding: 8px;
}

:deep(.el-table--border) {
  border: 1px solid rgb(83, 234, 253);
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}
</style>