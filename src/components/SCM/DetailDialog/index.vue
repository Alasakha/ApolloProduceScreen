<template>
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="80%"
        :destroy-on-close="true"
    >
        <div class="detail-table">
            <el-table 
                v-loading="loading"
                :data="paginatedData" 
                border 
                style="width: 100%"
            >
                <el-table-column 
                    v-for="column in columns" 
                    :key="column.prop"
                    :label="column.label"
                    :prop="column.prop"
                />
            </el-table>
            
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
import { ref, computed } from 'vue';

const props = defineProps({
    // 弹窗标题
    title: {
        type: String,
        required: true
    },
    // 表格列配置
    columns: {
        type: Array,
        required: true
    },
    // 是否显示弹窗
    modelValue: {
        type: Boolean,
        required: true
    },
    // 表格数据
    data: {
        type: Array,
        default: () => []
    },
    // 加载状态
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = computed(() => props.data.length);

// 分页数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return props.data.slice(start, end);
});

// 弹窗显示状态
const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

// 处理分页
const handleSizeChange = (val) => {
    pageSize.value = val;
    currentPage.value = 1;
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
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
    color: #000000;
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

:deep(.el-dialog__title) {
    color: #333;
    font-weight: bold;
    font-size: 18px;
}

:deep(.el-dialog__header) {
    background-color: #f5f7fa;
    padding: 15px 20px;
    border-bottom: 1px solid #e4e7ed;
}

:deep(.el-dialog) {
    background-color: #fff;
}
</style> 