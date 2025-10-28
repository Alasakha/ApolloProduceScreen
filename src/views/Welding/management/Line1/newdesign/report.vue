<template>
  <div class="notice-container">
    <!-- 通知滚动区域 -->
    <div class="marquee-container">
      <Vue3Marquee
        :duration="20"
        :pause-on-hover="true"
        direction="normal"
        class="marquee-text"
      >
        <div class="marquee-content">
          <span class="icon">⚡</span>
          <span 
            class="text" 
            v-if="!isLoading && notices.length > 0"
          >
            {{ displayText }}
          </span>
          <span class="text" v-else-if="isLoading">
            正在加载通知信息...
          </span>
          <span class="text" v-else>
            当日:重要点、安全、通知、信息、注意事项等、滚动条进行显示滚动
          </span>
        </div>
      </Vue3Marquee>
    </div>
    
    <!-- 管理按钮区域 -->
    <div class="management-buttons">
      <button @click="showAddDialog = true" class="btn btn-add">
        <span class="btn-icon">+</span>
        添加通知
      </button>
      <button @click="showManageDialog = true" class="btn btn-manage">
        <span class="btn-icon">📋</span>
        管理通知
      </button>
    </div>

    <!-- 添加通知对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="closeAddDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>添加通知</h3>
          <button @click="closeAddDialog" class="close-btn">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>通知类型：</label>
            <select v-model="newNotice.type" class="form-input">
              <option value="安全">安全</option>
              <option value="重要">重要</option>
              <option value="通知">通知</option>
              <option value="信息">信息</option>
            </select>
          </div>
          <div class="form-group">
            <label>通知内容：</label>
            <textarea 
              v-model="newNotice.notice" 
              class="form-textarea"
              placeholder="请输入通知内容..."
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="closeAddDialog" class="btn btn-cancel">取消</button>
          <button @click="addNotice" class="btn btn-confirm" :disabled="!newNotice.notice.trim()">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 管理通知对话框 -->
    <div v-if="showManageDialog" class="dialog-overlay" @click="closeManageDialog">
      <div class="dialog-content manage-dialog" @click.stop>
        <div class="dialog-header">
          <h3>通知管理</h3>
          <button @click="closeManageDialog" class="close-btn">×</button>
        </div>
        <div class="dialog-body">
          <div class="notice-list">
            <div 
              v-for="(notice, index) in notices" 
              :key="notice.uuid"
              class="notice-item"
            >
              <div class="notice-info">
                <span class="notice-type">【{{ notice.type }}】</span>
                <span class="notice-content">{{ notice.notice }}</span>
                <span class="notice-time">{{ formatTime(notice.create_time) }}</span>
              </div>
              <button 
                @click="deleteNotice(notice.uuid, index)"
                class="btn-delete"
                title="删除通知"
              >
                🗑️
              </button>
            </div>
            <div v-if="notices.length === 0" class="empty-state">
              暂无通知信息
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Vue3Marquee } from 'vue3-marquee'
import { fetchNoticeList, addNotice as addNoticeApi, deleteNoticeByUuid, type NoticeItem } from '@/api/welding1/index'

// 定义 props
interface Props {
  workshop?: string
  refreshEvent?: string
}

const props = withDefaults(defineProps<Props>(), {
  workshop: '1003', // 默认车间号
  refreshEvent: 'refreshNotice'
})

// 响应式数据
const notices = ref<NoticeItem[]>([])
const isLoading = ref(false)

// 对话框状态
const showAddDialog = ref(false)
const showManageDialog = ref(false)

// 新通知表单数据
const newNotice = ref({
  notice: '',
  type: '通知',
  workshop: props.workshop
})

// 计算属性：显示的通知文本
const displayText = computed(() => {
  if (notices.value.length === 0) return ''
  
  // 将所有通知按序号格式展示
  const formattedNotices = notices.value.map((notice, index) => {
    return `${index + 1}.【${notice.type}】${notice.notice}`
  })
  
  return formattedNotices.join('  ')
})

// 获取通知列表
const fetchNotices = async () => {
  try {
    isLoading.value = true
    const data = await fetchNoticeList({ workshop: props.workshop })
    notices.value = data || []
  } catch (error) {
    console.error('获取通知信息失败:', error)
    notices.value = []
  } finally {
    isLoading.value = false
  }
}

// 添加通知
const addNotice = async () => {
  if (!newNotice.value.notice.trim()) {
    alert('请输入通知内容')
    return
  }

  try {
    await addNoticeApi({
      notice: newNotice.value.notice.trim(),
      workshop: props.workshop,
      type: newNotice.value.type
    })
    
    // 添加成功后刷新列表
    await fetchNotices()
    
    // 关闭对话框并重置表单
    closeAddDialog()
    
    alert('通知添加成功！')
  } catch (error) {
    console.error('添加通知失败:', error)
    alert('添加通知失败，请重试')
  }
}

// 删除通知
const deleteNotice = async (uuid: string, index: number) => {
  if (!confirm('确定要删除这条通知吗？')) {
    return
  }

  try {
    await deleteNoticeByUuid(uuid)
    
    // 删除成功后从本地数组中移除
    notices.value.splice(index, 1)
    
    alert('通知删除成功！')
  } catch (error) {
    console.error('删除通知失败:', error)
    alert('删除通知失败，请重试')
  }
}

// 关闭添加对话框
const closeAddDialog = () => {
  showAddDialog.value = false
  // 重置表单
  newNotice.value = {
    notice: '',
    type: '通知',
    workshop: props.workshop
  }
}

// 关闭管理对话框
const closeManageDialog = () => {
  showManageDialog.value = false
}

// 格式化时间
const formatTime = (timeStr: string) => {
  try {
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return timeStr
  }
}


// 监听刷新事件
import { eventBus } from '@/utils/eventbus'

onMounted(() => {
  fetchNotices()
  eventBus.on(props.refreshEvent, fetchNotices)
})

// 组件卸载时清理
import { onBeforeUnmount } from 'vue'

onBeforeUnmount(() => {
  eventBus.off(props.refreshEvent, fetchNotices)
})
</script>

<style scoped>
.notice-container {
  width: 100%;
  position: relative;
}

.marquee-container {
  height: 5vh;
  width: 100%;
  /* background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); */
  border-top: 3px solid #1976d2;
  border-bottom: 3px solid #1976d2;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

/* 管理按钮样式 */
.management-buttons {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-add {
  background: #4caf50;
  color: white;
}

.btn-add:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.btn-manage {
  background: #2196f3;
  color: white;
}

.btn-manage:hover {
  background: #1976d2;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 14px;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
}

.manage-dialog {
  min-width: 600px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f5f5f5;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #e0e0e0;
}

.dialog-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f5f5f5;
}

/* 表单样式 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  background: #2196f3;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #1976d2;
}

.btn-confirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 通知列表样式 */
.notice-list {
  max-height: 400px;
  overflow-y: auto;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fafafa;
  transition: background 0.3s ease;
}

.notice-item:hover {
  background: #f0f0f0;
}

.notice-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notice-type {
  background: #2196f3;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.notice-content {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.notice-time {
  color: #666;
  font-size: 12px;
  white-space: nowrap;
}

.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.btn-delete:hover {
  background: #d32f2f;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 14px;
}

.marquee-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.marquee-content {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-size: 25px;
  font-weight: 600;
  color: #d32f2f;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.marquee-content .text {
  font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

/* 根据通知类型显示不同颜色 */
.marquee-content .text[data-type="安全"] {
  color: #f44336;
}

.marquee-content .text[data-type="重要"] {
  color: #ff9800;
}

.marquee-content .text[data-type="通知"] {
  color: #2196f3;
}

.marquee-content .text[data-type="信息"] {
  color: #4caf50;
}

.icon {
  font-size: 24px;
  color: #1976d2;
  animation: pulse 2s infinite;
}

.text {
  font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  letter-spacing: 1px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .marquee-content {
    font-size: 16px;
  }
  
  .icon {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .marquee-content {
    font-size: 14px;
    gap: 8px;
  }
  
  .icon {
    font-size: 18px;
  }
}
</style>
