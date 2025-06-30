<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const prodLine = route.query.prodLine; // 通过 query 获取参数

const name = (prodLine) => {
  if (prodLine === '1004') {
    return '一课装配';
  } else if (prodLine === '1005') {
    return '一课包装';
  }else if (prodLine === '2004') {
    return '二课装配';
  }else if (prodLine === '2005') {
    return '二课包装';
  }
}

</script>

<template>
<div class="title title-main flex justify-center items-center">{{name(prodLine)}}生产管理看板</div>
</template>

<style scoped>
.title {
  font-size: 1.5vw;
  color: white;
}

.title-main {
  font-size: 2vw; /* 设置标题行的字体更大 */
  font-weight: bold; /* 设置标题为加粗 */
  letter-spacing: 0.5vw ; /* 增加字间距 */
}
</style>