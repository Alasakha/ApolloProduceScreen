<template>
    <div class="search-table w-full">
        <!-- 搜索区域 -->
        <div class="search-area">
            <el-row :gutter="20">
                <el-col 
                    :span="4" 
                    v-for="(field, index) in searchFields" 
                    :key="index"
                    class="mb-[0vh]"
                >
                    <el-input
                        v-model="searchValues[field.prop]"
                        :placeholder="`搜索${field.label}`"
                        clearable
                        class="search-input"
                        @input="handleSearch"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
        </div>

        <!-- 表格区域 -->
        <el-table
            :data="paginatedData"
            :max-height="maxHeight"
            v-loading="loading"
            border
            fit
            highlight-current-row
        >
            <el-table-column
                v-for="col in columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
                :align="col.align || 'left'"
                show-overflow-tooltip
            >
                <template #default="scope" v-if="col.render">
                    {{ col.render(scope.row) }}
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PropType } from 'vue'
import { Search } from '@element-plus/icons-vue'

interface TableColumn {
    prop: string;
    label: string;
    width?: string | number;
    minWidth?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (row: any) => string;
}

interface SearchField {
    prop: string;
    label: string;
}

const props = defineProps({
    data: {
        type: Array as PropType<any[]>,
        required: true,
        default: () => []
    },
    columns: {
        type: Array as PropType<TableColumn[]>,
        required: true,
        default: () => []
    },
    searchFields: {
        type: Array as PropType<SearchField[]>,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    maxHeight: {
        type: [String, Number],
        default: '400px'
    }
})

// 搜索相关
const searchValues = ref({})
const currentPage = ref(1)
const pageSize = ref(10)

// 初始化搜索值
props.searchFields.forEach((field) => {
    searchValues.value[field.prop] = ''
})

// 过滤数据
const filteredData = computed(() => {
    let result = [...props.data]
    
    // 应用搜索过滤
    Object.entries(searchValues.value).forEach(([key, value]) => {
        if (value) {
            result = result.filter(item => 
                String(item[key])
                    .toLowerCase()
                    .includes(String(value).toLowerCase())
            )
        }
    })

    return result
})

// 分页数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
})

// 处理搜索
const handleSearch = () => {
    currentPage.value = 1 // 重置到第一页
}

// 处理分页
const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

// 监听数据变化
watch(() => props.data, () => {
    currentPage.value = 1
})

// 监听搜索值变化
watch(searchValues, () => {
    currentPage.value = 1
}, { deep: true })
</script>

<style scoped>
.search-table {
    display: flex;
    flex-direction: column;
}

.search-area {
    padding: 0.5vw;
    border-radius: 4px;
}

.search-input {
    width: 100%;
    margin: 0.3vh 0;
}

:deep(.el-input__wrapper) {
    padding: 0 0.5vw;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 16px 0;
}
</style> 