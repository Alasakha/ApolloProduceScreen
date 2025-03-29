export function convertDateFormat(dateMap) {
  const result = [];

  for (const key in dateMap) {
    if (Object.prototype.hasOwnProperty.call(dateMap, key)) {
      const dateStr = dateMap[key];
      const month = dateStr.slice(4, 6).replace(/^0/, ''); // 去掉前导 0
      const day = dateStr.slice(6).replace(/^0/, '');
      result[key] = `${month}.${day}`;
    }
  }

  return result;
}

export function convertXXXXYYZZtoYYZZ(inputDate) {
  const date = new Date(inputDate);
  const month = date.getMonth() + 1; // 获取月份（0为1月，所以要加1）
  const day = date.getDate(); // 获取日期
  return `${month}-${day}`;
}


