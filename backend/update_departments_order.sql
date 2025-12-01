-- 设置连接字符集
SET NAMES utf8mb4;

-- 先更新现有部门数据（保持原有ID）
UPDATE departments SET 
  name = '程序部', 
  description = '负责核心算法、后端开发和系统架构设计' 
WHERE id = 1;

UPDATE departments SET 
  name = '游戏部', 
  description = '负责游戏开发、游戏引擎学习和游戏项目实践' 
WHERE id = 2;

UPDATE departments SET 
  name = 'Web部', 
  description = '负责网站开发、前端技术和全栈项目实现' 
WHERE id = 3;

UPDATE departments SET 
  name = 'UI部', 
  description = '负责用户界面设计、用户体验优化和视觉设计' 
WHERE id = 4;

UPDATE departments SET 
  name = 'App部', 
  description = '负责移动应用开发、iOS和Android平台应用' 
WHERE id = 5;

-- 更新iOS部门（如果已存在）
UPDATE departments SET 
  name = 'iOS部', 
  description = '负责iOS应用开发和维护' 
WHERE id = 7;

-- 如果iOS部门不存在，插入它
INSERT INTO departments (name, description) 
SELECT 'iOS部', '负责iOS应用开发和维护'
FROM dual 
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE id = 7);

-- 最后更新精英培优班（保持ID=6，但会在查询时排在最后）
UPDATE departments SET 
  name = '精英培优班', 
  description = '高水平成员培养，负责技术攻关和重点项目开发' 
WHERE id = 6;

-- 更新角色数据
UPDATE roles SET title = '站长' WHERE id = 1;
UPDATE roles SET title = '部长' WHERE id = 2;
UPDATE roles SET title = '副部长' WHERE id = 3;
UPDATE roles SET title = '负责人' WHERE id = 4;
UPDATE roles SET title = '成员' WHERE id = 5;

-- 验证数据（按指定顺序显示）
SELECT * FROM departments ORDER BY 
  CASE 
    WHEN name = '精英培优班' THEN 999  -- 让精英培优班排在最后
    ELSE id 
  END;

SELECT * FROM roles;
