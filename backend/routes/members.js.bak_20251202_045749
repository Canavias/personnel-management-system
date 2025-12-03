const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 性别转换函数
function convertGenderToValue(gender) {
  const genderMap = { '男': 1, '女': 2, '其他': 3 };
  return genderMap[gender] || 1;
}

function convertValueToGender(value) {
  const genderMap = { 1: '男', 2: '女', 3: '其他' };
  return genderMap[value] || '男';
}

// 获取所有成员
router.get('/', async (req, res) => {
  try {
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
    
    const processedRows = rows.map(row => ({
      ...row,
      gender: convertValueToGender(row.gender)
    }));
    
    res.json(processedRows);
  } catch (error) {
    console.error('获取成员列表失败:', error);
    res.status(500).json({ error: '获取成员列表失败' });
  }
});

// ========== 改进的PUT路由 ==========
router.put('/:id', async (req, res) => {
  console.log('🎯 PUT /api/members/' + req.params.id + ' 被调用');
  
  try {
    const { id } = req.params;
    const { name, gender, grade, student_id, phone, email, department_id, role_id, is_active } = req.body;

    console.log('📦 请求数据:', JSON.stringify(req.body, null, 2));

    // 验证必填字段
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: '姓名不能为空' 
      });
    }

    if (!gender || (gender !== '男' && gender !== '女' && gender !== '其他')) {
      return res.status(400).json({
        success: false,
        message: '性别必须为：男、女 或 其他'
      });
    }

    // 转换性别
    const genderValue = convertGenderToValue(gender);

    // 站长逻辑
    let actualDepartmentId = department_id;
    if (role_id === 1) { // 站长
      actualDepartmentId = null;
    }

    console.log('📝 执行SQL参数:');
    console.log('  name:', name);
    console.log('  gender:', genderValue);
    console.log('  grade:', grade);
    console.log('  department_id:', actualDepartmentId);
    console.log('  role_id:', role_id);

    const [result] = await pool.execute(
      `UPDATE members 
       SET name = ?, gender = ?, grade = ?, student_id = ?, phone = ?, email = ?, 
           department_id = ?, role_id = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        name,
        genderValue,
        grade || '',
        student_id || null,
        phone || null,
        email || null,
        actualDepartmentId,
        role_id,
        is_active !== undefined ? is_active : true,
        id
      ]
    );

    console.log('📈 数据库影响行数:', result.affectedRows);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '成员不存在' 
      });
    }

    // 关键改进：返回更新后的完整成员数据
    const [updatedRows] = await pool.execute(`
      SELECT 
        m.*,
        d.name as department_name,
        r.title as role_title
      FROM members m
      LEFT JOIN departments d ON m.department_id = d.id
      LEFT JOIN roles r ON m.role_id = r.id
      WHERE m.id = ?
    `, [id]);
    
    const updatedMember = updatedRows[0];
    if (updatedMember) {
      updatedMember.gender = convertValueToGender(updatedMember.gender);
    }

    res.json({
      success: true,
      message: '成员更新成功',
      data: updatedMember  // 返回完整的成员对象，而不是只有id
    });

  } catch (error) {
    console.error('❌ 更新成员失败:', error);
    res.status(500).json({
      success: false,
      message: '更新失败: ' + error.message
    });
  }
});

// ========== 添加DELETE路由 ==========
router.delete('/:id', async (req, res) => {
  console.log('🗑️ DELETE /api/members/' + req.params.id + ' 被调用');
  
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      `UPDATE members SET is_active = false WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: '成员不存在' 
      });
    }

    res.json({
      success: true,
      message: '成员删除成功'
    });
  } catch (error) {
    console.error('❌ 删除成员失败:', error);
    res.status(500).json({
      success: false,
      message: '删除失败: ' + error.message
    });
  }
});

// 添加成员
router.post('/', async (req, res) => {
  try {
    const { name, gender, grade, student_id, phone, email, department_id, role_id } = req.body;
    
    const genderValue = convertGenderToValue(gender);
    
    const [result] = await pool.execute(
      `INSERT INTO members (name, gender, grade, student_id, phone, email, department_id, role_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, genderValue, grade, student_id, phone, email, department_id, role_id]
    );
    
    // 返回新创建的成员完整数据
    const [newRows] = await pool.execute(`
      SELECT 
        m.*,
        d.name as department_name,
        r.title as role_title
      FROM members m
      LEFT JOIN departments d ON m.department_id = d.id
      LEFT JOIN roles r ON m.role_id = r.id
      WHERE m.id = ?
    `, [result.insertId]);
    
    const newMember = newRows[0];
    if (newMember) {
      newMember.gender = convertValueToGender(newMember.gender);
    }
    
    res.json({
      success: true,
      message: '成员添加成功',
      data: newMember
    });
  } catch (error) {
    console.error('添加成员失败:', error);
    res.status(500).json({
      success: false,
      message: `添加成员失败: ${error.message}`
    });
  }
});

module.exports = router;
