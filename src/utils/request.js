import axios from 'axios';
import { ElMessage } from 'element-plus';

// 获取配置的 baseURL
const baseURL =  'http://192.168.1.197:10999/apollo'; // 默认值可以设置为开发环境的地址
// http://192.168.1.101:10999/
// http://192.168.1.197:10999/apollo/quality/passRanking
// http://192.168.1.185:10999/apollo

// 用于 /api 前缀接口的 baseURL
const apiBaseURL = 'http://192.168.1.197:10999/api';

// 创建一个 axios 实例
const service = axios.create({
  baseURL: baseURL, // 使用环境变量设置的 baseURL
  timeout: 1200000,
});

// 创建一个用于 /api 前缀接口的 axios 实例
const apiService = axios.create({
  baseURL: apiBaseURL,
  timeout: 1200000,
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 默认设置 Content-Type 为 application/json（如果未手动指定）
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }

    // 自动附加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error("Request error: ", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
const responseInterceptor = (response) => {
  // 如果是文件流，直接返回原始 response
  if (response.config && response.config.responseType === 'blob') {
    return response;
  }

  const res = response.data;

  // 处理业务逻辑错误
  if (res.code !== 200) {
    let errorMessage = '请求失败';
    switch (res.code) {
      case 400:
        errorMessage = "请求无效，请检查输入数据";
        break;
      case 401:
        errorMessage = "认证失败：" + (res.message || '用户名或密码错误');
        break;
      case 403:
        errorMessage = "禁止访问";
        break;
      case 404:
        errorMessage = "请求的资源不存在";
        break;
      case 500:
        errorMessage = "服务器内部错误";
        break;
      default:
        errorMessage = res.message || `请求失败 (code: ${res.code})`;
        break;
    }
    ElMessage.error(errorMessage);
    return Promise.reject(new Error(res.message || errorMessage || `请求失败 (code: ${res.code})`));
  }
  return res;
};

const errorInterceptor = (error) => {
  // 处理网络错误或其他非业务逻辑错误
  if (error.response) {
    const { status, data } = error.response;
    let errorMessage = '网络错误，请稍后重试';
    switch (status) {
      case 400:
        errorMessage = "请求无效，请检查输入数据";
        break;
      case 401:
        errorMessage = "认证失败：" + (data?.message || '用户名或密码错误');
        break;
      case 403:
        errorMessage = "禁止访问";
        break;
      case 404:
        errorMessage = `请求的资源不存在: ${error.config?.url || '未知URL'}`;
        break;
      case 500:
        errorMessage = "服务器内部错误";
        break;
      default:
        errorMessage = data?.message || `网络错误 (HTTP ${status})，请稍后重试`;
        break;
    }
    ElMessage.error(errorMessage);
  } else if (error.request) {
    // 请求已发出但没有收到响应
    ElMessage.error("网络错误，无法连接到服务器");
  } else {
    // 请求配置出错
    ElMessage.error("请求配置错误，请稍后重试");
  }
  return Promise.reject(error);
};

service.interceptors.response.use(responseInterceptor, errorInterceptor);
apiService.interceptors.response.use(responseInterceptor, errorInterceptor);

// 为 apiService 添加请求拦截器（与 service 相同的逻辑）
apiService.interceptors.request.use(
  config => {
    // 默认设置 Content-Type 为 application/json（如果未手动指定）
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    }

    // 自动附加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    console.error("Request error: ", error);
    return Promise.reject(error);
  }
);

export default service;
export { apiService };
