const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// 获取所有职位
router.get('/', async (req, res) => {
  try {
    const [roles] = await pool.execute('SELECT * FROM roles ORDER BY id');
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('获取职位列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取职位列表失败'
    });
  }
});

// 根据ID获取职位
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [roles] = await pool.execute('SELECT * FROM roles WHERE id = ?', [id]);
    
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: '职位不存在'
      });
    }
    
    res.json({
      success: true,
      data: roles[0]
    });
  } catch (error) {
    console.error('获取职位详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取职位详情失败'
    });
  }
});

module.exports = router;
