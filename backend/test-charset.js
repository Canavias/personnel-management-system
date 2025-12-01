const mysql = require('mysql2/promise');

async function testCharset() {
    const connection = await mysql.createConnection({
        socketPath: process.env.DB_SOCKET,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4'
    });

    // 测试插入中文数据
    try {
        const [result] = await connection.execute(
            'INSERT INTO members (name, gender, grade, department_id) VALUES (?, ?, ?, ?)',
            ['测试用户', '男', '2023级', 1]
        );
        console.log('✅ 插入成功，ID:', result.insertId);
        
        // 查询刚插入的数据
        const [rows] = await connection.execute('SELECT * FROM members WHERE id = ?', [result.insertId]);
        console.log('✅ 查询结果:', rows[0]);
    } catch (error) {
        console.error('❌ 插入失败:', error.message);
    }

    await connection.end();
}

testCharset();
