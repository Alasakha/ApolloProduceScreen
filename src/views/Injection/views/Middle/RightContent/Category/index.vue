<template>
  <!-- 数据加载完成且非空时显示图表 -->
  <div v-show="!isLoading" class="h-[100%] w-full">
    <div ref="BadCategoryIndicators" class="h-[27vh] w-[30vw]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { getBadCategory } from '@/api/getInjection';
import { eventBus } from '@/utils/eventbus';

const BadCategoryIndicators = ref(null);
const isLoading = ref(true);
const isDataEmpty = ref(false);
const Data = ref({ faultType: [] }); // 初始化数据
const total = ref([]); // 用于存储总数

// 预设所有可能的故障类型名称和对应的颜色
const allGuZhangTypes = ['缺料异常', '设备异常', '质量异常'];
const guZhangTypeColors = {
  '缺料异常': '#FF6347', // 红色
  '设备异常': '#FFA500', // 橙色
  '质量异常': '#FFD700', // 黄色
};

// 图表绘制函数
const drawBadCategoryIndicators = () => {
  if (!BadCategoryIndicators.value) return;

  const BadCategoryIndicatorsElement = echarts.init(BadCategoryIndicators.value);

  // 过滤掉值为 0 的数据
  const validData = allGuZhangTypes
    .map((type, index) => ({
      value: total.value[index],
      name: type,
    }))
    .filter((item) => item.value > 0); // 只保留值大于 0 的数据

  let option;

  if (validData.length === 0) {
    // 当 validData 为空时，显示绿色饼图和“暂无数据”标签
    option = {
      title: {
        text: '',
        left: 'center',
        top: 'center',
      },
      tooltip: {
        show: false, // 不显示提示框
      },
      series: [
        {
          name: '暂无数据',
          type: 'pie',
          radius: ['40%', '70%'], // 饼图的半径
          data: [
            { value: 1, name: '暂无数据' }, // 设置一个默认数据
          ],
          itemStyle: {
            color: '#16a662', // 设置饼图为绿色
          },
          label: {
            show: true,
            position: 'center', // 标签显示在中心
            formatter: '暂无数据', // 显示“暂无数据”
            fontSize: 20,
            fontWeight: 'bold',
            color: '#16a662', // 标签字体颜色为绿色
          },
        },
      ],
    };
  } else {
    // 正常显示数据的配置
    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)', // 显示名称、值和百分比
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: 'rgb(83, 234, 239)', // 设置图例的字体颜色为蓝色
        },
      },
      series: [
        {
          name: '异常类型分布',
          type: 'pie',
          radius: ['40%', '70%'], // 饼图的半径
          data: validData, // 使用过滤后的数据
          itemStyle: {
            color: (params) => guZhangTypeColors[params.name], // 根据类型设置颜色
          },
          label: {
            show: true,
            position: 'outside', // 标签显示在外侧
            formatter: '{b}:{c}', // 格式化标签内容，显示名称、数值和百分比
            fontSize: 12, // 设置标签字体大小
            color: '#fff', // 设置标签字体颜色
          },
        },
      ],
    };
  }

  // 设置图表
  BadCategoryIndicatorsElement.setOption(option);
};

// 获取数据并处理
const fetchData = async () => {
  try {
    const res = await getBadCategory();
    isLoading.value = false;
    Data.value = res.data.faultType;

    // 根据所有预设的故障类型名称填充缺失的数据
    total.value = allGuZhangTypes.map((type) => {
      const data = Data.value.find((item) => item.guZhangTypeName === type);
      return data ? parseInt(data.total, 10) : 0; // 如果没有返回数据，设置为 0
    });

    nextTick(drawBadCategoryIndicators); // 在 DOM 更新后绘制图表
  } catch (error) {
    console.error('数据获取失败:', error);
    isLoading.value = false;
    isDataEmpty.value = true;
  }
};

onMounted(() => {
  fetchData(); // 组件挂载时先请求一次
  eventBus.on('refreshData', fetchData); // 监听全局刷新事件
});

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData); // 组件销毁时取消监听
});
</script>

<style scoped>
/* 添加样式 */
</style>