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
                     <el-table-column prop="doc_no" label="检验单号" width="140" />
                     <el-table-column prop="item_code" label="客户单号" width="140" />
                     <el-table-column prop="udf021" label="品号" width="140" />
                     <el-table-column prop="item_description" label="品名" min-width="200" />
                     <el-table-column prop="inventory_qty" label="送检数量" width="120" />
                                         <el-table-column label="合格数量" width="120">
                         <template #default="scope">
                             <el-input-number
                                 v-model="scope.row.okCount"
                                 :min="0"
                                 :max="parseInt(scope.row.inventory_qty)"
                                 size="small"
                                 @change="calculateUnqualified(scope.row)"
                             />
                         </template>
                     </el-table-column>
                     <el-table-column label="不合格数量" width="120">
                         <template #default="scope">
                             <span>{{ scope.row.unqualifiedCount }}</span>
                         </template>
                     </el-table-column>
                     <el-table-column label="问题点" min-width="250">
                         <template #default="scope">
                             <div class="issue-display">
                                 <div v-if="scope.row.issueList && scope.row.issueList.length > 0">
                                     <div v-for="(issue, index) in scope.row.issueList" :key="index" class="issue-item-display">
                                         <span class="issue-problem">{{ issue.problemPoint }}</span>
                                         <span class="issue-duty">({{ issue.dutyPeople }})</span>
                                     </div>
                                 </div>
                                 <span v-else class="no-issue">无问题点</span>
                             </div>
                         </template>
                     </el-table-column>
                     <el-table-column label="操作" width="120">
                         <template #default="scope">
                             <el-button
                                 type="primary"
                                 size="small"
                                 @click="editIssues(scope.row)"
                             >
                                 编辑问题
                             </el-button>
                         </template>
                     </el-table-column>
                </el-table>
            </div>

                         <!-- 问题点编辑 Dialog -->
             <el-dialog
                 v-model="issueDialogVisible"
                 title="编辑问题点和责任人"
                 width="60%"
                 :modal="true"
                 :append-to-body="true"
                 :lock-scroll="true"
                 :z-index="2100"
             >
                                 <div class="issue-edit-container">
                     <div class="issue-header">
                         <span class="item-info">
                             {{ currentItem?.item_description }} ({{ currentItem?.udf021 }})
                         </span>
                     </div>
                     
                     <!-- 合格数量编辑 -->
                     <div class="quantity-edit-section">
                         <div class="quantity-row">
                             <span class="quantity-label">送检数量：</span>
                             <span class="quantity-value">{{ currentItem?.inventory_qty }}</span>
                         </div>
                         <div class="quantity-row">
                             <span class="quantity-label">合格数量：</span>
                             <el-input-number
                                 v-model="currentItem.okCount"
                                 :min="0"
                                 :max="parseInt(currentItem.inventory_qty)"
                                 size="small"
                                 @change="calculateUnqualifiedEdit"
                             />
                         </div>
                         <div class="quantity-row">
                             <span class="quantity-label">不合格数量：</span>
                             <span class="quantity-value">{{ currentItem?.unqualifiedCount }}</span>
                         </div>
                     </div>
                    
                    <div class="issue-list">
                        <div
                            v-for="(issue, index) in currentItem?.issueList || []"
                            :key="index"
                            class="issue-item"
                        >
                            <div class="issue-row">
                                <el-input
                                    v-model="issue.problemPoint"
                                    placeholder="请输入问题点"
                                    class="problem-input"
                                />
                                <el-input
                                    v-model="issue.dutyPeople"
                                    placeholder="请输入责任人"
                                    class="duty-input"
                                />
                                <el-button
                                    type="danger"
                                    size="small"
                                    @click="removeIssue(index)"
                                >
                                    删除
                                </el-button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="issue-actions">
                        <el-button type="primary" @click="addIssue">
                            添加问题点
                        </el-button>
                    </div>
                </div>
                
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="issueDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="saveIssues">
                            确定
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="saveAllData">
                    💡 使用说明
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getSprayFty, getSprayFtyFillin } from '@/api/getStampWeldinfo'
import type { SprayFty } from '@/api/getStampWeldinfo'

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

const issueDialogVisible = ref(false)
const sprayData = ref<(SprayFty & { unqualifiedCount: number })[]>([])
const currentItem = ref<(SprayFty & { unqualifiedCount: number }) | null>(null)
const loading = ref(false)
// const saving = ref(false)

// 监听对话框显示状态
watch(() => props.modelValue, async (newVal) => {
    if (newVal) {
        await loadSprayData()
    }
})

// 计算不合格数量
const calculateUnqualified = (item: any) => {
    const inventoryQty = parseInt(item.inventory_qty)
    item.unqualifiedCount = inventoryQty - item.okCount
}

// 编辑时计算不合格数量
const calculateUnqualifiedEdit = () => {
    if (currentItem.value) {
        const inventoryQty = parseInt(currentItem.value.inventory_qty)
        currentItem.value.unqualifiedCount = inventoryQty - currentItem.value.okCount
    }
}

// 加载喷涂数据
const loadSprayData = async () => {
    try {
        loading.value = true
        const response = await getSprayFty()
        sprayData.value = response.data.map(item => ({
            ...item,
            unqualifiedCount: parseInt(item.inventory_qty) - item.okCount
        }))
    } catch (error) {
        console.error('加载喷涂数据失败:', error)
        ElMessage.error('加载数据失败')
    } finally {
        loading.value = false
    }
}

// 编辑问题点
const editIssues = (item: SprayFty) => {
    currentItem.value = { 
        ...item, 
        unqualifiedCount: parseInt(item.inventory_qty) - item.okCount 
    }
    issueDialogVisible.value = true
}

// 添加问题点
const addIssue = () => {
    if (currentItem.value) {
        if (!currentItem.value.issueList) {
            currentItem.value.issueList = []
        }
        currentItem.value.issueList.push({
            problemPoint: '',
            dutyPeople: ''
        })
    }
}

// 删除问题点
const removeIssue = (index: number) => {
    if (currentItem.value?.issueList) {
        currentItem.value.issueList.splice(index, 1)
    }
}

// 保存问题点
const saveIssues = async () => {
    if (currentItem.value) {
        try {
            // 过滤空的问题点
            currentItem.value.issueList = currentItem.value.issueList.filter(
                issue => issue.problemPoint.trim() && issue.dutyPeople.trim()
            )
            
            // 准备保存数据 - 需要完整的SprayFty数据
            const saveData: SprayFty = {
                po_arrival_inspection_id: currentItem.value.po_arrival_inspection_id,
                inventory_qty: currentItem.value.inventory_qty,
                item_description: currentItem.value.item_description,
                item_code: currentItem.value.item_code,
                doc_no: currentItem.value.doc_no,
                udf021: currentItem.value.udf021,
                okCount: currentItem.value.okCount,
                firstOkCount: currentItem.value.firstOkCount,
                issueList: currentItem.value.issueList
            }
            
            // 调用接口保存数据
            const result = await getSprayFtyFillin(saveData)
            
            if (result.data) {
                // 更新主数据
                const index = sprayData.value.findIndex(
                    item => item.po_arrival_inspection_id === currentItem.value?.po_arrival_inspection_id
                )
                if (index !== -1) {
                    sprayData.value[index] = { 
                        ...currentItem.value,
                        okCount: currentItem.value.okCount,
                        unqualifiedCount: currentItem.value.unqualifiedCount
                    }
                }
                
                issueDialogVisible.value = false
                ElMessage.success('问题点和数量保存成功')
                
                // 刷新数据
                await loadSprayData()
            } else {
                ElMessage.error('保存失败')
            }
        } catch (error) {
            console.error('保存数据失败:', error)
            ElMessage.error('保存数据失败')
        }
    }
}

// 保存所有数据 - 现在改为逐条保存提示
const saveAllData = async () => {
    ElMessage.info('请逐条编辑数据，每条数据编辑完成后会自动保存并刷新')
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

.issue-edit-container {
    padding: 20px;
}

.quantity-edit-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #e9ecef;
}

.quantity-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 15px;
}

.quantity-row:last-child {
    margin-bottom: 0;
}

.quantity-label {
    font-weight: 600;
    color: #495057;
    min-width: 100px;
}

.quantity-value {
    color: #6c757d;
    font-weight: 500;
}

/* 问题点显示样式 */
.issue-display {
    max-height: 120px;
    overflow-y: auto;
}

.issue-item-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    border-bottom: 1px solid #f0f0f0;
}

.issue-item-display:last-child {
    border-bottom: none;
}

.issue-problem {
    color: #e74c3c;
    font-weight: 500;
    flex: 1;
}

.issue-duty {
    color: #3498db;
    font-weight: 500;
    font-size: 0.9em;
}

.no-issue {
    color: #95a5a6;
    font-style: italic;
}

.issue-header {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
    border-left: 4px solid #1e90ff;
}

.item-info {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.issue-list {
    margin-bottom: 20px;
}

.issue-item {
    margin-bottom: 15px;
    padding: 15px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.issue-row {
    display: flex;
    gap: 15px;
    align-items: center;
}

.problem-input {
    flex: 2;
}

.duty-input {
    flex: 1;
}

.issue-actions {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #e0e0e0;
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

 /* 问题点列的特殊样式 */
 :deep(.issue-display) {
     max-height: 80px;
     overflow-y: auto;
 }
</style> 