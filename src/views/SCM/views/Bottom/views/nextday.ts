export  const getNextDay = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // 将日期增加一天
  
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 获取月份，月份从0开始，因此加1
    const day = String(today.getDate()).padStart(2, '0'); // 获取日期，确保日期格式为两位数
  
    return `${year}-${month}-${day}`; // 格式化为 yyyy-MM-dd 格式
  };