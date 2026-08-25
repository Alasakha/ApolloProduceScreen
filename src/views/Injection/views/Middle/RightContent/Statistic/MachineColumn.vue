<template>
  <div class="machine-column">
    <div class="machine-index">{{ index }}</div>
    <div class="machine-name" :title="deviceName">{{ shortName }}</div>

    <!-- 工作状态（横排，节省高度） -->
    <div class="block status-block">
      <span class="status-label">工作状态</span>
      <div class="status-badge" :class="statusClass">
        {{ status || '暂无' }}
      </div>
    </div>

    <!-- 产能 / 稼动率 竖向条状图 -->
    <div class="block charts-block">
      <div class="bars">
        <div class="bar-item">
          <div class="bar-track">
            <div
              class="bar-fill capacity"
              :style="{ height: capacityPercent + '%' }"
            ></div>
          </div>
          <div class="bar-value">{{ capacityPercent }}%</div>
          <div class="bar-title">产能</div>
        </div>
        <div class="bar-item">
          <div class="bar-track">
            <div
              class="bar-fill operation"
              :style="{ height: operationPercent + '%' }"
            ></div>
          </div>
          <div class="bar-value">{{ operationPercent }}%</div>
          <div class="bar-title">稼动率</div>
        </div>
      </div>
    </div>

    <!-- 品号 / 规格 -->
    <div class="block info-block">
      <div class="block-label">品号 / 规格</div>
      <div class="info-row">
        <span class="info-key">品号</span>
        <span class="info-val" :title="String(ta006)">{{ ta006 || '暂无' }}</span>
      </div>
      <div class="info-row">
        <span class="info-key">品名</span>
        <span class="info-val" :title="String(spec)">{{ spec || '暂无' }}</span>
      </div>
      <div class="info-row">
        <span class="info-key">规格</span>
        <span class="info-val" :title="String(spen)">{{ spen || '暂无' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  index: { type: [Number, String], default: 1 },
  deviceName: { type: String, default: '' },
  status: { type: String, default: '' },
  capacityPercent: { type: Number, default: 0 },
  operationPercent: { type: Number, default: 0 },
  ta006: { type: [Number, String], default: '' },
  spec: { type: String, default: '' },
  spen: { type: String, default: '' },
});

const shortName = computed(() => {
  const name = props.deviceName || '';
  return name.replace(/注塑成型机$/, '') || name || '-';
});

const statusClass = computed(() => {
  const s = (props.status || '').toLowerCase();
  if (s.includes('加工中')) return 'status-processing';
  if (s.includes('待机') || s.includes('调机') || s.includes('闲置')) return 'status-waiting';
  if (s.includes('维修')) return 'status-maintenance';
  if (s.includes('关机') || s.includes('停机')) return 'status-off';
  return 'status-default';
});
</script>

<style scoped>
.machine-column {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.3rem;
  padding: 0.45rem 0.35rem 0.4rem;
  border: 1px solid rgba(14, 165, 233, 0.55);
  border-radius: 8px;
  background: rgba(3, 16, 61, 0.45);
  box-shadow:
    0 0 12px rgba(0, 234, 255, 0.12),
    inset 0 0 16px rgba(3, 16, 61, 0.35);
  position: relative;
}

.machine-index {
  position: absolute;
  top: -0.55rem;
  left: 50%;
  transform: translateX(-50%);
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #0288d1, #00eaff);
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(0, 234, 255, 0.5);
  z-index: 2;
}

.machine-name {
  margin-top: 0.4rem;
  text-align: center;
  color: #7ecfff;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  line-height: 1.2;
}

.block {
  border: 1px solid rgba(14, 165, 233, 0.35);
  border-radius: 6px;
  background: rgba(0, 40, 90, 0.28);
  padding: 0.25rem 0.35rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.block-label {
  color: #b0e0ff;
  font-size: 0.75rem;
  text-align: center;
  margin-bottom: 0.15rem;
  letter-spacing: 1px;
  flex-shrink: 0;
  line-height: 1.2;
}

.status-block {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row !important;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.28rem 0.4rem;
}

.status-label {
  color: #b0e0ff;
  font-size: 0.85rem;
  letter-spacing: 1px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-badge {
  color: #fff;
  font-size: 0.85rem;
  font-weight: bold;
  padding: 0.12rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.status-processing {
  background: linear-gradient(135deg, #4caf50 80%, #8bc34a 100%);
}
.status-waiting {
  background: linear-gradient(135deg, #ffb300 80%, #fffbe6 100%);
  color: #333;
}
.status-maintenance {
  background: linear-gradient(135deg, #f44336 80%, #ffcdd2 100%);
}
.status-off {
  background: linear-gradient(135deg, #607d8b 80%, #b0bec5 100%);
}
.status-default {
  background: linear-gradient(135deg, #2196f3 80%, #bbdefb 100%);
}

/* 柱状图吃掉卡片剩余高度，品号贴在底部 */
.charts-block {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0.35rem 0.25rem 0.3rem;
}

.bars {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  gap: 0.5rem;
  min-height: 0;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  min-height: 0;
}

.bar-track {
  flex: 1 1 auto;
  width: 92%;
  min-width: 32px;
  max-width: 82px;
  min-height: 0;
  background: rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(126, 207, 255, 0.45);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  min-height: 0;
}

.bar-fill.capacity {
  background: linear-gradient(180deg, #eaff00 0%, #00eaff 100%);
  box-shadow: 0 0 8px rgba(234, 255, 0, 0.35);
}

.bar-fill.operation {
  background: linear-gradient(180deg, #00eaff 0%, #2575fc 100%);
  box-shadow: 0 0 8px rgba(0, 234, 255, 0.35);
}

.bar-value {
  margin-top: 0.2rem;
  color: #fff;
  font-size: 0.95rem;
  font-weight: bold;
  text-shadow: 0 0 4px #00eaff;
  line-height: 1.1;
  flex-shrink: 0;
}

.bar-title {
  color: #e0f7ff;
  font-size: 0.9rem;
  font-weight: 700;
  margin-top: 0.05rem;
  letter-spacing: 1px;
  line-height: 1.1;
  flex-shrink: 0;
}

.info-block {
  flex: 0 0 auto;
  gap: 0.2rem;
  justify-content: flex-start;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}

.info-row {
  display: flex;
  gap: 0.25rem;
  align-items: baseline;
  min-width: 0;
  line-height: 1.35;
}

.info-key {
  flex-shrink: 0;
  color: #7ecfff;
  font-size: 0.75rem;
  width: 1.9rem;
}

.info-val {
  flex: 1;
  min-width: 0;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 1920px) and (max-width: 2059px) {
  .machine-name {
    font-size: 0.95rem;
  }
  .status-label,
  .status-badge {
    font-size: 0.8rem;
  }
  .bar-value,
  .bar-title {
    font-size: 0.85rem;
  }
  .bar-track {
    max-width: 46px;
  }
}

@media (max-width: 1919px) {
  .machine-column {
    padding: 0.3rem 0.25rem;
    gap: 0.22rem;
  }
  .machine-name {
    font-size: 0.85rem;
  }
  .status-label,
  .status-badge {
    font-size: 0.75rem;
  }
  .bar-value,
  .bar-title {
    font-size: 0.8rem;
  }
  .bar-track {
    min-width: 26px;
    max-width: 40px;
  }
  .info-key,
  .info-val,
  .block-label {
    font-size: 0.7rem;
  }
}
</style>
