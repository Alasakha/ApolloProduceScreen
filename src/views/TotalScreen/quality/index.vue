/<template>
  <dv-full-screen-container>
    <body>

    <dv-border-box11 :titleWidth=350 title="浙江阿波罗运动科技股份有限公司">
      <div class="box">
        <Header></Header>
        <Line2></Line2>
        <Line3></Line3>
      </div>

    </dv-border-box11>
          
  </body> 
  </dv-full-screen-container>
</template>

<script setup>
import Header from './Header/index.vue'
import Line2 from './Line2/index.vue'
import Line3 from './Line3/index.vue'


</script>


<style scoped>
body{
 
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
    url('./assets/background.jpg') no-repeat center center;
  background-size: cover;
  transform-origin: center center;
  position: relative;
  transition: transform 0.3s ease-in-out;
}
.box {
  width: 98%;
  height: 95%;
  position: relative;
  left: 1vw;
  top: 5vh;
}

.box-content {
  width: 100%;
  height:40%;
  display: flex;
  gap: 1vw;
  padding: 20px;
  padding-top:0.1vw ;
  padding-left: 0.5vw;
  padding-right: 0;
}

/* 左侧内容区域 */
.left-content {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 上方时间和标题行 */
.top-row {
  height: 15vh;
  display: flex;
}

.time-section {
  flex:1.2;
}

.title-section {
  flex: 2 ;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding-right: 8vw;
}

/* 下方数据展示区域 */
.data-section {
  flex: 1;
}

/* 右侧排行榜 */
.ranking-section {  
  flex: 1;
  height: 100%;
  margin-left: 0.5vw;
}
.logo{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

}
.logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 保持图片完整 */
}

/* 缩放适配 */
body {
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), 
    url('@/assets/background.jpg') no-repeat center center;
  background-size: cover;
  transform-origin: center center;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>