const mysql = require('mysql2');

// 测试不同的连接配置
const configs = [
  {
    socketPath: '/run/mysqld/mysqld.sock',
    user: 'canavias_admin',
    database: 'personnel_management_system'
  },
  {
    socketPath: '/run/mysqld/mysqld.sock', 
    user: 'canavias_admin',
    database: 'personnel_management_system',
    password: process.env.DB_PASSWORD || 'your_password_here'
  }
];

async function testConnection(config, index) {
  try {
    const connection = mysql.createConnection(config);
    await connection.promise().execute('SELECT 1');
    console.log(`✅ 配置 ${index} 连接成功`);
    connection.end();
    return true;
  } catch (error) {
    console.log(`❌ 配置 ${index} 连接失败:`, error.message);
    return false;
  }
}

// 逐一测试配置
configs.forEach((config, index) => {
  console.log(`测试配置 ${index + 1}:`, JSON.stringify(config, null, 2));
  testConnection(config, index + 1);
});
