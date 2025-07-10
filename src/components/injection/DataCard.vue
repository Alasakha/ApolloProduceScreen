<template>
  <div class="order-card-glow">
    <!-- 梯形标题 -->
    <div class="order-card-title">
      <span>{{ orderName }}</span>
    </div>
    <!-- 右上角角标 -->
    <div v-if="status" class="order-card-badge">{{ status }}</div>
    <!-- 主体内容 -->
    <div class="order-card-main">
      <!-- 左侧数量区块 -->
      <div class="order-card-left">
        <div class="order-card-block">
          <div class="order-card-block-label">任务总数量</div>
          <div class="order-card-block-value">{{ totalQty }}</div>
        </div>
        <div class="order-card-block">
          <div class="order-card-block-label">已完成数量</div>
          <div class="order-card-block-value">{{ doneQty }}</div>
        </div>
      </div>
      <!-- 右侧详细信息 -->
      <div class="order-card-right">
        <!-- 进度区块外层 -->
        <div class="info-progress-area">
          <div class="info-row">
            <div class="info-top">
              <div class="info-code">品号：{{ ta006? ta006 : '暂无数据' }}</div>
              <div class="info-name">品名：{{ spec }}</div>
            </div>
            <div class="info-bottom">
              <div class="info-spec-value">规格：{{ spen }}</div>
              <div class="info-code">工单数：{{ gdNum ? gdNum : '暂无数据' }}</div>
            </div>
          </div>
          <div class="progress-row">
            <div class="progress-bar-bg">
              <div class="progress-bar-fg" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>
        <!-- 参数区块外层 -->
        <div class="params-area">
          <div class="main-row">
            <div class="params-block">
              <div class="param-row">
                <span class="param-label">温度：</span>
                <span class="param-std"
                  >标准：{{
                    stdTemperature !== null && stdTemperature !== undefined && stdTemperature !== "" ? stdTemperature : "暂无标准"
                  }}</span
                >
                <span class="param-act"
                  >实际值：{{
                    temperature !== null && temperature !== undefined && temperature !== "" ? temperature : "暂无数据"
                  }}</span
                >
              </div>
              <div class="param-row">
                <span class="param-label">压力：</span>
                <span class="param-std"
                  >标准：{{
                    stdPressure !== null && stdPressure !== undefined && stdPressure !== "" ? stdPressure : "暂无标准"
                  }}</span
                >
                <span class="param-act"
                  >实际值：{{ pressure !== null && pressure !== undefined && pressure !== "" ? pressure : "暂无数据" }}</span
                >
              </div>
              <div class="param-row">
                <span class="param-label">射速：</span>
                <span class="param-std"
                  >标准：{{
                    stdMaxspeed !== null && stdMaxspeed !== undefined && stdMaxspeed !== "" ? stdMaxspeed : "暂无标准"
                  }}</span
                >
                <span class="param-act"
                  >实际值：{{ maxspeed !== null && maxspeed !== undefined && maxspeed !== "" ? maxspeed : "暂无数据" }}</span
                >
              </div>
              <div class="param-row">
                <span class="param-label">保压时间：</span>
                <span class="param-std"
                  >标准：{{
                    stdKeeptime !== null && stdKeeptime !== undefined && stdKeeptime !== "" ? stdKeeptime : "暂无标准"
                  }}</span
                >
                <span class="param-act"
                  >实际值：{{ keeptime !== null && keeptime !== undefined && keeptime !== "" ? keeptime : "暂无数据" }}</span
                >
              </div>
            </div>
            <div class="energy-block">
              <div class="energy-title">能耗监控</div>
              <div class="text-white text-sm">
                <div>当日开机时长：{{ device.hourBetween }}</div>
                <div>设备功耗：{{ device.power }}</div>
                <div>标准耗电量：{{(Number(device.power.replace("kw", "")) * Number(device.hourBetween)).toFixed(2) }} kw·h</div>
                <div>实际耗电量：</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 警告区域 -->
    <div v-if="allWarnings.length > 0" class="warning-area">
      <div class="warning-title">
        <span>⚠ 警告</span>
      </div>
      <ul class="warning-content-list">
        <li v-for="(warning, index) in allWarnings" :key="index">{{ warning }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  orderName: {
    type: String,
    default: ""
  },
  totalQty: {
    type: [Number, String],
    default: 0
  },
  doneQty: {
    type: [Number, String],
    default: 0
  },
  finishDate: String,
  storage: String,
  spec: {
    type: String,
    default: ""
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: ""
  },
  category: String,
  temperature: {
    type: [Number, String],
    default: null
  },
  pressure: {
    type: [Number, String],
    default: null
  },
  maxspeed: {
    type: [Number, String],
    default: null
  },
  keeptime: {
    type: [Number, String],
    default: null
  },
  // 添加标准参数
  stdTemperature: {
    type: [Number, String],
    default: null
  },
  stdPressure: {
    type: [Number, String],
    default: null
  },
  stdMaxspeed: {
    type: [Number, String],
    default: "暂无"
  },
  stdKeeptime: {
    type: [Number, String],
    default: "暂无"
  },
  macName: {
    type: [String],
    default: "暂无"
  },
  spen: {
    type: String,
    default: "暂无"
  },
  dayRunTime: {
    type: [Number, String],
    default: "暂无"
  },
  power: {
    type: [Number, String],
    default: "暂无"
  },
  dayPower: {
    type: [Number, String],
    default: "暂无"
  },
  ta006: {
    type: [Number, String],
    default: "暂无"
  },
  gdNum: {
    type: [Number, String],
    default: "暂无"
  },
  device: {
    type: Object,
    default: () => ({})
  }
});

//判断是否有数据
// 判断是否有标准数据
const hasStrandData = value => {
  const num = Number(value);
  if (!num) return "暂无标准";
  return "标准：" + num.toFixed(1);
};

// 判断是否有实际数据
const hasActualData = value => {
  const num = Number(value);
  if (!num) return "暂无数据";
  return "实际值：" + num.toFixed(1);
};

// 合并的警告逻辑
const allWarnings = computed(() => {
  if (props.status !== "加工中") {
    return [];
  }

  const warnings = [];

  // 检查温度
  if (hasStrandData(props.stdTemperature) === "暂无标准") {
    warnings.push("温度：暂无标准");
  } else if (props.temperature) {
    const diff = Math.abs(Number(props.temperature) - Number(props.stdTemperature));
    if (diff > 20) {
      warnings.push(`温度超出偏差 (偏差: ${diff.toFixed(1)}℃)`);
    }
  }

  // 检查压力
  if (hasStrandData(props.stdPressure) === "暂无标准") {
    warnings.push("压力：暂无标准");
  } else if (props.pressure) {
    const diff = Math.abs(Number(props.pressure) - Number(props.stdPressure));
    if (diff > 20) {
      warnings.push(`压力超出偏差 (偏差: ${diff.toFixed(1)}MPa)`);
    }
  }

  // 检查射速
  if (hasStrandData(props.stdMaxspeed) === "暂无标准") {
    warnings.push("射速：暂无标准");
  } else if (props.maxspeed) {
    const diff = Math.abs(Number(props.maxspeed) - Number(props.stdMaxspeed));
    if (diff > 20) {
      warnings.push(`射速超出偏差 (偏差: ${diff.toFixed(1)}mm/s)`);
    }
  }

  // 检查保压时间
  if (hasStrandData(props.stdKeeptime) === "暂无标准") {
    warnings.push("保压时间：暂无标准");
  } else if (props.keeptime) {
    const diff = Math.abs(Number(props.keeptime) - Number(props.stdKeeptime));
    if (diff > 20) {
      warnings.push(`保压时间超出偏差 (偏差: ${diff.toFixed(1)}s)`);
    }
  }
  return warnings;
});
</script>

<style scoped>
.order-card-glow {
  width: 100%;
  background: rgba(255, 255, 255, 0.13);
  border-radius: 16px;
  box-shadow:
    0 0 24px 4px #2575fc,
    0 0 0 2px #2575fc inset;
  border: 2px solid #2575fc;
  position: relative;
  overflow: visible;
}
.order-card-title {
  width: 100%;
  height: 38px;
  background: linear-gradient(90deg, #2575fc 60%, #00eaff 100%);
  clip-path: polygon(10% 100%, 90% 100%, 100% 0, 0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  box-shadow: 0 2px 12px #00eaff99;
  position: relative;
  z-index: 2;
}
.order-card-badge {
  position: absolute;
  top: 10px;
  right: 18px;
  background: linear-gradient(135deg, #ffb300 80%, #fffbe6 100%);
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  padding: 4px 16px 4px 12px;
  border-radius: 8px 8px 8px 0;
  box-shadow: 0 2px 8px #ffb30055;
  transform: rotate(12deg);
  z-index: 3;
  border: 1.5px solid #fffbe6;
}
.order-card-main {
  display: flex;
  flex-direction: row;
  gap: 18px;
  min-height: 92%;
  padding: 0.5vw;
}
.order-card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: space-around;
}
.order-card-block {
  width: 100%;
  height: 35%;
  background: rgba(0, 40, 90, 0.35);
  border: 2px solid #2575fc;
  border-radius: 12px;
  box-shadow:
    0 0 12px #00eaff99,
    0 0 0 2px #2575fc inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
}
.order-card-block-label {
  font-size: 14px;
  color: #b0e0ff;
  margin-bottom: 2px;
}
.order-card-block-value {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 8px #00eaff99;
}
.order-card-right {
  flex: 5;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.order-card-detail {
  flex: 1;
  font-size: 1vw;
  color: #e0f7fa;
  display: flex;
  justify-content: start;
  align-items: center;
}
.order-card-progress {
  display: flex;
  align-items: center;
  margin-top: 6px;
  gap: 10px;
}
.progress-bar-bg {
  display: flex;
  width: 90%;
  height: 50%;
  background: rgba(0, 0, 0, 0.18);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 8px #00eaff55 inset;
  border: 1.5px solid #7ecfff;
  position: relative;
}
.progress-bar-fg {
  height: 100%;
  background: linear-gradient(90deg, #eaff00 0%, #00eaff 100%);
  border-radius: 8px 0 0 8px;
  box-shadow: 0 0 8px #eaff00cc;
  transition: width 0.5s cubic-bezier(0.4, 2.3, 0.3, 1);
}
.progress-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 6px #00eaff;
  min-width: 48px;
  text-align: right;
}
.line1 {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.order-card-params {
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.param-row {
  display: contents;
}
.param-label {
  color: #4e71ff;
  font-weight: bold;
  text-align: right;
}
.param-std {
  color: #ffb300;
  text-align: left;
}
.param-act {
  color: #06d8fe;
  font-weight: bold;
  text-align: left;
}
.info-progress-area {
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 10px;
}
.info-row {
  width: 100%;
  margin-bottom: 8px;
}
.info-top {
  justify-content: space-around;
  display: flex;
}
.info-spec {
  display: flex;
  justify-content: space-between;
  flex: 1;
}
.info-spec-value {
  flex: 1;
  font-weight: bold;
  color: #fff;
  font-size: 1.1em;
  text-align: right;
}
.info-bottom {
  display: flex;
  justify-content: space-around;
  margin-top: 4px;
}
.info-name {
  flex: 1;
  color: #fff;
  font-size: 1.1em;
  font-weight: bold;
  text-align: right;
}
.info-code {
  flex: 1;
  color: #fff;
  font-size: 1.1em;
  font-weight: bold;
  text-align: right;
}
.progress-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50%;
  gap: 10px;
  padding-right: 30px;
}
.params-area {
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.warning-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 35%;
  min-height: 10%;
  background: rgba(255, 80, 80, 0.13);
  border: 2px solid #ffb300;
  border-radius: 14px;
  box-shadow:
    0 0 16px 2px #ffb30099,
    0 0 0 2px #fffbe6 inset;
  color: #fff;
  z-index: 10;
  padding: 12px 18px 10px 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Microsoft YaHei", Arial, sans-serif;
}
.warning-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffb300;
  margin-bottom: 6px;
  text-shadow: 0 0 8px #ffb30099;
  letter-spacing: 1px;
}
.warning-content {
  line-height: 1.5;
  word-break: break-all;
}
.warning-content-list {
  list-style-type: none; /* 移除默认的列表符号 */
  padding-left: 0;
  margin-top: 4px;
}
.warning-content-list li {
  font-size: 0.9em;
  color: #ffc473;
  margin-bottom: 2px;
}
.warning-info {
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid #ffac40;
}
.warning-info .warning-title {
  color: #e68a00;
}
.warning-content {
  padding: 8px;
  font-size: 0.9em;
  color: #ff9822;
  text-shadow: 0 0 8px #00000099;
}
.main-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.params-block {
  display: grid;
  grid-template-columns: 8vw 8vw 10vw;
  row-gap: 6px;
  column-gap: 8px;
}
.param-item {
  display: flex;
  align-items: center;
}
.energy-block {
  background: linear-gradient(to right, #2879fc 80%, #04defd);
  border: 1px solid #e7db5f;
  border-radius: 6px;
  min-width: 6vw;
  flex: 1;
  padding-left: 0.5vw;
}
.energy-title {
  font-weight: bold;
  color: #07ebf7;
  margin-bottom: 8px;
}
.order-card {
  /* 默认大屏样式 */
  padding: 18px 24px;
  border-radius: 18px;
  font-size: 1vw;
  /* 不要设置height: 100%或flex: 1 */
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
}

/* 小屏幕下紧凑样式 */
@media (max-width: 1200px) {
  .order-card {
    padding: 10px 8px;
    font-size: 0.9em;
    border-radius: 10px;
  }
  .order-card-title {
    font-size: 1em;
  }
  .param-label,
  .param-std,
  .param-act {
    font-size: 0.9em;
  }
  .energy-block {
    padding: 8px 6px;
    font-size: 0.9em;
  }
}
@media (max-width: 800px) {
  .order-card {
    padding: 6px 2px;
    font-size: 0.8em;
    border-radius: 6px;
  }
  .order-card-title {
    font-size: 0.95em;
  }
  .energy-block {
    padding: 4px 2px;
    font-size: 0.8em;
  }
}
</style>
