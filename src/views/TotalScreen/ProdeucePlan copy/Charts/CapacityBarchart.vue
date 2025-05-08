<template>
  
  <dv-border-box-9 class="box1">
    <div class="wrapper">
     <h2>当日小时产能趋势图</h2>
     
     <!-- 如果正在加载，显示 loading -->
     <div v-if="isLoading" class="loading-container">
       <dv-loading>Loading...</dv-loading>
     </div>
     
     <!-- 如果没有数据，显示暂无数据 -->
     <div v-if="!isLoading && isDataEmpty" class="empty-container">
       暂无数据
     </div>
     
     <!-- 数据加载完成且非空时显示图表 -->
      <div v-if="!isLoading && !isDataEmpty" ref="monthlyIndicators" style="margin-top: 5vh;"></div>

    </div>
  </dv-border-box-9>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { getColumnarHourInfo } from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { useEcharts } from '@/composables/useEcharts';

const route = useRoute();
const prodLine = route.query.prodLine;
const isLoading = ref(true);
const isDataEmpty = ref(false);

const monthlyIndicators = ref(null);
const categories = ref([]);
const values = ref([]);

const { initChart, setOption } = useEcharts(monthlyIndicators);

const drawChart = () => {
  const option = {
    xAxis: {
      type: 'category',
      data: categories.value,
      axisLabel: {
        interval: 0,
        color: '#fff',
        fontSize: 12
      },
      name: '时间 (小时)',
      nameLocation: 'middle',
      nameTextStyle: {
        color: '#fff',
        fontSize: 10,
        padding: [15, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff',
        fontSize: 15
      },
      lineStyle: {
        color: '#33ccff',
        width: 20,
        type: 'dashed'
      }
    },
    series: [
      {
        data: values.value,
        type: 'bar',
        itemStyle: {
          color: '#3498db'
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      {
        data: values.value,
        type: 'line',
        itemStyle: {
          color: 'orange'
        },
        label: {
          show: false
        }
      }
    ]
  };

  setOption(option);
};

const fetchData = () => {
  getColumnarHourInfo(prodLine)
    .then(res => {
      isLoading.value = false;
      const data = res.data;
      if (Object.keys(data).length === 0) {
        isDataEmpty.value = true;
      } else {
        isDataEmpty.value = false;
        categories.value = Object.keys(data);
        values.value = Object.values(data);
        nextTick(() => {
          initChart();
          drawChart();
        });
      }
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;
    });
};

onMounted(() => {
  fetchData();
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wrapper div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20vh; /* 增加最小高度 */
}

/* 加载中的样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
}

/* 数据为空的提示样式 */
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
