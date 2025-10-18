<template>
  <div class="line3-container flex">
    <!-- <TechBorderBox width="800px" height="360px">
  <div style="color:#fff;font-size:20px;">这里是内容</div>
</TechBorderBox> -->
      <dv-border-box-12 class="chart-box">
          <div class="box-title">焊接次日生产欠料</div>
        <AbnormalList></AbnormalList>
      </dv-border-box-12>
      
      <dv-border-box-12 class="chart-box">
          <div class="box-title flex justify-between items-center">
            <span>工单异常</span>
            <el-button 
              type="primary" 
              size="small" 
              @click="handleDetail"
              class="action-btn"
            >
              查看详情
            </el-button>
          </div>
          <AbnormalProduce ref="abnormalProduceRef" :prod-line="props.prodLine"/>
      </dv-border-box-12>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import AbnormalList from './ScrollTable/leftcontent.vue'
// 工单异常
import AbnormalProduce from './ScrollTable/rightcontent.vue'

// 定义 props 接收产线信息
const props = defineProps<{
  prodLine?: string | string[]
}>()

const abnormalProduceRef = ref()

// 处理查看详情按钮点击
const handleDetail = () => {
  
  if (abnormalProduceRef.value) {
    abnormalProduceRef.value.handleDetail()
  }
}
</script>

<style scoped>
.line3-container {
  padding: 0.5rem;
}

.chart-box {
  width: 100%;
  height: 25vh;
  padding: 1rem;
}

.box-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.box-title {
  display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    text-align: center;
    font-size: 0.8vw;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
}

.chart-container {
  flex: 1;
  width: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 300px;
  position: relative;
  background: #000;
}
.svg-frame{
  width: 100%;
  height: 100%;
  object-fit: fill; /* 或 contain/cover 看需求 */
}
</style> 