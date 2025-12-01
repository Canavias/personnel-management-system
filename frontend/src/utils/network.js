// 网络诊断工具
export const checkBackendConnection = async () => {
  const testURLs = [
    'http://localhost:3000/health',
    'http://127.0.0.1:3000/health',
    'http://100.64.9.75:3000/health'
  ]
  
  for (const url of testURLs) {
    try {
      const response = await fetch(url, { method: 'GET' })
      if (response.ok) {
        console.log(`✅ 后端服务正常运行在: ${url}`)
        return url.replace('/health', '/api')
      }
    } catch (error) {
      console.log(`❌ 无法连接到: ${url}`)
    }
  }
  
  console.error('❌ 所有后端地址都无法连接，请检查后端服务是否启动')
  return null
}

export const testLoginAPI = async (baseURL) => {
  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'test',
        password: '123456'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ 登录API测试成功')
      return data
    } else {
      console.log('❌ 登录API返回错误:', response.status)
      return null
    }
  } catch (error) {
    console.log('❌ 登录API测试失败:', error.message)
    return null
  }
}
