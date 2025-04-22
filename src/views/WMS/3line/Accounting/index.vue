<template>
  <div class="accounting">
    <dv-border-box10>
      <div class="bc h-full">
        <div class="text-center text-2xl font-bold text-white flex justify-center">
          账务处理及时率
        </div>

        <!-- 加载动画 -->
        <DvLoading v-if="isLoading" :isLoading="isLoading" />

        <!-- 数据展示区 竖向布局，确保不超过父组件高度 -->
        <div class="flex flex-col h-full p-1" v-else>
          <!-- 到货处理及时率卡片 -->
          <div class="flex-1 h-[30%] p-1" v-for="(item, index) in deliveryData" :key="index">
            <el-card class="custom-card" >
              <div slot="header" class="card-header">
                <div class="flex justify-around items-center w-full">
                  <span class="card-title w-[40%]">{{ item.plantName }}</span>
                  <div class="text-sm flex flex-row justify-around w-[60%]">
                      <div>总数: {{item.total}}</div>
                      <div>已处理数量: {{ item.jsNum }}</div>
                      <div>处理率: {{ item.rate ? item.rate : '暂未生成' }}</div>
                    </div>
                </div>
              </div>
              <div class="flex w-full justify-between">
                <el-button type="primary" size="small" class="mt-1">查看详情</el-button>
                <Countdown :targetTime="targetTime()" />
              </div>
            </el-card>
          </div>

          <!-- 采购入库处理及时率卡片 -->
          <div class="flex-1 h-[30%] p-1">
            <el-card class="custom-card">
              <div slot="header" class="card-header">
                <div class="flex justify-around items-center w-full">
                  <span class="card-title w-[40%]">采购入库处理及时率</span>
                  <div class="text-sm flex flex-row justify-around w-[60%]">
                    <div>总数: {{ procurementData.total }}</div>
                    <div>已处理数量: {{ procurementData.jsNum }}</div>
                    <div>处理率: {{ procurementData.rate != null ? procurementData.rate + '%' : '无数据' }}</div>
                  </div>
                </div>
              </div>  
                <el-button type="primary" size="small" class="mt-1">查看详情</el-button>
            </el-card>
          </div>
        </div>
      </div>
    </dv-border-box10>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { gettimelyAccountingRate } from '@/api/getWMSinfo';
import { eventBus } from '@/utils/eventbus';
import { ElCard, ElButton } from 'element-plus'; // 引入 Element Plus 的卡片组件和按钮
import Countdown from './coutdown.vue'; // 引入倒计时组件

const isLoading = ref(true);

// 到货处理及时率数据
const deliveryData = ref<any[]>([]);

// 采购入库处理及时率数据
const procurementData = reactive({
  total: 0,
  jsNum: 0,
  rate: 0
});

// 获取接口数据并处理
const fetchData = async () => {
  try {
    isLoading.value = true; // 开始加载数据时显示加载动画
    const rawData = await gettimelyAccountingRate(); // 获取数据

    const { 到货处理及时率, 采购入库处理及时率 } = rawData.data;

    // 处理到货处理及时率的数据
    deliveryData.value = 到货处理及时率.map(item => ({
      plantName: item.plantName,
      total: item.total,
      jsNum: item.jsNum,
      rate: item.rate
    }));
    console.log('到货处理及时率数据:', deliveryData.value);
    // 处理采购入库处理及时率的数据
    procurementData.total = 采购入库处理及时率.total;
    procurementData.jsNum = 采购入库处理及时率.jsNum;
    procurementData.rate = 采购入库处理及时率.rate;
    console.log('procurementData.rate:', procurementData.rate);
    // 数据加载完成后隐藏加载动画
    isLoading.value = false;
  } catch (e) {
    console.log('数据获取失败', e);
    isLoading.value = false; // 即使加载失败也隐藏加载动画
  }
};
// 设置目标时间为每天17:00
const targetTime = () => {
  const now = new Date();
  const target = new Date(now);
  target.setHours(17, 0, 0, 0); // 设置为17:00
  return target;
};
console.log('targetTime',targetTime);
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

.card-title {
  font-size: 0.7vw;
  font-weight: bold;
}

/* 自定义卡片样式 */
.custom-card {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); /* 渐变背景 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  color: white;
  transition: transform 0.3s ease-in-out; /* 平滑的放大效果 */
}

.custom-card:hover {
  transform: scale(1.05); /* 鼠标悬浮时放大 */
}


/* 按钮样式 */
.el-button {
  background-color: #3498db;
  border-color: #2980b9;
  color: white;
  font-size: 14px;
  border-radius: 6px;
}

/* 按钮悬浮状态 */
.el-button:hover {
  background-color: #2980b9;
  border-color: #1f6f9f;
}

/* 竖向布局调整 */
.bc {
  display: flex;
  flex-direction: column; /* 竖向排列 */
}

/* 确保卡片总高度不超过父容器 */
.bc .flex-1 {
  max-height: 35%; /* 每个卡片最大高度占父容器的 30% */
  overflow: hidden; /* 防止溢出 */
}

/* 横向排列标题和内容 */
.card-header {
  display: flex;
  justify-content: space-between; /* 让标题和内容分别对齐 */
  align-items: center; /* 垂直居中 */
}

.text-sm {
  gap: 5px;
}
</style>
