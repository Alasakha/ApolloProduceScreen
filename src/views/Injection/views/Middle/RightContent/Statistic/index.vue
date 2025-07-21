<template>
  <div class="flex-container">
    <dv-loading v-if="loading">
      <div class="text-white">Loading...</div>
    </dv-loading>
    <div class="row" v-else v-for="(row, rowIdx) in chunkedDevices" :key="rowIdx">
      <OrderCard
        v-for="device in row"
        :key="device.macCode"
        :orderName="device.deviceName"
        :totalQty="device.pcNum ?? '暂无数据'"
        :doneQty="device.doneNum ?? '暂无数据'"
        :spec="device.ta034 ?? '暂无数据'"
        :spen="device.ta035 ?? '暂无数据'"
        :progress="calcProgress(device)"
        :status="device.deviceStatus"
        :temperature="device.et1"
        :pressure="device.esipp"
        :maxspeed="device.eivm"
        :keeptime="device.esipt"
        :stdTemperature="device.tempreture"
        :stdPressure="device.pressure"
        :stdMaxspeed="device.maxspeed"
        :stdKeeptime="device.keeptime"
        :ta006="device.ta006"
        :gdNum="device.gdNum"
        :device="device"
      />
    </div>
  </div>
</template>

<script setup>
import CustomTable from "@/components/injection/NativeTable.vue";
import { ref, onMounted, computed } from "vue";
import { getInvokeDeviceList } from "@/api/getInjection";
import OrderCard from "@/components/injection/DataCard.vue";
import { usePowerStore } from '@/store/power';
const powerStore = usePowerStore();

const deviceList = ref([]);
const loading = ref(true);
const fetchData = async () => {
  try {
    const res = await getInvokeDeviceList();
    if (res.data && Array.isArray(res.data)) {
      deviceList.value = res.data;

      // 计算总标准耗电量
      const total = res.data.reduce((sum, device) => {
        const power = parseFloat((device.power || "0").replace("kw", "").trim());
        const hour = parseFloat(device.hourBetween || 0);
        return sum + power * hour;
      }, 0);

      powerStore.setTotalPower(Number(total.toFixed(1)));
      loading.value = false;
    }
    console.log(totalStandardPower.value,'totalStandardPower.value')
  } catch (error) {
    console.error("数据获取失败", error);
  }

};

onMounted(() => {
  fetchData();
});

const chunkedDevices = computed(() => {
  const arr = [];
  for (let i = 0; i < deviceList.value.length; i += 2) {
    arr.push(deviceList.value.slice(i, i + 2));
  }
  return arr;
});

const calcProgress = device => {
  if (!device.doneNum || !device.pcNum) return 0;
  return Math.round((device.doneNum / device.pcNum) * 100);
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  width: 100%;
  padding: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  flex: 1;
  min-height: 0;
}

:deep(.order-card) {
  height: 100%;
  flex: 1;
}

@media (max-width: 1024px) {
  .row {
    flex-direction: column;
  }
}
</style>
