<template>
    <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="80%"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        append-to-body
    >
        <SearchTable
            :data="data"
            :columns="columns"
            :loading="loading"
            :search-fields="searchFields"
            :max-height="maxHeight"
        />
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import SearchTable from '../SearchTable/index.vue'

interface TableColumn {
    prop: string;
    label: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (row: any) => string;
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
    }
})

const emit = defineEmits(['update:modelValue'])

// 计算搜索字段
const searchFields = computed(() => {
    return props.columns.map(col => ({
        prop: col.prop,
        label: col.label
    }))
})

// 对话框可见性
const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>

<style scoped>
:deep(.el-dialog) {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

:deep(.el-dialog__header) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0;
    padding: 20px;
}

:deep(.el-dialog__title) {
    color: #fff;
    font-size: 1.2em;
}

:deep(.el-dialog__body) {
    padding: 20px;
    color: #fff;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #fff;
}
</style> 