import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 详细的请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('🚀 发送请求:', config.method?.toUpperCase(), config.url)
    if (config.data) {
      console.log('📤 请求数据:', JSON.stringify(config.data, null, 2))
      // 检查是否有 undefined 值
      const hasUndefined = JSON.stringify(config.data).includes('"undefined"')
      if (hasUndefined) {
        console.warn('⚠️ 请求数据包含 undefined 值!')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 详细的响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ 收到响应:', response.status, response.config.url)
    console.log('📥 响应数据:', JSON.stringify(response.data, null, 2))
    return response
  },
  (error) => {
    console.error('❌ 请求失败:', error.message)
    console.error('📥 错误响应:', error.response?.data)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else if (error.code === 'ERR_NETWORK') {
      ElMessage.error('无法连接到后端服务器。请确保后端服务正在运行在端口3000')
    } else if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    }
    
    return Promise.reject(error)
  }
)

export const api = axiosInstance
