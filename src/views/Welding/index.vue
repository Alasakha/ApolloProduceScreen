<template>
  <div class="stamp-container">
    <!-- 顶部统计信息 -->
    <StampHeader />
    
    <!-- 三列布局的主要内容区域 -->
    <div class="main-content">
      <!-- 左列：松下自动焊 -->
      <div class="column">
        <h2 class="column-title">焊接线（松下自动焊）</h2>
        <ProductionLine 
          type="matsushita"
          :sections="['车架', '后叉', '尾架']"
          :showStations="true"
        />
      </div>

      <!-- 中列：老自动焊 -->
      <div class="column">
        <h2 class="column-title">焊接线（老自动焊）</h2>
        <ProductionLine 
          type="old"
          :sections="['车架', '后叉', '尾架']"
          :showStations="false"
        />
      </div>

      <!-- 右列：手工焊 -->
      <div class="column">
        <h2 class="column-title">焊接线（手工焊）</h2>
        <div class="right-column">
          <ProductionLine 
            type="manual"
            :sections="['车架', '后叉', '尾架', '脚撑']"
            :showStations="false"
            :showQualityRate="true"
          />
          <StaffingInfo />
        </div>
      </div>
    </div>

    <!-- 底部异常信息 -->
    <div class="bottom-section">
      <AbnormalInfo />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StampHeader from './components/StampHeader.vue'
import ProductionLine from './components/ProductionLine.vue'
import StaffingInfo from './components/StaffingInfo.vue'
import AbnormalInfo from './components/AbnormalInfo.vue'
</script>

<style scoped>
.stamp-container {
  width: 100%;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #1a1a1a;
}

.main-content {
  display: flex;
  gap: 20px;
  flex: 1;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.column-title {
  color: #fff;
  font-size: 1.2rem;
  margin: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  text-align: center;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
}

.bottom-section {
  margin-top: auto;
}
</style> 