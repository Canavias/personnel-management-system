const mysql = require('mysql2/promise');

async function fixGenderEncoding() {
  try {
    // 使用与项目相同的数据库配置
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'password', // 请替换为实际密码
      database: 'personnel_system',
      charset: 'utf8mb4',
      connectionLimit: 10
    });

    console.log('🔧 开始修复性别字段编码问题...');

    // 首先检查当前数据
    const [rows] = await pool.execute('SELECT id, name, gender FROM members');
    console.log('📊 当前成员性别数据:');
    rows.forEach(row => {
      console.log(`  ID ${row.id}: ${row.name} - 性别值: ${row.gender} (原始值)`);
    });

    // 修复性别字段 - 直接设置正确的整数值
    console.log('🔄 修复性别字段...');
    
    // 将男性设置为1
    await pool.execute("UPDATE members SET gender = 1 WHERE gender IN ('男', 'ç”', '??') OR gender = 1");
    
    // 将女性设置为2  
    await pool.execute("UPDATE members SET gender = 2 WHERE gender IN ('女', 'å¥³', '??') OR gender = 2");
    
    // 将其他设置为3
    await pool.execute("UPDATE members SET gender = 3 WHERE gender IN ('其他', '??') OR gender = 3");

    // 验证修复结果
    const [fixedRows] = await pool.execute('SELECT id, name, gender FROM members ORDER BY id');
    console.log('✅ 修复后的成员性别数据:');
    fixedRows.forEach(row => {
      console.log(`  ID ${row.id}: ${row.name} - 性别值: ${row.gender}`);
    });

    console.log('🎉 性别字段编码修复完成！');
    
    await pool.end();
  } catch (error) {
    console.error('修复失败:', error);
  }
}

fixGenderEncoding();
