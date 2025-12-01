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

// 测试数据库连接
async function initializeDatabase() {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('✅ 数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// 注册API路由
app.use('/api/members', membersRouter);
app.use('/api/auth', authRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/roles', rolesRouter);

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
  
  const dbConnected = await initializeDatabase();
  if (!dbConnected) {
    console.log('⚠️ 数据库连接失败，但服务将继续启动...');
  }
  
  app.listen(PORT, () => {
    console.log(`🎯 后端服务运行在端口 ${PORT}`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`👥 成员API: http://localhost:${PORT}/api/members`);
  });
}

startServer().catch(error => {
  console.error('❌ 服务启动失败:', error);
  process.exit(1);
});
