
<template>
 <!-- 如果正在加载，显示 loading -->
 <div v-show="!isLoading" class="h-[100%] w-full">
 <div v-if="isLoading" class="loading-container">
        <dv-loading>Loading...</dv-loading>
      </div>
      
      <!-- 数据加载完成且非空时显示图表 -->
      <div v-show="!isLoading" ref="dailyIndicators" class="charts h-[27vh] w-[30vw]" ></div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getBadCategory } from '@/api/getInjection';
import { eventBus } from '@/utils/eventbus';
import { formatPieChartData } from '@/utils/map';
import { getColorByType } from '@/utils/color';

const BadCategoryIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const Data = ref({ faultType: [] });
const total = ref([]);

const dailyIndicators = ref(null);
// Loading 和 数据为空的状态

const drawDailyIndicators = (formattedData) => {
  const dailyIndicatorsElement = echarts.init(dailyIndicators.value);
  console.log('dailyIndicators:', dailyIndicators.value);
  const option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '0%',
    left: 'center',
    itemGap: 20,  // 设置图例项之间的间距
    textStyle: {
      color: '#fff', // 设置图例字体颜色为白色
      fontSize: 13,  // 设置图例文字大小
    },
    itemWidth: 15,   // 设置图例标记的宽度
    itemHeight: 10   // 设置图例标记的高度
  },
  series: [
    {
      name: '本日生产异常数量',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: true,
        position: 'outside', // 标签显示在外侧
        formatter: '{b}:{c}', // 格式化标签内容，显示名称、数值和百分比
        fontSize: 12, // 设置标签字体大小
        color: '#fff' // 设置标签字体颜色
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 10,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true,      // 使线条显示
        length: 8,      // 设置线条的第一段长度
        length2: 4,     // 设置线条的第二段长度
        lineStyle: {
          color: '#fff', // 设置线条颜色
          width: 1,      // 设置线条宽度
          type: 'solid'  // 设置线条类型
        }
      },
      data: formattedData // 使用传递过来的数据
    }
  ]
};


  dailyIndicatorsElement.setOption(option);
};

const processData = (data) => {
  let formattedData = formatPieChartData(data, 'guZhangTypeName', 'total');
  formattedData = formattedData.map((item) => ({
  ...item,
  value: parseInt(item.value, 10), // 将字符串转换为整数
}));
  console.log('formattedData1',formattedData);
  if (formattedData.length === 0) {
    isDataEmpty.value = true;  // 如果没有数据，设置为空数据状态
    formattedData = [{ value: 0, name: '暂无异常', itemStyle: { color: '#009966' } }]; // 设置一个绿色的数据点
  } else {
    isDataEmpty.value = false;
  }
   // 为每个数据项设置颜色
   formattedData.forEach(item => {
      item.itemStyle = {
        color: getColorByType(item.name)  // 根据名称设置颜色
      };
    });
  nextTick(() => {
    if (dailyIndicators.value) {
      drawDailyIndicators(formattedData);
    } else {
    }
  });
};

const fetchData = () => {
  getBadCategory()
    .then(res => {
      isLoading.value = false;   // 加载完成，关闭 loading 状态
      processData(res.data.faultType);  // 处理数据
      console.log(isDataEmpty.value);
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;  // 如果请求失败，设置为空数据状态
      processData([]); // 处理空数据
    });
}

// 在组件挂载时启动定时获取数据
onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on("refreshData", fetchData); // 监听全局刷新事件
});

// 清理定时器，避免组件卸载后定时器继续执行
onBeforeUnmount(() => {
  eventBus.off("refreshData", fetchData); // 组件销毁时取消监听
});
</script>

<style scoped>
.box1 {
  position: relative;
  width: 35%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: aliceblue;
  padding: 20px;
}

h2 {
  position: absolute;
  top: 0.5vh;
  left: 1vw;
  margin: 0;
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 10px;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 让 h2 和图表上下排列 */
  align-items: center;
  justify-content: center; /* 居中饼图 */
}

.wrapper div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; 
  font-size: 2vw; 
  letter-spacing: 0.2vw;
}
</style>