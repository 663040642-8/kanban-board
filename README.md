# Kanban Board Project

## Project Overview

ระบบ Kanban Board สำหรับจัดการงาน มีฟีเจอร์หลักดังนี้:

- **Register / Login** (Supabase Auth)
- **สร้าง / ลบ / เปลี่ยนชื่อ Board**
- **Invite สมาชิก** ให้เข้าร่วม Board
- **สร้าง / ลบ / แก้ไข Column**
- **สร้าง / ลบ / แก้ไข Task**
- **Assign สมาชิกให้ Task**

**Backend:** NestJS + Supabase PostgreSQL  
**Frontend:** Angular

---

## Notes

- ใช้ **Supabase Auth** สำหรับ login/register → ลดภาระ backend
- ใช้ **PostgreSQL** พร้อม **indexing และ foreign key** → query ข้อมูล Board/Column/Task ได้เร็ว
- **ER Diagram** แสดงความสัมพันธ์ระหว่างตาราง
