<template>
  <dv-border-box-1 class="box1">
        
      <GlobalTitle title="当日小时产能"/>
     
     <!-- 如果正在加载，显示 loading -->
     <div v-if="isLoading" class="loading-container w-full h-full">
       <dv-loading>Loading...</dv-loading>
     </div>
     


             <!-- 数据加载完成且非空时显示图表 -->
      <div v-if="!isLoading" ref="monthlyIndicators" class="w-full h-[90%]"></div>



    </dv-border-box-1>
</template>


<script setup>
import { ref, onMounted, nextTick,onBeforeUnmount,watch  } from 'vue';
import { getColumnarHourInfo } from '@/api/getProduceinfo';
import { getEfficiencyToday} from '@/api/getProduceinfo';
import { useRoute } from 'vue-router';
import { useEcharts } from '@/utils/useEcharts';
import { eventBus } from '@/utils/eventbus';
const route = useRoute();
const prodLine = route.query.prodLine;
const isLoading = ref(true);
const isDataEmpty = ref(false);
const standard = ref(0)
const monthlyIndicators = ref(null);
const categories = ref([]);
const values = ref([]);



const  diffrentLine = (prodLine) => {
  if (prodLine === '1004') {
    return 63;
  } else if (prodLine === '2004') {
    return 27;
  }else if (prodLine === '1005') {
    return 20;
  }else if (prodLine === '2005') {
    return 13;
  }
  }
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
        },
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: {
            color: 'yellow',
            type: 'solid',
            width: 2
          },
          label: {
            show: true,
            formatter: '标准小时产能: {c}',
            color: 'yellow',
            fontSize: 12,
            fontWeight: 'bold',
            position: 'middle', // 可设为 'start' / 'middle' / 'end'
          },
          data: [
            {
              yAxis:  standard.value,
              name: '标准小时产能'
            }
          ]
        }
      }
    ]
  };

  setOption(option);
};

const fetchData = () => {
  getColumnarHourInfo(prodLine)
    .then(res => {
  
      const data = res.data;
      if (Object.keys(data).length === 0) {
        isDataEmpty.value = true;
      } else {
        isDataEmpty.value = false;
        categories.value = Object.keys(data);
        values.value = Object.values(data);

        nextTick(() => {
       
          getEfficiencyToday(prodLine).then(res => {
          standard.value = Math.round(res.data.standardEfficiency * diffrentLine(prodLine)) || 0;
          initChart();
          drawChart();
        });
        isLoading.value = false;
        });
      }
    })
    .catch(() => {
      isLoading.value = false;
      isDataEmpty.value = true;
    });
  // 获取标准小时产能

};

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
  width: 25%;
  height: 20vw;
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: aliceblue;
}

.content {
  display: flex;
  justify-content: space-between;
  height: 90%;
  margin-top: 2vh;
}

.production-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  font-size: 30px;
  padding: 10px 0; /* 上下增加一些 padding */
}

.row {
  display: flex;
  justify-content: start; /* 让内容分散一点 */
  height: 60%;
  /* gap: 30px; 增大间距 */
  /* margin-bottom: 2vh; 让两行之间间隔更大 */
}



</style>