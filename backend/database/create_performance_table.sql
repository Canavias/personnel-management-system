-- 创建绩效评估表
CREATE TABLE IF NOT EXISTS performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00 COMMENT '绩效评分',
    comments TEXT COMMENT '评语',
    evaluated_by INT COMMENT '评估人ID',
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_member_id (member_id),
    INDEX idx_score (score)
);

-- 插入测试绩效数据
INSERT INTO performance (member_id, score, comments) VALUES
(1, 85.50, '表现优秀，积极参与项目开发'),
(2, 92.00, '技术能力突出，团队协作良好'),
(3, 78.50, '工作认真，需要提升沟通能力'),
(4, 88.00, '学习能力强，进步明显'),
(5, 95.50, '领导能力突出，项目完成出色');
