<template>
  <div class="tooltip-container">
    <!-- 触发元素 -->
    <div 
      class="trigger-element"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @click="showDetail"
    >
      <slot name="trigger">
        <el-icon class="info-icon"><InfoFilled /></el-icon>
      </slot>
    </div>

    <!-- 悬浮提示 -->
    <div 
      v-show="isTooltipVisible"
      class="tooltip-content"
      :style="tooltipStyle"
    >
      <slot name="tooltip">
        {{ tooltipContent }}
      </slot>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="isDetailVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      destroy-on-close
    >
      <slot name="detail">
        <div class="detail-content">
          {{ detailContent }}
        </div>
      </slot>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElIcon, ElDialog } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  tooltipContent: {
    type: String,
    default: '点击查看详情'
  },
  detailContent: {
    type: String,
    default: ''
  },
  dialogTitle: {
    type: String,
    default: '详细信息'
  },
  dialogWidth: {
    type: String,
    default: '50%'
  },
  placement: {
    type: String,
    default: 'top',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  }
})

const emit = defineEmits(['detail-show', 'detail-hide'])

// 悬浮提示状态
const isTooltipVisible = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })

// 详情弹窗状态
const isDetailVisible = ref(false)

// 计算提示框样式
const tooltipStyle = computed(() => {
  const baseStyle = {
    position: 'absolute',
    zIndex: 1000
  }

  switch (props.placement) {
    case 'top':
      return {
        ...baseStyle,
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '5px'
      }
    case 'bottom':
      return {
        ...baseStyle,
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '5px'
      }
    case 'left':
      return {
        ...baseStyle,
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '5px'
      }
    case 'right':
      return {
        ...baseStyle,
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '5px'
      }
    default:
      return baseStyle
  }
})

// 显示/隐藏提示
const showTooltip = () => {
  isTooltipVisible.value = true
}

const hideTooltip = () => {
  isTooltipVisible.value = false
}

// 显示详情
const showDetail = () => {
  isDetailVisible.value = true
  emit('detail-show')
}

// 监听弹窗关闭
const handleDialogClose = () => {
  emit('detail-hide')
}
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.trigger-element {
  cursor: pointer;
}

.info-icon {
  color: #409EFF;
  font-size: 1.2em;
}

.tooltip-content {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  border-style: solid;
}

/* 箭头样式 */
[data-placement="top"] .tooltip-content::after {
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  border-width: 5px 5px 0;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent;
}

[data-placement="bottom"] .tooltip-content::after {
  top: -5px;
  left: 50%;
  margin-left: -5px;
  border-width: 0 5px 5px;
  border-color: transparent transparent rgba(0, 0, 0, 0.8);
}

[data-placement="left"] .tooltip-content::after {
  top: 50%;
  right: -5px;
  margin-top: -5px;
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.8);
}

[data-placement="right"] .tooltip-content::after {
  top: 50%;
  left: -5px;
  margin-top: -5px;
  border-width: 5px 5px 5px 0;
  border-color: transparent rgba(0, 0, 0, 0.8) transparent transparent;
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}
</style> 