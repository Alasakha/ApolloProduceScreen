<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :destroy-on-close="true"
    :modal-append-to-body="false"
    :append-to-body="true"
    class="custom-dialog"
  >
    <div class="detail-table">

      <el-table 
        v-loading="loading"
        :data="tableData" 
        border 
        style="width: 100%"
        height="670"
      >
      <el-table-column type="index" label="序号" width="60" align="center"  :fixed/>
        <template v-for="(header, index) in headers" :key="header">
          

          <el-table-column 
            v-if="header !== '原因'"
            :prop="header" 
            :label="header" 
          
          />
          <el-table-column 
            v-else
            :prop="header" 
            :label="header"
          >
            <template #default="{ row }">
              <span>{{ row[header] || '--' }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <ReasonInput
              v-model="row['原因']"
              :row="row"
              @save="handleReasonUpdate"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table-column label="说明原因" width="200"></el-table-column> -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import ReasonInput from '../ReasonInput/index.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '详情'
  },
  width: {
    type: String,
    default: '90%'
  },
  headers: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update:reason']);

const dialogVisible = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val;
});

// 监听 dialogVisible 变化
watch(dialogVisible, (val) => {
  emit('update:modelValue', val);
});

// 监听数据变化
watch(() => props.data, (val) => {
  tableData.value = val;
  total.value = val.length;
}, { immediate: true });

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 处理原因和责任人更新
const handleReasonUpdate = ({ row, reason, duty ,completeDate}) => {
  emit('update:reason', { row, reason, duty,completeDate });
};
</script>

<style scoped>
.detail-table {
  max-height: 60vh;
  overflow-y: auto;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 10px;
}

:deep(.el-table) {
  background-color: transparent;
  color: #333;
}

:deep(.el-table th) {
  background-color: #0d47a1;
}

:deep(.el-table tr) {
  background-color: #fff;
}

:deep(.el-pagination) {
  margin-right: 20px;
}

:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.7);
}

:deep(.custom-dialog) {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 90vh;
}

:deep(.custom-dialog .el-dialog__body) {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

:deep(.custom-dialog .el-dialog__header) {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.custom-dialog .el-dialog__footer) {
  padding: 20px;
  margin: 0;
  border-top: 1px solid #dcdfe6;
}
</style> 