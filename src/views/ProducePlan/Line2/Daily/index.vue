<template>
  <div class="day">
    <dv-border-box12>
      <div dv-bg class="day-title">
        日生产计划进度
      </div>
      <div class="day-table-wrap">
        <table class="day-table">
          <tbody>
            <tr v-for="(item, idx) in dayList" :key="idx">
              <td class="plan-label">{{ item.name }}</td>
              <td>计划数：</td>
              <td class="plan-value">{{ item.plan }}</td>
              <td>完成数：</td>
              <td class="plan-value">{{ item.done }}</td>
              <td>完成率：</td>
              <td class="plan-value">{{ item.rate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </dv-border-box12>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getTodayProductionInfo } from '@/api/getProduceinfo';
// import { getTodayProduction } from '@/api/getStampWeldinfo';
import { eventBus } from '@/utils/eventbus';

const dayList = ref([
  { name: '一部焊接：', plan: '', done: '', rate: '' },
  { name: '二部焊接：', plan: '', done: '', rate: '' },
  { name: '一课包装：', plan: '', done: '', rate: '' },
  { name: '二课包装：', plan: '', done: '', rate: '' },
  { name: '一课总装：', plan: '', done: '', rate: '' },
  { name: '二课总装：', plan: '', done: '', rate: '' },
 
]);

const prodLines = {
  '一课包装：': '1005',
  '二课包装：': '2005',
  '二课总装：': '2004',
  '一课总装：': '1004',
  '一部焊接：': '1002',
  '二部焊接：': '2002'
};

const fetchData = async () => {
  try {
    const results = await Promise.all(
      dayList.value.map(async (item) => {
        const line = prodLines[item.name];
        if (!line) return item;
        
        const res = await getTodayProductionInfo(line);
        return {
          ...item,
          plan: res.data.pcTotal || 0,
          done: res.data.done || 0,
          rate: res.data.rate ? `${res.data.rate}` : '0'
        };
      })
    );
    
    dayList.value = results;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
};

onMounted(() => {
  fetchData();
  eventBus.on('refreshData', fetchData);
});

onBeforeUnmount(() => {
  eventBus.off('refreshData', fetchData);
});
</script>

<style scoped>
.day {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.day-title {
  display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    text-align: center;
    font-size: 1vw;
    font-weight: bold;
    margin: 1vh 0 0.5vh 0;
    color: #fff;
    letter-spacing: 0.3vw;
    text-shadow: 0 0.3vh 1vw #000, 0 0 0.2vw #00bfff;
    border-bottom: 0.3vh solid #00bfff;
    padding-bottom: 0.5vh;
}
.day-table-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}
.day-table {
  background: rgba(0, 32, 64, 0.55);
    border-radius: 1vw;
    padding: 1vh 1vw;
    font-size: 1vw;
    color: #fff;
    min-width: 40vw;
    box-shadow: 0 0.8vh 3vw 0 rgba(0,0,0,0.25);
}
.day-table tr {
  border-bottom: 0.2vh solid rgba(0,191,255,0.18);
  height: 4.5vh;
}
.day-table tr:last-child {
  border-bottom: none;
}
.plan-label {
  font-weight: bold;
  padding-right: 1vw;
  text-align: left;
  white-space: nowrap;
  color: #00eaff;
  font-size: 1.2em;
  text-shadow: 0 0.2vh 1vw #003366;
}
.plan-value {
  min-width: 4vw;
  text-align: left;
  padding-right: 1.5vw;
  color: #fff;
  font-weight: 500;
}
</style>