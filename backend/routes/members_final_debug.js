const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 性别转换函数
function convertGenderToValue(gender) {
  console.log('🔍 后端性别转换 - 输入:', gender, '类型:', typeof gender);
  const genderMap = { '男': 1, '女': 2, '其他': 3 };
  const result = genderMap[gender] || 1;
  console.log('🔍 后端性别转换 - 输出:', result);
  return result;
}

function convertValueToGender(value) {
  console.log('🔍 后端性别反向转换 - 输入:', value, '类型:', typeof value);
  const genderMap = { 1: '男', 2: '女', 3: '其他' };
  const result = genderMap[value] || '男';
  console.log('🔍 后端性别反向转换 - 输出:', result);
  return result;
}

// 获取所有成员 - 添加详细调试
router.get('/', async (req, res) => {
  try {
    console.log('🔄 获取所有成员列表');
    const [rows] = await pool.execute(`
      SELECT 
        m.*,
        d.name as department_name,
        r.title as role_title
      FROM members m
      LEFT JOIN departments d ON m.department_id = d.id
      LEFT JOIN roles r ON m.role_id = r.id
      WHERE m.is_active = true
      ORDER BY m.id
    `);
    
    console.log('📊 数据库原始数据 - 检查ID=12的成员:');
    const member12 = rows.find(row => row.id === 12);
    if (member12) {
      console.log('  ID=12的原始数据:', {
        id: member12.id,
        name: member12.name,
        gender: member12.gender,
        gender_type: typeof member12.gender
      });
    }
    
    // 转换性别值
    const processedRows = rows.map(row => ({
      ...row,
      gender: convertValueToGender(row.gender)
    }));
    
    console.log('📤 发送给前端的数据 - 检查ID=12的成员:');
    const processedMember12 = processedRows.find(row => row.id === 12);
    if (processedMember12) {
      console.log('  ID=12的处理后数据:', {
        id: processedMember12.id,
        name: processedMember12.name,
        gender: processedMember12.gender
      });
    }
    
    res.json(processedRows);
  } catch (error) {
    console.error('获取成员列表失败:', error);
    res.status(500).json({ error: '获取成员列表失败' });
  }
});

// 更新成员信息
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, grade, student_id, phone, email, department_id, role_id, is_active } = req.body;

    console.log('🔄 更新成员请求 - 完整数据:', JSON.stringify(req.body, null, 2));
    console.log('🔍 更新成员请求 - 性别字段:', gender, '类型:', typeof gender);

    // 验证性别
    if (gender !== '男' && gender !== '女' && gender !== '其他') {
      console.log('❌ 性别验证失败:', gender);
      return res.status(400).json({
        success: false,
        message: '性别必须为：男、女 或 其他'
      });
    } else {
      console.log('✅ 性别验证通过:', gender);
    }

    // 站长逻辑：站长没有部门
    let actualDepartmentId = department_id;
    if (role_id === 1) {
      actualDepartmentId = null;
    } else if (!department_id) {
      return res.status(400).json({
        success: false,
        message: '非站长职位必须选择部门'
      });
    }

    // 转换性别
    const genderValue = convertGenderToValue(gender);
    console.log('📊 最终存储的性别值:', genderValue);

    const [result] = await pool.execute(
      `UPDATE members 
       SET name = ?, gender = ?, grade = ?, student_id = ?, phone = ?, email = ?, 
           department_id = ?, role_id = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [name, genderValue, grade, student_id, phone, email, actualDepartmentId, role_id, is_active, id]
    );

    console.log('📈 数据库更新结果:', result.affectedRows, '行受影响');

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '成员不存在'
      });
    }

    res.json({
      success: true,
      message: '成员信息更新成功'
    });
  } catch (error) {
    console.error('更新成员失败:', error);
    res.status(500).json({
      success: false,
      message: `更新成员失败: ${error.message}`
    });
  }
});

// 其他路由保持不变...
router.get('/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    console.log('🔄 获取单个成员详情 ID:', memberId);
    
    const [rows] = await pool.execute(`
      SELECT 
        m.*,
        d.name as department_name,
        r.title as role_title
      FROM members m
      LEFT JOIN departments d ON m.department_id = d.id
      LEFT JOIN roles r ON m.role_id = r.id
      WHERE m.id = ?
    `, [memberId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '成员不存在' });
    }
    
    console.log('📊 单个成员原始数据:', {
      id: rows[0].id,
      name: rows[0].name, 
      gender: rows[0].gender,
      gender_type: typeof rows[0].gender
    });
    
    const member = {
      ...rows[0],
      gender: convertValueToGender(rows[0].gender)
    };
    
    console.log('📤 单个成员处理后数据:', {
      id: member.id,
      name: member.name,
      gender: member.gender
    });
    
    res.json(member);
  } catch (error) {
    console.error('获取成员详情失败:', error);
    res.status(500).json({ error: '获取成员详情失败' });
  }
});

// 其他路由方法保持不变...
router.post('/', async (req, res) => {
  try {
    const { name, gender, grade, student_id, phone, email, department_id, role_id } = req.body;
    
    const genderValue = convertGenderToValue(gender);
    
    const [result] = await pool.execute(
      `INSERT INTO members (name, gender, grade, student_id, phone, email, department_id, role_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, genderValue, grade, student_id, phone, email, department_id, role_id]
    );
    
    res.json({
      success: true,
      message: '成员添加成功',
      id: result.insertId
    });
  } catch (error) {
    console.error('添加成员失败:', error);
    res.status(500).json({
      success: false,
      message: `添加成员失败: ${error.message}`
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const memberId = req.params.id;
    const [result] = await pool.execute(
      'UPDATE members SET is_active = false WHERE id = ?',
      [memberId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '成员不存在' });
    }
    
    res.json({ message: '成员删除成功' });
  } catch (error) {
    console.error('删除成员失败:', error);
    res.status(500).json({ error: '删除成员失败' });
  }
});

module.exports = router;
