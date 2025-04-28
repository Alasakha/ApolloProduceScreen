import axios from 'axios';
import { ElMessage } from 'element-plus';

// 获取配置的 baseURL
const baseURL =  'http://192.168.1.197:10999/apollo'; // 默认值可以设置为开发环境的地址

// http://192.168.1.197:10999/apollo/quality/passRanking
// http://192.168.1.185:10999/apollo
// 创建一个 axios 实例
const service = axios.create({
  baseURL: baseURL, // 使用环境变量设置的 baseURL
  timeout: 120000,
});

// 请求拦截器
service.interceptors.request.use(
  config => {
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
service.interceptors.response.use(
  response => {
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
          errorMessage = res.message || '请求失败';
          break;
      }
      ElMessage.error(errorMessage);
      console.error("Response error: ", res.message);
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  error => {
    // 处理网络错误或其他非业务逻辑错误
    console.error("Response error: ", error);
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = '网络错误，请稍后重试';
      switch (status) {
        case 400:
          errorMessage = "请求无效，请检查输入数据";
          break;
        case 401:
          errorMessage = "认证失败：" + (data.message || '用户名或密码错误');
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
          errorMessage = data.message || '网络错误，请稍后重试';
          break;
      }
      ElMessage.error(errorMessage);
    } else {
      ElMessage.error("网络错误，请稍后重试");
    }
    return Promise.reject(error);
  }
);

export default service;
