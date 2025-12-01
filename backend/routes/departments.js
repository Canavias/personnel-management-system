const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 获取所有部门
router.get('/', async (req, res) => {
  try {
    const [departments] = await pool.execute('SELECT * FROM departments ORDER BY id');
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('获取部门列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取部门列表失败'
    });
  }
});

// 根据ID获取部门
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [departments] = await pool.execute('SELECT * FROM departments WHERE id = ?', [id]);
    
    if (departments.length === 0) {
      return res.status(404).json({
        success: false,
        message: '部门不存在'
      });
    }
    
    res.json({
      success: true,
      data: departments[0]
    });
  } catch (error) {
    console.error('获取部门详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取部门详情失败'
    });
  }
});

module.exports = router;
