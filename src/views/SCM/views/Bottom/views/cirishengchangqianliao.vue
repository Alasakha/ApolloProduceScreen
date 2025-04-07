<script lang="ts" setup>
import { ref,    reactive ,onMounted, computed} from 'vue';
import {getWarningNextDay} from '@/api/getScmInfo.js'
const rawData = ref([]);
const name = ref<any>([]); // 使用 `ref` 来存储二维数组
const config = reactive({
  header: ['供应商名称', '欠料数量' ],
  data: [
  ],
  index: true,
  columnWidth: [50],
  align: ['center'],
  carousel:'page',
  waitTime:3000
})

const mouseoverHandler = (e: any) => {
  console.log(e)
}

const clickHandler = (e: any) => {
  console.log(e)
}
// 获取数据并转换
const fetchData = () => {
  getWarningNextDay()
    .then((res) => {
      rawData.value = res.data; // 保存原始数据
      // 转换数据为二维数组
      name.value = rawData.value.map((item: any) => {
        const totalNumber = parseFloat(item.total); // 确保转换为数字
        return [item.supplierName, totalNumber.toFixed(0)]; // 保留整数部分
      });
      // 将转换后的数据更新到 config.data 中
      config.data = name.value;
    })
    .catch(() => {
      console.log('数据获取失败');
    });
};

onMounted(() => {
  fetchData();
})
</script>

<template>
  <div class="qianliao h-[20vh]">
    <dv-border-box12>
      <div>
        <dv-scroll-board class="pl-4 pr-4 pt-5"
        :config="config" style="width:100%;height:18vh" @mouseover="mouseoverHandler" @click="clickHandler" />
      </div>
    </dv-border-box12>
  </div>
</template>

<style scoped>

</style>