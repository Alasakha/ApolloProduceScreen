import dayjs from 'dayjs';
import { getAbnormalUnfinishedList } from '@/api/getProduceinfo';


/**
 * 获取工单结案率数据
 * @param {string | number} prodLine - 产线 ID
 * @returns {Promise<any>} - 返回接口数据
 */



export async function fetchClosingRateData(prodLine:string) {
  const dateTimeStart = dayjs().startOf('month').format('YYYYMMDD'); // 本月1号
  const dateTimeStop = dayjs().subtract(1, 'day').format('YYYYMMDD'); // 昨天

const workCenter = mapProdLineToWorkCenter(prodLine)
console.log(workCenter,prodLine)

  try {
    // const formData = new FormData();
    // formData.append('dateTimeStart', dateTimeStart);
    // formData.append('dateTimeStop', dateTimeStop);
    // formData.append('workCenter', workCenter);

    // 调用封装的接口
    const response = await getAbnormalUnfinishedList(workCenter,dateTimeStart,dateTimeStop);
    return response.data;  // 返回响应数据
  } catch (error) {
    console.error('Error fetching closing rate data:', error);  // 错误处理
    throw error;  // 抛出错误
  }
}


/**
 * 映射产线 ID 到工作中心名称
 */
function mapProdLineToWorkCenter(prodLine: string | number): string {
  switch (prodLine) {
    case '1004':
      return '汽油车组装车间';
    case '1005':
      return '汽油车包装车间';
      case '2004':
        return '电动车组装';
        case '2005':
            return '电动包装车间';
            case '1001':
              return '冲压车间';
              case 'ZS':
                return '注塑车间';
                    case '1003':
                return '焊接车间'
  }
}
