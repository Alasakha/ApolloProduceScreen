import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDeviceStatus } from '@/api/getInjection';

let timer: ReturnType<typeof setInterval> | null = null;


export const useDeviceStatusStore = defineStore('deviceStatus', () => {
  const data = ref<Record<string, number>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchDeviceStatus = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await getDeviceStatus();
      data.value = res.data || {};
    } catch (err) {
      console.error('接口请求失败:', err);
      error.value = '加载失败';
    } finally {
      isLoading.value = false;
    }
  };

  // 启动定时刷新
  const startPolling = () => {
    if (timer) return; // 避免重复启动
    fetchDeviceStatus(); // 立即拉一次
    timer = setInterval(fetchDeviceStatus, 5 * 60 * 1000); // 每五分钟请求一次
  };

  const stopPolling = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchDeviceStatus,
    startPolling,
    stopPolling,
  };
});
