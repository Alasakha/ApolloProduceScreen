<template>
  <div class="flex-container">
    <dv-loading v-if="loading">
      <div class="text-white">Loading...</div>
    </dv-loading>

    <!-- ========== 新布局：按机台号 1~7 横向排列 ========== -->
    <div v-else class="machine-row">
      <MachineColumn
        v-for="item in orderedMachines"
        :key="item.macCode"
        :index="item.index"
        :device-name="item.deviceName"
        :status="item.status"
        :capacity-percent="item.capacityPercent"
        :operation-percent="item.operationPercent"
        :ta006="item.ta006"
        :spec="item.spec"
        :spen="item.spen"
      />
    </div>

    <!-- ========== 原布局（智宏设备 / OPC UA设备）保留注释，方便恢复 ==========
    <div v-else class="device-sections">
      <div class="section-panel">
        <div class="section-header">
          <span class="section-header-text">智宏设备</span>
        </div>
        <div class="section-body">
          <div
            v-if="invokeDevices.length"
            class="section-grid"
          >
            <div
              class="row"
              v-for="(row, rowIdx) in chunkedInvokeDevices"
              :key="`invoke-${rowIdx}`"
            >
              <OrderCard
                v-for="device in row"
                :key="`invoke-${device.macCode}`"
                v-bind="getCardProps(device)"
              />
            </div>
          </div>
          <div v-else class="empty-tip">暂无设备数据</div>
        </div>
      </div>

      <div class="section-panel">
        <div class="section-header">
          <span class="section-header-text">OPC UA设备</span>
        </div>
        <div class="section-body">
          <div
            v-if="opcuaDevices.length"
            class="section-grid"
          >
            <div
              class="row"
              v-for="(row, rowIdx) in chunkedOpcuaDevices"
              :key="`opcua-${rowIdx}`"
            >
              <OrderCard
                v-for="device in row"
                :key="`opcua-${device.macCode}`"
                v-bind="getCardProps(device)"
              />
            </div>
          </div>
          <div v-else class="empty-tip">暂无设备数据</div>
        </div>
      </div>
    </div>
    ========== 原布局结束 ========== -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getInvokeDeviceList, getOpcuaDeviceList } from "@/api/getInjection";
// import OrderCard from "@/components/injection/DataCard.vue"; // 原布局恢复时取消注释
import MachineColumn from "./MachineColumn.vue";
import { useInjectionPowerStore } from '@/store/injectionPower';

const powerStore = useInjectionPowerStore();
const invokeDevices = ref([]);
const opcuaDevices = ref([]);
const loading = ref(true);

/** 机台固定顺序（按业务对照表） */
const MACHINE_ORDER = [
  { index: 1, macCode: '102050101004', deviceName: 'HTF1600注塑成型机' },
  { index: 2, macCode: '102050101003', deviceName: 'HTF250注塑成型机' },
  { index: 3, macCode: '102050101002', deviceName: 'HTF300注塑成型机' },
  { index: 4, macCode: '102050101001', deviceName: 'HTF450注塑成型机' },
  { index: 5, macCode: '102050101007', deviceName: 'UN550D1S注塑成型机' },
  { index: 6, macCode: '102050101006', deviceName: 'UN900D1S注塑成型机' },
  { index: 7, macCode: '102050101005', deviceName: 'UN1850D1S注塑成型机' },
];

const normalizeCode = (code) => String(code ?? '').trim();

const normalizeDevice = (raw) => {
  // OPC UA：已完成数 = 产量(prodCounterAct)；原接口仍用 cycnDone
  const cycnDone =
    raw.prodCounterAct ??
    raw.cycnDone ??
    raw.todayOutput ??
    raw.dayOutput ??
    raw.dailyProduction ??
    null;
  const hourBetween =
    raw.actualHour ??
    raw.hourBetween ??
    raw.runTime ??
    raw.openTime ??
    raw.startupHour ??
    null;
  const macCode = normalizeCode(raw.macCode ?? raw.machCode ?? raw.deviceCode ?? raw.mac_no ?? "");
  return {
    ...raw,
    macCode,
    deviceName: raw.deviceName ?? raw.macName ?? raw.name ?? macCode,
    pcNum: raw.pcNum ?? raw.planQty ?? raw.totalQty ?? null,
    cycnDone,
    deviceStatus: raw.deviceStatus ?? raw.status ?? "",
    gdNum: raw.gdNum ?? raw.workOrderNum ?? raw.woNum ?? null,
    hourBetween,
    actualHour: raw.actualHour ?? hourBetween,
  };
};

const allDevicesMap = computed(() => {
  const map = new Map();
  [...invokeDevices.value, ...opcuaDevices.value].forEach((d) => {
    if (d.macCode) map.set(d.macCode, d);
  });
  return map;
});

const clampPercent = (val) => {
  const n = Number(val);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.min(100, Math.round(n));
};

const orderedMachines = computed(() => {
  const map = allDevicesMap.value;
  return MACHINE_ORDER.map((m) => {
    const device = map.get(m.macCode);
    const done = Number(device?.cycnDone);
    const total = Number(device?.pcNum);
    let capacityPercent = 0;
    if (!Number.isNaN(done) && !Number.isNaN(total) && total > 0) {
      capacityPercent = clampPercent((done / total) * 100);
    }

    // operationRatio 接口多为 0~1 小数，兼容已是百分比的情况
    let operationPercent = 0;
    const ratio = device?.operationRatio;
    if (ratio !== null && ratio !== undefined && ratio !== '') {
      const n = Number(ratio);
      if (!Number.isNaN(n)) {
        operationPercent = clampPercent(n <= 1 ? n * 100 : n);
      }
    }

    return {
      index: m.index,
      macCode: m.macCode,
      // 名称一律按对照表映射，不采用接口返回名
      deviceName: m.deviceName,
      status: device?.deviceStatus || '',
      capacityPercent,
      operationPercent,
      ta006: device?.ta006 ?? '',
      spec: device?.ta034 ?? '',
      spen: device?.ta035 ?? '',
    };
  });
});

/* ========== 原布局辅助逻辑（恢复时取消注释）==========
const chunkDevices = (list) => {
  const arr = [];
  for (let i = 0; i < list.length; i += 2) {
    arr.push(list.slice(i, i + 2));
  }
  return arr;
};

const chunkedInvokeDevices = computed(() => chunkDevices(invokeDevices.value));
const chunkedOpcuaDevices = computed(() => chunkDevices(opcuaDevices.value));

const calcProgress = (device) => {
  if (!device.cycnDone || !device.pcNum) return 0;
  return Math.round((device.cycnDone / device.pcNum) * 100);
};

const getCardProps = (device) => ({
  orderName: device.deviceName,
  totalQty: device.pcNum ?? '暂无数据',
  doneQty: device.cycnDone ?? '暂无数据',
  spec: device.ta034 ?? '暂无数据',
  spen: device.ta035 ?? '暂无数据',
  progress: calcProgress(device),
  status: device.deviceStatus,
  temperature: device.et1,
  pressure: device.esipp,
  maxspeed: device.eivm,
  keeptime: device.esipt,
  stdTemperature: device.tempreture,
  stdPressure: device.pressure,
  stdMaxspeed: device.maxspeed,
  stdKeeptime: device.keeptime,
  ta006: device.ta006,
  gdNum: device.gdNum,
  device,
  machineCode: device.macCode,
  cycnDone: device.cycnDone,
  standardJp: device.standardJp,
  ecyct: device.ecyct,
  pmcPcHour: device.pmcPcHour,
  actualHour: device.actualHour,
  operationRatio: device.operationRatio,
});
========== 原布局辅助逻辑结束 ========== */

const calcTotalStandardPower = (list) => {
  return list.reduce((sum, device) => {
    const power = parseFloat(String(device.power || "0").replace("kw", "").trim());
    const hour = parseFloat(device.hourBetween || 0);
    return sum + power * hour;
  }, 0);
};

const fetchData = async () => {
  try {
    const [invokeRes, opcuaRes] = await Promise.allSettled([
      getInvokeDeviceList(),
      getOpcuaDeviceList(),
    ]);

    if (invokeRes.status === 'fulfilled' && Array.isArray(invokeRes.value?.data)) {
      invokeDevices.value = invokeRes.value.data.map(normalizeDevice);
    } else {
      console.error("智宏设备数据获取失败", invokeRes.reason);
    }

    if (opcuaRes.status === 'fulfilled' && Array.isArray(opcuaRes.value?.data)) {
      opcuaDevices.value = opcuaRes.value.data.map(normalizeDevice);
    } else {
      console.error("OPC UA设备数据获取失败", opcuaRes.reason);
    }

    const total = calcTotalStandardPower([
      ...invokeDevices.value,
      ...opcuaDevices.value,
    ]);
    powerStore.setTotalStandardPower(Number(total.toFixed(1)));
  } catch (error) {
    console.error("设备数据获取失败", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.machine-row {
  flex: 1;
  display: flex;
  gap: 0.5rem;
  min-height: 0;
  height: 100%;
  padding-top: 0.55rem;
}

/* ========== 原布局样式（恢复时取消注释）==========
.device-sections {
  display: flex;
  flex: 1;
  gap: 0.6rem;
  min-height: 0;
  height: 100%;
}

.section-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  border: 1px solid rgba(14, 165, 233, 0.55);
  border-radius: 8px;
  box-shadow:
    0 0 12px rgba(0, 234, 255, 0.15),
    inset 0 0 20px rgba(3, 16, 61, 0.35);
  background: rgba(3, 16, 61, 0.45);
  overflow: hidden;
}

.section-header {
  flex-shrink: 0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #0288d1 0%, rgb(23, 31, 75) 100%);
  border-bottom: 1px solid rgba(14, 165, 233, 0.45);
}

.section-header-text {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 8px rgba(0, 234, 255, 0.45);
}

.section-body {
  flex: 1;
  min-height: 0;
  padding: 0.45rem;
  display: flex;
  flex-direction: column;
}

.section-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-height: 0;
}

.row {
  display: flex;
  flex: 1;
  gap: 0.45rem;
  min-height: 0;
}

.row :deep(.order-card-glow) {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.row :deep(.order-card-main) {
  flex: 1;
  min-height: 0;
}

.empty-tip {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
  border: 1px dashed rgba(0, 234, 255, 0.2);
  border-radius: 8px;
}

@media (min-width: 1920px) and (max-width: 2059px) {
  .section-header {
    height: 32px;
  }

  .section-header-text {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .section-body,
  .section-grid,
  .row {
    gap: 0.35rem;
  }

  .section-body {
    padding: 0.35rem;
  }
}

@media (max-width: 1919px) {
  .section-header {
    height: 28px;
  }

  .section-header-text {
    font-size: 13px;
  }

  .section-body,
  .section-grid,
  .row {
    gap: 0.3rem;
  }

  .section-body {
    padding: 0.3rem;
  }
}

@media (max-width: 1024px) {
  .device-sections {
    flex-direction: column;
  }
}
========== 原布局样式结束 ========== */
</style>
