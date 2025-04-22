<template>
  <div class="accounting">
      <dv-border-box10>
          <div class="bc h-[22vh]">
              <div class="text-center text-2xl font-bold text-white flex justify-center">仓库呆滞物料预警前置15天</div>
              
              <!-- 只在 isLoading 为 true 时显示加载动画 -->
              <DvLoading class="h-full" v-if="isLoading" :isLoading="isLoading " />
              
              <!-- 只有在 isLoading 为 false 时才显示图表内容 -->
              <div class="flex h-full p-1" v-else>
                  <div
                    class="flex-1 h-full p-1"
                    v-for="warehouse in warehouseList"
                    :key="warehouse"
                  >
                      <!-- 仓位标题 -->
                      <div class="warehouse-title text-white text-xl font-bold text-center mb-2">
                        {{ warehouse }}
                      </div>
                      <dv-scroll-board
                        :config="warehouseConfigs[warehouse]"
                        class="w-full pt-0"
                      />
                  </div>
              </div>
          </div>
      </dv-border-box10>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { getstagnantMaterial } from '@/api/getWMSinfo';
import { eventBus } from '@/utils/eventbus';
import { handleData, groupByWarehouse, formatWarehouseData } from './getdifferentData';

// 控制加载状态
const isLoading = ref(true);

// 配置模板
const configTemplate = {
header: ['物料名称', '呆滞金额'],
data: [] as string[][], 
index: true,
columnWidth: [50, 100, 80],
align: ['center'],
headerBGC: '#402E7A',
evenRowBGC: '#4C3BCF',
oddRowBGC: '#4B70F5',
};

// 仓库相关数据
const warehouseList = ref<string[]>([]);
const warehouseConfigs = reactive<Record<string, typeof configTemplate>>({});

// 获取数据并处理
const fetchData = async () => {
try {
  isLoading.value = true; // 开始加载数据时显示加载动画
  const rawData = await getstagnantMaterial(); // 获取数据

  const flatData = handleData(rawData.data);

  const groupedData = groupByWarehouse(flatData);

  // 提取仓库列表
  warehouseList.value = Object.keys(groupedData);

  // 生成每个仓库的配置
  warehouseList.value.forEach(warehouse => {
    warehouseConfigs[warehouse] = {
      header: ['物料名称', '呆滞数量'],
      data: formatWarehouseData(groupedData[warehouse]),
      index: true,
      columnWidth: [50, 100, 100],
      align: ['center'],
      headerBGC: '#402E7A',
      evenRowBGC: '#4C3BCF',
      oddRowBGC: '#4B70F5'
    };
  });

  // 数据加载完成后隐藏加载动画
  isLoading.value = false; 

} catch (e) {
  console.log('数据获取失败', e);
  isLoading.value = false; // 即使加载失败也隐藏加载动画
}
};

// 页面挂载时获取数据
onMounted(() => {
eventBus.on('refreshData', fetchData); // 监听刷新事件
fetchData(); // 初始加载数据
});

// 组件卸载时移除全局事件监听
onBeforeUnmount(() => {
eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
.accounting {
padding: 0.5vw;
font-family: Arial, sans-serif;
}
</style>
