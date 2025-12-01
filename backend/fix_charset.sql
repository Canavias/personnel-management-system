-- 修改数据库字符集
ALTER DATABASE personnel_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改表字符集
ALTER TABLE departments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE roles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE members CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 检查修改结果
SELECT TABLE_NAME, TABLE_COLLATION FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'personnel_management_system';
