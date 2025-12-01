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
  END;
