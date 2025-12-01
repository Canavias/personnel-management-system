// 在main.ts中导入此文件以调试所有请求
import axios from 'axios';

axios.interceptors.request.use(config => {
  console.log('🔍 [DEBUG] 前端请求:');
  console.log(`  URL: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log(`  Headers:`, config.headers);
  console.log(`  Data:`, config.data);
  return config;
});

axios.interceptors.response.use(response => {
  console.log('🔍 [DEBUG] 前端响应:');
  console.log(`  Status: ${response.status}`);
  console.log(`  Data:`, response.data);
  return response;
}, error => {
  console.error('🔍 [DEBUG] 前端错误:');
  console.error(`  Error:`, error.message);
  console.error(`  Request:`, error.config?.url);
  console.error(`  Response:`, error.response?.status, error.response?.data);
  return Promise.reject(error);
});
