<template>
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        :width="dialogWidth"
        :max-height="dialogHeight"
        :style="dialogStyle"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="handleClose"
    >
        <div class="dialog-container">
            <div class="table-container">
                <SearchTable
                    :data="data"
                    :columns="tableColumns"
                    :loading="loading"
                    :search-fields="searchFields"
                    :pagination="pagination"
                    @search="handleSearch"
                    @page-change="handlePageChange"
                    @size-change="handleSizeChange"
                />
            </div>
        </div>
        
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">关闭</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import SearchTable from '../SearchTable/index.vue'

interface TableColumn {
    prop: string;
    label: string;
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (row: any) => string;
    fixed?: boolean | 'left' | 'right';
}

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: '详情'
    },
    data: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    columns: {
        type: Array as PropType<TableColumn[]>,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    maxHeight: {
        type: [String, Number],
        default: '60vh'
    },
    maxWidth: {
        type: [String, Number],
        default: '80%'
    }
})

const emit = defineEmits(['update:modelValue'])

// 移除所有自适应逻辑，使用默认的dialog行为
const dialogWidth = computed(() => {
    return props.maxWidth || '80%'
})

const dialogStyle = computed(() => {
    return {
        width: dialogWidth.value
    }
})

// 移除响应式列配置，使用原始列配置
const tableColumns = computed(() => {
    return props.columns
})

// 计算搜索字段
const searchFields = computed(() => {
    return props.columns.map(col => ({
        prop: col.prop,
        label: col.label
    }))
})

// 移除响应式高度逻辑，使用固定高度
const dialogHeight = computed(() => {
    return props.maxHeight || '60vh'
})

// 添加缺失的方法
const handleClose = () => {
    emit('update:modelValue', false)
}

const handleSearch = (searchData: any) => {
    // 处理搜索逻辑
    console.log('Search:', searchData)
}

const handlePageChange = (page: number) => {
    // 处理分页变化
    console.log('Page change:', page)
}

const handleSizeChange = (size: number) => {
    // 处理每页大小变化
    console.log('Size change:', size)
}

// 分页配置
const pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0
}

// 对话框可见性
const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

// 移除窗口大小监听逻辑
// 使用默认的dialog行为

onMounted(() => {
    // 移除窗口大小监听逻辑
})

onUnmounted(() => {
    // 移除窗口大小监听逻辑
})
</script>

<style scoped>
.dialog-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.table-container {
    flex: 1;
    overflow: auto;
}

/* 简单的表格样式 */
:deep(.el-table) {
    width: 100%;
}

/* 确保固定列正确显示 */
:deep(.el-table__fixed) {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-table__fixed-right) {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}
</style> 