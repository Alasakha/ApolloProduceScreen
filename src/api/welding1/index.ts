import request from '@/utils/request'
/**
 * 添加信息
 * @param notice 通知内容
 * @param workshop 车间号
 * @param type 通知类型
 */
export function addNotice(params: { notice: string; workshop: string; type: string }) {
  return request({
    url: '/stampingWelding/addNotice',
    method: 'get',
    params,
  });
}

// 通知信息类型定义
export interface NoticeItem {
  uuid: string;
  notice: string;
  workshop: string;
  type: string;
  create_time: string;
}

/**
 * 获取通知信息（泛型版本，返回通知信息列表）
 * @param params 查询参数，如 { workshop: '1003' }
 * @returns Promise<NoticeItem[]>
 */
export function fetchNoticeList(params: { workshop: string }): Promise<NoticeItem[]> {
  return request({
    url: '/stampingWelding/selectNoticeList',
    method: 'get',
    params,
  }).then((res: any) => {
    // 假设后端返回如 {"code":200,"message":"操作成功","data":[...]}
    if (res && Array.isArray(res.data)) {
      return res.data as NoticeItem[];
    }
    return [];
  });
}

/**
 * 删除通知信息
 * @param uuid 通知的唯一标识符
 * @returns Promise<any>
 */
export function deleteNoticeByUuid(uuid: string): Promise<any> {
  return request({
    url: '/stampingWelding/delNoticeByUuid',
    method: 'get',
    params: { uuid },
  });
}

