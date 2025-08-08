<template>
  <div class="part1-container">
    <!-- 常规客户总直通率 -->
    <div class="total-passrate-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户总直通率</div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.totalPassRate.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">实际</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.totalPassRate.actual }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(regularData.totalPassRate.achievement)">
            {{ regularData.totalPassRate.achievement }}%
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="detail-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showDetail">查看详情</button>
        <button class="reason-btn text-[8px] 2xl:text-[9px] 3xl:text-[10px] 4xl:text-xs" @click="showReasonDialog">填写原因/对策</button>
      </div>
    </div>

    <!-- 常规客户年度数据 -->
    <div class="annual-data-section">
      <div class="section-title text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg">常规客户年度数据</div>
      <div class="metrics-row">
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度目标</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.annualData.target }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">年度计</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold">{{ regularData.annualData.plan }}%</div>
        </div>
        <div class="metric-item">
          <div class="metric-label text-[8px] 2xl:text-[10px] 3xl:text-xs 4xl:text-sm">达成率</div>
          <div class="metric-value text-[11px] 2xl:text-sm 3xl:text-base 4xl:text-lg font-bold" :class="getAchievementClass(regularData.annualData.achievement)">
            {{ regularData.annualData.achievement }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailDialog" class="dialog-overlay" @click="closeDetail">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>常规客户总直通率详情</h3>
          <button class="close-btn" @click="closeDetail">×</button>
        </div>
        <div class="dialog-body">
          <div class="detail-item">
            <span class="detail-label">当前目标：</span>
            <span class="detail-value">{{ regularData.totalPassRate.target }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">实际完成：</span>
            <span class="detail-value">{{ regularData.totalPassRate.actual }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">达成情况：</span>
            <span class="detail-value" :class="getAchievementClass(regularData.totalPassRate.achievement)">
              {{ regularData.totalPassRate.achievement }}%
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">差值：</span>
            <span class="detail-value">{{ (regularData.totalPassRate.actual - regularData.totalPassRate.target).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 原因/对策弹窗 -->
    <div v-if="showReasonDialogFlag" class="dialog-overlay" @click="closeReasonDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>填写原因/对策</h3>
          <button class="close-btn" @click="closeReasonDialog">×</button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>问题原因：</label>
            <textarea v-model="reasonForm.reason" placeholder="请描述问题的具体原因..."></textarea>
          </div>
          <div class="form-group">
            <label>改进对策：</label>
            <textarea v-model="reasonForm.solution" placeholder="请描述具体的改进对策..."></textarea>
          </div>
          <div class="form-group">
            <label>责任人：</label>
            <input v-model="reasonForm.responsible" placeholder="请输入责任人姓名" />
          </div>
          <div class="form-group">
            <label>预计完成时间：</label>
            <input v-model="reasonForm.deadline" type="date" />
          </div>
          <div class="dialog-actions">
            <button class="cancel-btn" @click="closeReasonDialog">取消</button>
            <button class="submit-btn" @click="submitReason">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock数据
const regularData = ref({
  totalPassRate: {
    target: 92.0,
    actual: 89.3,
    achievement: 97.1
  },
  annualData: {
    target: 94.0,
    plan: 91.5,
    achievement: 97.3
  }
})

// 弹窗状态
const showDetailDialog = ref(false)
const showReasonDialogFlag = ref(false)

// 表单数据
const reasonForm = ref({
  reason: '',
  solution: '',
  responsible: '',
  deadline: ''
})

// 获取达成率样式类
const getAchievementClass = (value) => {
  if (value >= 100) return 'achievement-excellent'
  if (value >= 98) return 'achievement-good'
  if (value >= 95) return 'achievement-normal'
  return 'achievement-warning'
}

// 显示详情
const showDetail = () => {
  showDetailDialog.value = true
}

// 关闭详情
const closeDetail = () => {
  showDetailDialog.value = false
}

// 显示原因对策弹窗
const showReasonDialog = () => {
  showReasonDialogFlag.value = true
}

// 关闭原因对策弹窗
const closeReasonDialog = () => {
  showReasonDialogFlag.value = false
  // 重置表单
  reasonForm.value = {
    reason: '',
    solution: '',
    responsible: '',
    deadline: ''
  }
}

// 提交原因对策
const submitReason = () => {
  // 这里可以添加提交逻辑
  console.log('提交原因对策：', reasonForm.value)
  alert('原因/对策已提交成功！')
  closeReasonDialog()
}
</script>

<style scoped>
.part1-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
  color: #fff;
}

.total-passrate-section,
.annual-data-section {
  background: rgba(0, 30, 60, 0.3);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 6px;
  padding: 8px;
  backdrop-filter: blur(5px);
  flex: 1;
}

.section-title {
  /* font-size: 12px; */
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 6px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 4px;
}

.metrics-row {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 8px;
}

.metric-item {
  flex: 1;
  text-align: center;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border-left: 3px solid #00d4ff;
}

.metric-label {
  /* font-size: 10px; */
  color: #8cc8ff;
  margin-bottom: 2px;
}

.metric-value {
  /* font-size: 14px; */
  font-weight: bold;
  color: #fff;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.detail-btn,
.reason-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  /* font-size: 10px; */
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-btn {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border: 1px solid #00d4ff;
}

.detail-btn:hover {
  background: rgba(0, 212, 255, 0.3);
}

.reason-btn {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  border: 1px solid #ffa500;
}

.reason-btn:hover {
  background: rgba(255, 165, 0, 0.3);
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: rgba(0, 30, 60, 0.95);
  border: 1px solid rgba(0, 150, 255, 0.5);
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  max-width: 500px;
  backdrop-filter: blur(10px);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 150, 255, 0.3);
  padding-bottom: 10px;
}

.dialog-header h3 {
  color: #00d4ff;
  margin: 0;
  /* font-size: 18px; */
}

.close-btn {
  background: none;
  border: none;
  color: #ff4444;
  /* font-size: 24px; */
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #ff6666;
}

.dialog-body {
  color: #fff;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.detail-label {
  color: #8cc8ff;
}

.detail-value {
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #8cc8ff;
  /* font-size: 14px; */
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  /* font-size: 14px; */
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 5px rgba(0, 212, 255, 0.3);
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn,
.submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  /* font-size: 14px; */
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(128, 128, 128, 0.3);
  color: #ccc;
  border: 1px solid #666;
}

.cancel-btn:hover {
  background: rgba(128, 128, 128, 0.5);
}

.submit-btn {
  background: rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  border: 1px solid #00d4ff;
}

.submit-btn:hover {
  background: rgba(0, 212, 255, 0.5);
}

/* 达成率颜色样式 */
.achievement-excellent {
  color: #00ff88;
}

.achievement-good {
  color: #00d4ff;
}

.achievement-normal {
  color: #fff;
}

.achievement-warning {
  color: #ff4444;
}
</style>