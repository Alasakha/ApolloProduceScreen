import request from '@/utils/request'

// POST /apollo/manufacturing/newFPY
export async function postNewFPY(startDay: string, endDay: string) {
  return request({
    url: '/manufacturing/newFPY',
    method: 'post',
    params: {
      startDay,
      endDay
    },
    data: '' // 后端不需要 body，保持与 curl 一致
  })
}

// POST /apollo/manufacturing/newBarChartFPY
export async function postNewBarChartFPY() {
  return request({
    url: '/manufacturing/newBarChartFPY',
    method: 'post',
    data: '' // 后端不需要 body，保持与 curl 一致
  })
}

// POST /apollo/manufacturing/newOnTimeMonth
export async function postNewOnTimeMonth() {
  return request({
    url: '/manufacturing/newOnTimeMonth',
    method: 'post',
    data: '' // 无 body
  })
}

// POST /apollo/manufacturing/newOnTimeDay
export async function postNewOnTimeDay() {
  return request({
    url: '/manufacturing/newOnTimeDay',
    method: 'post',
    data: '' // 无 body
  })
}


