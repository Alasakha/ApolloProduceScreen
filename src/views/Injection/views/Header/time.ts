import { ref, onMounted, onBeforeUnmount } from "vue";

export function useDateTime() {
  const dateStr = ref("");
  const timeStr = ref("");
  const weekStr = ref(""); // ✅ 这里补充定义 weekStr
  let timeTrim: ReturnType<typeof setInterval> | null = null;

  // 获取当前日期、时间的函数
  const getNowFormatDate = () => {
    const date = new Date();
    let month: string | number = date.getMonth() + 1;
    let strDate: string | number = date.getDate();
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();

    // 补零处理
    month = month < 10 ? `0${month}` : month;
    strDate = strDate < 10 ? `0${strDate}` : strDate;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    // 获取星期
    const weekArray = ["日", "一", "二", "三", "四", "五", "六"];
    const week = date.getDay();
    const weekDay = `星期${weekArray[week]}`;

    // 分别设置日期和时间
    dateStr.value = `${date.getFullYear()}年${month}月${strDate}日`;
    timeStr.value = `${hours}:${minutes}`;
    weekStr.value = `${weekDay}`
  };

  // 初始化时间
  getNowFormatDate();

  onMounted(() => {
    timeTrim = setInterval(() => {
      getNowFormatDate();
    }, 5000);
  });

  onBeforeUnmount(() => {
    if (timeTrim) {
      clearInterval(timeTrim);
    }
  });

  return { dateStr, timeStr, weekStr };
}
