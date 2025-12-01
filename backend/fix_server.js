// 在文件开头添加dotenv配置
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');

console.log('🔧 环境变量检查:');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '未设置');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_SOCKET:', process.env.DB_SOCKET);

// 测试数据库连接
async function testDatabaseConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('✅ 数据库连接成功');
    return true;
  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message);
    return false;
  }
}

testDatabaseConnection().then(success => {
  if (success) {
    console.log('🚀 服务器可以正常启动');
  } else {
    console.log('❌ 服务器启动失败');
  }
  process.exit();
});
