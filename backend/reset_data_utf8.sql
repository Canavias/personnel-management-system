-- 设置连接字符集
SET NAMES utf8mb4;

-- 清空并重新插入部门数据
TRUNCATE TABLE departments;

INSERT INTO departments (name, description) VALUES 
('程序部', '负责核心算法、后端开发和系统架构设计'),
('游戏部', '负责游戏开发、游戏引擎学习和游戏项目实践'),
('Web部', '负责网站开发、前端技术和全栈项目实现'),
('UI部', '负责用户界面设计、用户体验优化和视觉设计'),
('App部', '负责移动应用开发、iOS和Android平台应用'),
('iOS部', '负责iOS应用开发和维护');
('精英培优班', '高水平成员培养，负责技术攻关和重点项目开发'),

-- 清空并重新插入角色数据
TRUNCATE TABLE roles;

INSERT INTO roles (title, level) VALUES 
('站长', 100),
('部长', 90),
('副部长', 80),
('负责人', 70),
('成员', 60);

-- 验证数据
SELECT * FROM departments;
SELECT * FROM roles;
