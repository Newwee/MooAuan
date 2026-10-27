# DUO POP / MooAuan 🐱💖🐰

> เว็บไซต์เล่นมินิเกมออนไลน์ 2 คนสุดคิ้วท์ สำหรับคนรัก คนคุย และเพื่อนสนิท (Cute Pastel Two-Player Mini-Game Web App)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg)](LICENSE)

---

## ✨ จุดเด่นของโปรเจกต์ (Key Features)

1. **Cute Pastel & Modern Kawaii UI**:
   - ออกแบบตามหลัก Soft UI ใช้ชุดสี Cream, Pink, Lavender, Mint, Lemon
   - มาสคอต SVG ออริจินัล 8 ตัว (Cat, Bunny, Bear, Duck, Frog, Panda, Fox, Hamster)
   - แบ็กกราวด์ขยับลื่นไหล (ReactBits inspiration) พร้อมรองรับ `prefers-reduced-motion`

2. **ระบบเสียงสังเคราะห์ในตัว (Zero External Sound Assets)**:
   - ใช้ **Web Audio API** สร้างเสียง 8-bit / Kawaii Chimes ในตัว ปราศจากปัญหาไฟล์เสียง 404
   - รองรับปุ่มเปิด/ปิดเสียง (Mute Toggle) บันทึกสถานะอัตโนมัติ

3. **4 มินิเกมใน MVP**:
   - 🧠 **Same Brain (ใจตรงกัน)**: ตอบคำถามลับ เปิดพร้อมกัน คำนวณความเข้ากันระดับ Soulmate
   - ⚡ **Tap Battle (แตะไวชิงจังหวะ)**: วัดปฏิกิริยาความไวเป็นมิลลิวินาที ป้องกันการกดก่อนสัญญาณ (False Start)
   - 🎴 **Memory Match (จับคู่ขนมหวาน)**: ผลัดกันเปิดไพ่ของหวาน 12 ใบ 6 คู่
   - ✌️ **Rock Paper Scissors (เป่ายิ้งฉุบมหาศึก)**: ค้อน กรรไกร กระดาษ แข่งขัน Best of 5

4. **Multiplayer & Dual Realtime Engine**:
   - ระบบรหัสห้อง 6 ตัวอักษรที่ไม่ซ้ำกัน
   - เชื่อมต่อผู้เล่น 2 คนผ่าน **Server-Sent Events (SSE)** ทำงานได้ทันทีแบบ Zero-Config
   - พร้อมเชื่อมต่อ **Supabase Realtime & PostgreSQL** ผ่านไฟล์ Migration ที่เตรียมไว้

5. **Admin Mode & Safe Pranks (`/admin`)**:
   - ระบบแกล้งเพื่อนแบบฮา ๆ ปลอดภัย: พลุกระดาษ, ฝนอีโมจิ, หน้าจอเต้นระบำ Jelly, โหลดทิพย์ 99%, ป้ายมีม
   - มีปุ่มปิด (X) ได้ตลอดเวลา ไม่รบกวนคะแนนเกม มี Audit Log บันทึกทุกการกระทำ

---

## 🚀 วิธีติดตั้งและรันในเครื่อง (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
- Node.js version 18.17+ หรือ 20+ หรือ 24+
- npm หรือ pnpm

### 2. ติดตั้ง Dependencies
```bash
git clone https://github.com/Newwee/MooAuan.git
cd MooAuan
npm install
```

### 3. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
```bash
cp .env.example .env.local
```

### 4. รัน Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

### 5. การตรวจสอบคุณภาพโค้ดและทดสอบ
```bash
# Type check
npm run typecheck

# Lint check
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

---

## 🗄️ โครงสร้างฐานข้อมูล Supabase (Database Schema)

หากต้องการใช้งานร่วมกับ Supabase:
1. สร้างโปรเจกต์ใหม่บน [Supabase](https://supabase.com/)
2. นำ SQL ในไฟล์ `supabase/migrations/001_initial_schema.sql` ไปรันใน SQL Editor
3. นำ URL และ Anon Key มาใส่ใน `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📱 Responsive & Accessibility (WCAG 2.2 AA)
- รองรับขนาดหน้าจอตั้งแต่ 320px (Mobile) จนถึง 4K Desktop
- Safe Area Inset สำหรับอุปกรณ์ที่มี Notch หรือ Home Bar
- คอนทราสต์ของสีข้อความและปุ่มอ่านง่าย สบายตา
- คีย์บอร์ดสามารถใช้งานและปิดหน้าต่างด้วยปุ่ม Escape

---

## 📄 License
MIT License © 2026 MooAuan Studio & DUO POP Team.
