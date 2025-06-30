import axios from 'axios'
import { ElMessage } from 'element-plus'

// 获取配置的 baseURL
const baseURL = 'http://192.168.1.197:10999/apollo'

// 创建专门用于文件下载的axios实例
const downloadService = axios.create({
  baseURL: baseURL,
  timeout: 300000, // 文件下载可能需要更长时间
})

// 请求拦截器
downloadService.interceptors.request.use(
  config => {
    // 自动附加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error("Download request error: ", error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 专门处理文件下载
downloadService.interceptors.response.use(
  response => {
    // 检查响应头，判断是否为文件
    const contentType = response.headers['content-type']
    const contentDisposition = response.headers['content-disposition']
    
    if (contentType && contentType.includes('application/json')) {
      // 如果是JSON响应，说明可能是错误信息
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const errorData = JSON.parse(reader.result)
          if (errorData.code && errorData.code !== 200) {
            ElMessage.error(errorData.message || '下载失败')
            return Promise.reject(new Error(errorData.message || '下载失败'))
          }
        } catch (e) {
          // 解析失败，可能是正常的文件数据
        }
      }
      reader.readAsText(response.data)
    }
    
    return response
  },
  error => {
    console.error("Download response error: ", error)
    ElMessage.error('文件下载失败，请稍后重试')
    return Promise.reject(error)
  }
)

/**
 * 下载文件
 * @param {string} url - 下载地址
 * @param {string} filename - 文件名（可选，如果不提供会从响应头获取）
 * @param {object} params - 请求参数（可选）
 * @returns {Promise}
 */
export const downloadFile = async (url, filename = null, params = {}) => {
  try {
    const response = await downloadService({
      url: url,
      method: 'get',
      params: params,
      responseType: 'blob'
    })

    // 从响应头获取文件名
    let downloadFilename = filename
    if (!downloadFilename) {
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1].replace(/['"]/g, '')
        }
      }
    }
    
    // 如果没有获取到文件名，使用默认名称
    if (!downloadFilename) {
      downloadFilename = `export_${new Date().toISOString().slice(0, 10)}.xlsx`
    }

    // 创建下载链接
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = downloadFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    ElMessage.success('文件下载成功！')
    return true
  } catch (error) {
    console.error('下载失败：', error)
    ElMessage.error('文件下载失败，请重试！')
    return false
  }
}

export default downloadService 