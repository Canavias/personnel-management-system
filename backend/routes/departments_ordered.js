const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 获取所有部门（精英培优班排在最后）
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT * FROM departments 
      ORDER BY 
        CASE 
          WHEN name = '精英培优班' THEN 999
          ELSE id 
        END
    `);
    res.json(rows);
  } catch (error) {
    console.error('获取部门列表失败:', error);
    res.status(500).json({ error: '获取部门列表失败' });
  }
});

// 部门成员统计（同样排序）
router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        d.id,
        d.name,
        d.description,
        COUNT(m.id) as member_count
      FROM departments d
      LEFT JOIN members m ON d.id = m.department_id AND m.is_active = true
      GROUP BY d.id, d.name, d.description
      ORDER BY 
        CASE 
          WHEN d.name = '精英培优班' THEN 999
          ELSE d.id 
        END
    `);
    res.json(rows);
  } catch (error) {
    console.error('获取部门统计失败:', error);
    res.status(500).json({ error: '获取部门统计失败' });
  }
});

// 其他部门路由保持不变...
router.get('/:id', async (req, res) => {
  try {
    const departmentId = req.params.id;
    const [department] = await pool.execute('SELECT * FROM departments WHERE id = ?', [departmentId]);
    
    if (department.length === 0) {
      return res.status(404).json({ error: '部门不存在' });
    }
    
    const [members] = await pool.execute(`
      SELECT m.*, r.title as role_title 
      FROM members m 
      LEFT JOIN roles r ON m.role_id = r.id 
      WHERE m.department_id = ? AND m.is_active = true
    `, [departmentId]);
    
    res.json({
      department: department[0],
      members: members
    });
  } catch (error) {
    console.error('获取部门详情失败:', error);
    res.status(500).json({ error: '获取部门详情失败' });
  }
});

module.exports = router;
