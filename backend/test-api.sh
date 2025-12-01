#!/bin/bash

echo "=== 人员名单管理系统 API 测试 ==="

echo -e "\n1. 测试基础路由..."
curl -s http://localhost:3000/

echo -e "\n\n2. 测试获取成员列表（需要认证）..."
curl -s -X GET http://localhost:3000/api/members \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NjQ0MDU5MzksImV4cCI6MTc2NDQ5MjMzOX0.m5GroIMmkneSJc3l2Q9gcVPNStveg2ig_xBWQxoAq6E"

echo -e "\n\n=== 测试完成 ==="
