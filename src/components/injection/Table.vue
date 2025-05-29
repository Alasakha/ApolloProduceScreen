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
        v-if="size >= 1.5"
        :data="tableData"
        border
        style="position: absolute; height: 100%; width: 100%; overflow-y: auto;"
        :row-style="rowStyle"
        :cell-style="tableCellStyle"
        :header-cell-style="tableHeaderStyle"
        height="100%"
      >
        <!-- 这里写大于等于1.5的表格结构和样式 -->
        <el-table-column :label="tableTitle">
          <el-table-column :prop="'name'" label="工艺参数" />
          <el-table-column prop="real" label="实际值" />
        </el-table-column>
      </el-table>

      <el-table
        v-else-if="size >= 1 && size < 1.5"
        :data="tableData"
        border
        style="position: absolute; height: 100%; width: 100%; overflow-y: auto;"
        :row-style="rowStyleLower"
        :cell-style="tableCellStyleLower"
        :header-cell-style="tableHeaderStyleLower"
        height="100%"
      >
        <!-- 这里写大于等于1且小于1.5的表格样式 -->
        <el-table-column :label="tableTitle">
          <el-table-column :prop="'name'" label="供应参数" />
          <el-table-column prop="real" label="实际值" />
        </el-table-column>
      </el-table>

      <!-- 如果还要处理更低缩放比，可以用 v-else -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,defineProps } from 'vue';

const size = ref(window.devicePixelRatio);

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  tableTitle: {
    type: String,
    default: 'XX机台' // 默认值
  },
    productLabel: {
    type: String,
    default: '加工品号' // 默认值
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

// 你现有的props和样式配置



const rowStyle = () => ({
  height: `${32 / size.value}px`,
});

// 低缩放比的样式，你可以调小字体、行高或者做别的定制
const tableCellStyleLower = () => ({
  fontSize: `${13 / size.value}px`,
  textAlign: 'center',
});

const rowStyleLower = () => ({
  height: `${35 / size.value}px`,
});

const tableHeaderStyle = {
  background: '#2575fc',
  color: 'white',
  fontSize: '0.5vw',
  textAlign: 'center',
};

const tableHeaderStyleLower = {
  background: '#2575fc',
  color: 'white',
  fontSize: '0.7vw',
  textAlign: 'center',
};


</script>


<style scoped>
.el-table {
  --el-table-row-hover-bg-color:#2575fc;
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
</style>