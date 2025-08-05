<template>
  <div class="order-card-glow">
    <div class="order-card-main">
      <div class="line1-content flex w-full  ">
          <div class="catogory">{{ machineName }}</div>
          <div class="flex flex-col"><div class="box-label">客户单号：</div><div class="text-sm text-white">{{ frame }}</div></div>
          <div class="flex flex-col"><div class="box-label">车型/规格：</div><div class="text-sm text-white">{{ customerNo }} </div></div>
          <div class="flex flex-col"><div class="box-label">计划数：</div><div class="text-sm text-white">{{ modelSpec }}</div></div>
        </div>
      <div v-if="props.deviceCategory=='weldingA'" class="data-grid ">
        <!-- 上排三个框 -->

        <!-- 下排三个框 -->
        <div  class=" data-box">
          <div class="box-label">产量</div>
          <div class="box-value">{{ production }}</div>
        </div>
        <div class="data-box">
          <div class="box-label">电流</div>
          <div class="box-value">{{ liu }}</div>
        </div>
        <div class="data-box">
          <div class="box-label">电压</div>
          <div class="box-value">{{ ya }}</div>
        </div>
        <div class="data-box">
          <div class="box-label">节拍</div>
          <div class="box-value">{{ jp }}</div>
        </div>
      </div>
      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div v-if="props.deviceCategory=='weldingA'||props.deviceCategory=='weldingB'" class="progress-text">已补焊：{{ repairWelding }} 件</div>
        <div v-if="props.deviceCategory=='weldingC'" class="progress-text flex justify-between items-center w-full">
          <div>合格率：{{ passRate }}%，</div>
          <div class="flex gap-x-4">
            TOP前三问题占比
            <div>问题1</div>
            <div>问题2</div>
            <div>问题3</div>
          </div>
        </div>
        </div>
      </div>
    </div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  machineName: {
    type: String,
    default: ""
  },
  frame: {
    type: String,
    default: ""
  },
  customerNo: {
    type: String,
    default: ""
  },
  modelSpec: {
    type: String,
    default: ""
  },
  production: {
    type: [Number, String],
    default: 0
  },
  autoWeldProgress: {
    type: [Number, String],
    default: 0
  },
  manualWeldCount: {
    type: [Number, String],
    default: 0
  },
  deviceCategory:{
    type:String,
  },
  liu: {
    type: [Number, String],
    default: 0
  },
  ya: {
    type: [Number, String],
    default: 0
  },
  jp: {
    type: [Number, String],
    default: 0
  },  
  repairWelding: {
    type: [Number, String],
    default: 0
  }
})

// 计算进度百分比
const progressPercent = computed(() => {
  const total = Number(props.planCount) || 0
  const done = Number(props.autoWeldProgress) || 0
  return total > 0 ? Math.round((done / total) * 100) : 0
})
</script>

<style scoped>
.order-card-glow {
  width: 100%;
  height: 100%;
  min-height: 80px; /* 减小最小高度 */
  max-height: 120px;
  background: rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  box-shadow:
    0 0 24px 4px #2575fc,
    0 0 0 2px #2575fc inset;
  border: 2px solid #2575fc;
  position: relative;
  overflow: visible;
  padding: 8px; /* 减小内边距 */
  display: flex;
  flex-direction: column;
}

.order-card-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 8px; /* 减小间距 */
  flex: 1;
  min-height: 40px; /* 控制最小高度 */
}

.data-box {
  border: 1px solid rgba(124, 231, 253, 0.5);
  border-radius: 4px;
  /* padding: 4px; 减小内边距 */
  background: rgba(37, 117, 252, 0.1);
  display: flex;
  flex-direction: row;
  gap: 4px; /* 减小间距 */
  align-items: center;
  justify-content: center;
}

.box-label {
  font-size: clamp(4px, 0.8vw, 12px); /* 减小字体大小范围 */
  color: rgb(93, 220, 255);
  margin-bottom: 2px; /* 减小间距 */
  white-space: nowrap;
}

.box-value {
  font-size: clamp(4px, 0.8vw, 14px); /* 减小字体大小范围 */
  font-weight: bold;
  color: #fff;
  word-break: break-all;
  text-align: center;
}

.progress-section {
  padding: 4px 0 0; /* 减小上边距 */
}

.progress-bar {
  height: 6px; /* 减小进度条高度 */
  background: rgba(37, 117, 252, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 2px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd000, #02da0d);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: clamp(4px, 0.8vw, 12px); /* 减小字体大小范围 */
  color: #ffffff;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.line1-content {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px; /* 减小间距 */
  padding: 0 10px;
  margin-bottom: 8px; /* 减小下边距 */
  min-height: 30px; /* 控制最小高度 */
}

.catogory {
  width: 4vw; /* 减小圆圈大小 */
  height: 1vw;
  min-width: 24px;
  min-height: 24px;
  /* border-radius: 50%; */
  background: rgba(37, 117, 252, 0.1);
  border: 2px solid #2575fc;
  box-shadow: 0 0 15px rgba(37, 117, 252, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.6vw;
  flex-shrink: 0;
}

.line1-content > div:not(.catogory) {
  flex: 1;
  min-width: 0;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 添加发光动画效果 */
@keyframes glowing {
  0% {
    box-shadow: 0 0 15px rgba(37, 117, 252, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(37, 117, 252, 0.5);
  }
  100% {
    box-shadow: 0 0 15px rgba(37, 117, 252, 0.3);
  }
}


</style>
<!-- 容器自适应：
添加 height: 100% 确保填充父容器高度
设置 min-height: 200px 保证最小显示高度
使用 flex 布局优化内容分布
响应式字体：
使用 clamp() 函数设置动态字体大小
标签文字：12px 到 16px 之间自适应
数值文字：14px 到 20px 之间自适应
响应式间距：
使用 clamp() 控制内边距和间距
网格间距：8px 到 15px 之间自适应
内部padding：6px 到 12px 之间自适应
文本溢出处理：
标签添加 white-space: nowrap 防止换行
数值添加 word-break: break-all 允许在任意字符间换行
进度条文本添加省略号效果
媒体查询适配：
大屏幕（>1280px）：最大间距和内边距
中等屏幕（<=1280px）：减小间距和内边距
小屏幕（<=768px）：进一步优化布局
Flex 布局优化：
主容器使用 flex 纵向布局
数据网格部分 flex: 1 自动填充剩余空间
数据框使用 flex 居中对齐
这些修改使得组件能够：
自动适应父容器大小
在不同屏幕尺寸下保持良好的显示效果
文字大小和间距会根据容器大小动态调整
内容溢出时有合适的处理方式 -->