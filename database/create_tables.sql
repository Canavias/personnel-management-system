-- 人员名单管理系统 - 数据库初始化脚本
-- 1. 部门表
CREATE TABLE IF NOT EXISTS departments (
 id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '部门名称',
    description TEXT COMMENT '部门描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门信息表';
-- 2. 角色表
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名称',
    level INT DEFAULT 0 COMMENT '角色层级，用于权限控制',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';

-- 3. 用户表（管理员）
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '加密后的密码',
    email VARCHAR(100) COMMENT '邮箱',
    role_id INT COMMENT '角色ID',
    department_id INT COMMENT '所属部门ID',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    last_login TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 4. 成员总表
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    gender ENUM('男', '女', '其他') NOT NULL COMMENT '性别',
    grade VARCHAR(20) NOT NULL COMMENT '学级，如：2023级',
    student_id VARCHAR(50) UNIQUE COMMENT '学号',
    phone VARCHAR(20) COMMENT '电话号码',
    email VARCHAR(100) COMMENT '邮箱',
    department_id INT NOT NULL COMMENT '所属部门ID',
    role_id INT COMMENT '主要角色ID',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否在任',
    join_date DATE COMMENT '加入日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    INDEX idx_department (department_id),
    INDEX idx_grade (grade),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成员总表';

-- 5. 成员角色关联表
CREATE TABLE IF NOT EXISTS member_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_role (member_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成员角色关联表';

-- 6. 考评表
CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    evaluator_id INT COMMENT '考评人ID',
    score DECIMAL(5,2) NOT NULL COMMENT '考评分',
    period VARCHAR(20) NOT NULL COMMENT '考评周期，如：2024-Q1',
    comments TEXT COMMENT '评语',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_member_period (member_id, period),
    INDEX idx_period (period),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成员考评表';
-- 7. 自定义表格表
CREATE TABLE IF NOT EXISTS custom_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '表格名称',
    description TEXT COMMENT '表格描述',
    creator_id INT NOT NULL COMMENT '创建者ID',
    department_id INT COMMENT '所属部门ID，NULL表示全局表格',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    INDEX idx_creator (creator_id),
    INDEX idx_department (department_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自定义表格表';

-- 8. 自定义字段表
CREATE TABLE IF NOT EXISTS custom_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL COMMENT '字段名称',
    field_type VARCHAR(50) NOT NULL COMMENT '字段类型：text, number, date, boolean',
    display_order INT DEFAULT 0 COMMENT '显示顺序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (table_id) REFERENCES custom_tables(id) ON DELETE CASCADE,
    INDEX idx_table (table_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自定义字段表';
-- 9. 自定义数据表
CREATE TABLE IF NOT EXISTS custom_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    member_id INT NOT NULL,
    field_id INT NOT NULL,
    value TEXT COMMENT '字段值',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (table_id) REFERENCES custom_tables(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES custom_fields(id) ON DELETE CASCADE,
    UNIQUE KEY unique_table_member_field (table_id, member_id, field_id),
    INDEX idx_table_member (table_id, member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='自定义表格数据表';

-- 10. 插入初始数据
INSERT INTO roles (title, level) VALUES 
('站长', 100),
('部长', 90),
('副部长', 80),
('负责人', 70),
('成员', 60);

INSERT INTO departments (name, description) VALUES 
('程序部', '负责核心算法、后端开发和系统架构设计'),
('游戏部', '负责游戏开发、游戏引擎学习和游戏项目实践'),
('Web部', '负责网站开发、前端技术和全栈项目实现'),
('UI部', '负责用户界面设计、用户体验优化和视觉设计'),
('App部', '负责移动应用开发、iOS和Android平台应用'),
('精英培优班', '高水平成员培养，负责技术攻关和重点项目开发');
