<template>
  <div class="data-card">
    <div class="title">{{ title }}</div>
    <!-- <div class="number">{{ value }} {{ unit }}</div> -->
    <div class="content" >
    <div class="content-item">
      <p class="smalltitle" style="text-align: center;">{{smalltitle1}}</p>
      <dv-decoration-9 style="width: 5vw;height: 9vh">
      <div color-green font-600 class="content" bg="~ dark/0">
        {{value1}}{{ unit1 }}
      </div>
    </dv-decoration-9>
    </div>

    <div class="content-item">
      <p class="smalltitle" style="text-align: center;">{{smalltitle2}}</p>
    <dv-decoration-9 style="width: 5vw;height: 9vh">
      <div color-green font-600 cl  ass="content" bg="~ dark/0">
        {{value2}}{{ unit2 }}
      </div>
    </dv-decoration-9>
    </div>
    
  </div>
  </div>
</template>

<script setup>


defineProps({
  title: String,  // 标题
  value1: [String, Number],  // 数值
  unit1: { type: String, default: "" },  // 单位（可选）
  value2: [String, Number],  // 数值
  unit2: { type: String, default: "" },  // 单位（可选）
  smalltitle1: { type: String, default: "" },  // 小标题（可选）
  smalltitle2: { type: String, default: "" }  // 小标题（可选）
});
</script>

<style scoped>
.content{
  display: flex;
  flex-direction: row;
  justify-content:space-around;
  align-items: center;
  width: 100%;
}
.smalltitle{
  color:aliceblue;
  font-size: 1vw;
}
.content-item{
  display: flex;
  align-content: center;
  justify-content: center;
}
.data-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  font-size: 1vw;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  height: 90%;
}

.title {
  font-size: 1vw;
  font-weight: bold;
  margin-bottom: 5px;
}

.number {
  font-size: 22px;
  color: #ffdd57;
}
.content{
    font-size: 1.5vw;
    text-shadow: 0 0 3px #7acaec;
    color: aqua;
    z-index: 10000;
  }
</style>
