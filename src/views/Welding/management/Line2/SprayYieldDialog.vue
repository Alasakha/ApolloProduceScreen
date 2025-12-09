<template>
         <el-dialog
         v-model="visible"
         title="喷涂直通率详情"
         width="95%"
         :close-on-click-modal="false"
         :close-on-press-escape="false"
         class="spray-dialog"
         :modal="true"
         :append-to-body="true"
         :lock-scroll="true"
         :z-index="2000"
         @close="handleClose"
     >
        <div class="dialog-content">
            <!-- 数据表格 -->
            <div class="table-container">
                                 <el-table :data="sprayData" border stripe style="width: 100%" v-loading="loading" height="500">
                     <el-table-column prop="udateTim" label="更新时间" width="160" />
                     <el-table-column prop="MB00" label="品号" width="140" />
                     <el-table-column prop="UDF66" label="总数" width="100" />
                     <el-table-column prop="ng" label="不合格数" width="100" />
                     <el-table-column prop="firstNg" label="首件不合格数" width="120" />
                     <el-table-column prop="TAO01" label="工单号" width="140" />
                     <el-table-column prop="TA002" label="工单号2" width="120" />
                     <el-table-column prop="TA006" label="品号" width="120" />
                     <el-table-column prop="MBO03" label="规格" min-width="200" />
                     <el-table-column prop="peopleName" label="操作人" width="120" />
                </el-table>
            </div>
        </div>
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="saveAllData">
                    📊 数据说明
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getPaintingPassRateDetail } from '@/api/getStampWeldinfo'
import type { PaintingPassRateDetail } from '@/api/getStampWeldinfo'

// Props
interface Props {
    modelValue: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

// 响应式数据
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const sprayData = ref<PaintingPassRateDetail[]>([])
const loading = ref(false)

// 监听对话框显示状态
watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await loadSprayData()
    }
})


// 加载喷涂数据
const loadSprayData = async () => {
    try {
        loading.value = true
        const response = await getPaintingPassRateDetail()
        sprayData.value = response.data
    } catch (error) {
        console.error('加载喷涂数据失败:', error)
        ElMessage.error('加载数据失败')
    } finally {
        loading.value = false
    }
}

// 保存所有数据 - 现在改为查看详情提示
const saveAllData = async () => {
    ElMessage.info('这是喷涂直通率详情数据，仅供查看')
}

// 关闭对话框
const handleClose = () => {
    visible.value = false
}
</script>

<style scoped>
.spray-dialog {
    background: rgba(0, 0, 0, 0.8);
}

/* 确保对话框在正确的层级 */
:deep(.el-dialog) {
    margin: 5vh auto !important;
}

:deep(.el-dialog__wrapper) {
    z-index: 2000 !important;
}

:deep(.el-overlay) {
    z-index: 1999 !important;
}

/* 问题点编辑对话框的层级 */
:deep(.el-dialog__wrapper .el-dialog__wrapper) {
    z-index: 2100 !important;
}

:deep(.el-dialog__wrapper .el-overlay) {
    z-index: 2099 !important;
}

 .dialog-content {
     max-height: 80vh;
     overflow-y: auto;
     padding: 0;
 }

 .table-container {
     margin-bottom: 0;
     height: 100%;
 }


 .dialog-footer {
     text-align: right;
 }

 /* 表格平分对话框空间的样式 */
 /* :deep(.el-table) {
     height: 500px !important;
 } */

 :deep(.el-table__body-wrapper) {
     overflow-y: auto;
 }

 :deep(.el-table__header-wrapper) {
     background-color: #f5f7fa;
 }

 /* 确保表格列宽合理分布 */
 :deep(.el-table .cell) {
     padding: 8px 12px;
 }

</style> 