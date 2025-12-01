require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');

// 导入路由
const membersRouter = require('./routes/members');
const authRouter = require('./routes/auth');
const departmentsRouter = require('./routes/departments');
const rolesRouter = require('./routes/roles');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 调试中间件：记录所有API请求
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'PUT' && req.url.includes('/api/members')) {
    console.log('🔍 检测到PUT请求:', req.url);
    console.log('🔍 请求体:', req.body);
  }
  next();
});

// 注册API路由
app.use('/api/members', membersRouter);
app.use('/api/auth', authRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/roles', rolesRouter);

// 404处理
app.use('/api/*', (req, res) => {
  console.log(`🚨 404: API路由不存在 ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API端点不存在: ${req.method} ${req.originalUrl}`
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '人员名单管理系统后端服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
async function startServer() {
  console.log('🚀 启动人员名单管理系统...');
  
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
  }
  
  app.listen(PORT, () => {
    console.log(`🎯 后端服务运行在端口 ${PORT}`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`👥 成员API: http://localhost:${PORT}/api/members`);
    console.log(`🏢 部门API: http://localhost:${PORT}/api/departments`);
    console.log(`💼 职位API: http://localhost:${PORT}/api/roles`);
  });
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 收到关闭信号，正在停止服务...');
  process.exit(0);
});

startServer().catch(error => {
  console.error('❌ 服务启动失败:', error);
  process.exit(1);
});
