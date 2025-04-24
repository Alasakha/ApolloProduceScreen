/**
 * 根据生产线 prodLine 和柱状图值返回对应的柱状图颜色
 * @param prodLine - 生产线标识
 * @param value - 柱状图的值
 * @returns 对应的颜色值（字符串）
 */
const intervalcolor1 = '#339966	'; // 深绿色（高区间）
const intervalcolor2 = '#ff7c00'; // 橙色（中区间） 
const intervalcolor3 = '#FF0000'; // 红色（低区间）


export const getBarColor = (prodLine: string, value: number): string => {
    switch (prodLine) {
      case '1004A':
        if (value >= 75) {
          return intervalcolor1; // 深蓝色（高区间）
        } else if (value >= 70) {
          return intervalcolor2; // 浅蓝色（中区间）
        } else {
          return intervalcolor3; // 橙色（低区间）
        }
        case '2005':
            if (value >= 98.5) {
              return intervalcolor1; // 深蓝色（高区间）
            } else if (value >= 95) {
              return intervalcolor2; // 浅蓝色（中区间）
            } else {
              return intervalcolor3; // 橙色（低区间）
            }
       case '2004':
           if (value >= 92) {
             return intervalcolor1; // 深蓝色（高区间）
           } else if (value >= 80) {
             return intervalcolor2; // 浅蓝色（中区间）
           } else {
             return intervalcolor3; // 橙色（低区间）
           }
           case '1005':
            if (value >= 98.5) {
              return intervalcolor1; // 深蓝色（高区间）
            } else if (value >= 95) {
              return intervalcolor2; // 浅蓝色（中区间）
            } else {
              return intervalcolor3; // 橙色（低区间）
            }  
      default:
        if (value >= 90) {
          return intervalcolor1; // 深绿色（高区间）
        } else if (value >= 80) {
          return intervalcolor2; // 浅绿色（中区间）
        } else {
          return intervalcolor3; // 黄绿色（低区间）
        }
    }
  };