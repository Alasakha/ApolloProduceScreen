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