<template>
    <div class="question">
        <dv-border-box10>
            <div ref="chartRef" class="w-full h-96"></div>
    </dv-border-box10>
      
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import 'echarts-gl'; // 👈 一定要引！

const chartRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (chartRef.value) {
    const myChart = echarts.init(chartRef.value);

    const option = {
      tooltip: {},
      backgroundColor: '#000', // 背景色
      visualMap: {
        max: 100,
        inRange: {
          color: ['#87aa66', '#eba438', '#d94d4c']
        }
      },
      xAxis3D: {
        type: 'category',
        data: ['苹果', '香蕉', '橘子', '西瓜']
      },
      yAxis3D: {
        type: 'category',
        data: ['第一季度', '第二季度', '第三季度', '第四季度']
      },
      zAxis3D: {
        type: 'value'
      },
      grid3D: {
        boxWidth: 200,
        boxDepth: 100,
        light: {
          main: {
            intensity: 1.2,
            shadow: true
          },
          ambient: {
            intensity: 0.3
          }
        },
        viewControl: {
          autoRotate: true, // 👈 自动旋转，非常炫酷
          autoRotateSpeed: 20
        }
      },
      series: [
        {
          type: 'bar3D',
          data: [
            ['苹果', '第一季度', 50],
            ['苹果', '第二季度', 80],
            ['香蕉', '第一季度', 60],
            ['香蕉', '第三季度', 70],
            ['橘子', '第四季度', 90],
            ['西瓜', '第二季度', 30],
            ['西瓜', '第三季度', 55]
          ],
          shading: 'lambert',
          label: {
            show: false,
            textStyle: {
              fontSize: 16,
              borderWidth: 1
            }
          },
          emphasis: {
            label: {
              fontSize: 20,
              color: '#900'
            },
            itemStyle: {
              color: '#f90'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', () => {
      myChart.resize();
    });
  }
});



</script>