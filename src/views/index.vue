<template>
  <body>
    
  
  <div class="center-box">
    <img :src="motorImage" style="width: 30%;" mode="widthFix" />
  <div class="title">
    <h1>阿波罗管理看板</h1>
    <h2>请选择看板</h2>
  </div>

  <div class="button_box">
    <div class="block text-center w-full" m="t-4" >

      <el-carousel trigger="click" height="20vh" :interval="3000">
        <!-- 走马灯第 1 组：前 5 个 -->
        <el-carousel-item>
          <div class="small justify-center h-[200px] flex items-center gap-4">
            <button
              v-for="line in getRange(0, 5)"
              :key="line.id"
              class="custom-btn btn-5 w-[120px] h-[50px]"
              @click="selectLine(line)"
            >
              {{ line.name }}
            </button>
          </div>
        </el-carousel-item>

        <!-- 走马灯第 2 组：第 5 ~ 8 个 -->
        <el-carousel-item>
          <div class="small justify-center h-[200px] flex items-center gap-4">
            <button
              v-for="line in getRange(5, 13)"
              :key="line.id"
              class="custom-btn btn-5 w-[120px] h-[50px]"
              @click="selectLine(line)"
            >
              {{ line.name }}
            </button>
          </div>
        </el-carousel-item>

        <!-- 走马灯第 3 组：第 8 ~ 11 个 -->
        <el-carousel-item>
          <div class="small justify-center h-[200px] flex items-center gap-4">
            <button
              v-for="line in getRange(13, 14)"
              :key="line.id"
              class="custom-btn btn-5 w-[120px] h-[50px]"
              @click="selectLine(line)"
            >
              {{ line.name }}
            </button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</div>

</body>
</template>

<script setup >

import motorImage from '../assets/Motor.jpg';
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const lines = ref([
  { id: "1004A", name: "生产线1004A",router:"S" },
  { id: "1004B", name: "生产线1004B",router:"S" },
  { id: "1004C", name: "生产线1004C",router:"S" },
  { id: "1005A", name: "生产线1005A",router:"S" },
  { id: "1005B", name: "生产线1005B",router:"S" },
  { id: "1004", name: "1004生产计划",router:"P" },
  { id: "1005", name: "1005生产计划",router:"P"},
  { id: "2004", name: "2004生产计划",router:"P" },
  { id: "2005", name: "2005生产计划",router:"P" },
  { id: "2004", name: "2004质量检测",router:"Q" },
  { id: "2005", name: "2005质量检测",router:"Q" },
  { id: "1004", name: "1004质量检测",router:"Q" },
  { id: "1005", name: "1005质量检测",router:"Q" },
  { id: null, name: "注塑看板",router:"/injection" },
]);

// 获取 lines 中指定范围的数据
const getRange = (start, end) => {
  return lines.value.slice(start, end);
};

const selectLine = (line) => {
  if(line.router == 'S'){
    router.push({ path: "/screen", query: { prodLine: line.id } });
  }
  else if(line.router == 'P'){
    router.push({ path: "/project", query: { prodLine: line.id } });
  }else if(line.router == 'Q'){
    router.push({ path: "/quality", query: { prodLine: line.id } });
  }else{
    router.push({ path: line.router, query: { prodLine: line.id } });
  }
 
};

</script>

<style scoped>
body{
  background-color: rgb(14, 12, 25);
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-btn {
  width: 130px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
              7px 7px 20px 0px rgba(0, 0, 0, 0.1),
              4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
}
.button_box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 40%;
  width: 100%;
}
.title {
  position: absolute;  /* 绝对定位 */
  top: 20px;           /* 距离顶部 20px */
  left: 55%;           /* 居中对齐 */
   transform: translateX(-50%); /* 修正水平居中 */
  text-align: center;
  width: 100%;
  color:aliceblue;
  letter-spacing: 3em;
  font-family: 'Microsoft YaHei';
}



.btn-5 {
  width: 8vw;
  height: 8vh;
  line-height: 42px;
  padding: 0;
  border: none;
  background: aliceblue;
  color: #000000;
  font-size: 1vw;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
}
.btn-5:hover {
  color: aliceblue;
  background: transparent;
  box-shadow: none;
}
.btn-5:before,
.btn-5:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 2px;
  width: 0;   
  background: aliceblue;
  box-shadow: -1px -1px 5px 0px #fff,
              7px 7px 20px 0px #0003,
              4px 4px 5px 0px #0002;
  transition: 400ms ease all;
}
.btn-5:after {
  right: inherit;
  top: inherit;
  left: 0;
  bottom: 0;
}
.btn-5:hover:before,
.btn-5:hover:after {
  width: 100%;
  transition: 800ms ease all;
}

.center-box {
  width: 80%;
  height: 90%;
  position: relative;  /* 让 `.title` 绝对定位时相对于 `.center-box` */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  justify-content: flex-start; /* 上对齐 */
  background-color: rgb(33, 29, 49);
  border-radius: 10px;  
}


.motor-image {
  width: 30%;
  display: block;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3); /* 添加阴影 */
  border-radius: 5px; /* 可选，增加圆角 */
}
image {
  width: 15%;
  height: 15%;
  z-index: 100;
}

h1{
  font-size: 7vw;
  margin-bottom: 0;
}
h2{
  margin-top: 0;
  font-size: 3vw;
} 

.custom-btn {
  background-color: aliceblue;
  color: black;
  border: 2px solid black;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.button_box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>