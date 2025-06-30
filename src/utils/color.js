//判断颜色
export const getColorByType = (status) => {
  switch (status) {
    case '质量异常':
      return 'red';  // 红色，
    case '设备异常':
      return 'yellow';  //黄色，
    case '缺料异常':
      return 'orange';  // 橘黄，
    default:
      return 'green';  // 默认颜色
  }
};


