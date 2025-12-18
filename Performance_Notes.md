# Performance Notes

- ใช้ **Supabase PostgreSQL** เป็น database สำหรับ Board, Column, Task, User  
  → จัดการข้อมูลได้รวดเร็วและปลอดภัย

- ใช้ **Supabase Auth** สำหรับ login/register ที่ frontend  
  → ลดภาระ backend และไม่ต้องจัดการ session เอง

- การ query ข้อมูล Board/Column/Task ใช้ **foreign key และ index**  
  → ดึงข้อมูลเฉพาะ field ที่จำเป็น ลดเวลา query และ data transfer
