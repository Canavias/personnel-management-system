-- 修复性别字段的乱码
UPDATE members SET gender = '男' WHERE gender = 'ç”·';
UPDATE members SET gender = '女' WHERE gender = 'å¥³';

-- 验证修复结果
SELECT id, name, gender FROM members;
