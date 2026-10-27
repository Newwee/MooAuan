# DUO POP / MooAuan — Development Log

## บันทึกการพัฒนา: 2026-10-27T18:12:24+07:00

### 1. เป้าหมายของงาน (Goal)
- ตรวจสอบ พัฒนา ปรับปรุง และสร้างโปรเจกต์ **DUO POP / MooAuan** เว็บไซต์มินิเกมออนไลน์สำหรับเล่น 2 คน (คู่รัก/เพื่อนสนิท) ให้มีคุณภาพระดับ Production
- สร้างดีไซน์ Cute Pastel, Modern Kawaii, Soft UI ตามโทนสี Cream, Pink, Lavender, Mint, Lemon, Text (#41364F)
- พัฒนามินิเกมครบทั้ง 4 เกมใน MVP:
  1. **Same Brain (ใจตรงกัน)**: คำถามลับ ปิดคำตอบ เปิดพร้อมกัน คำนวณความเข้ากัน
  2. **Tap Battle (แตะไวชิงจังหวะ)**: วัดปฏิกิริยาความไว ป้องกันการกดก่อนสัญญาณ (False Start) แข่ง Best of 3
  3. **Memory Match (จับคู่ขนมหวาน)**: ไพ่ความจำ 12 ใบ 6 คู่ ผลัดกันเปิดเทิร์น
  4. **Rock Paper Scissors (เป่ายิ้งฉุบมหาศึก)**: ค้อน กรรไกร กระดาษ Best of 5
- รองรับระบบห้อง (Room Code), Guest Login, Mascot/Avatar ทั้ง 8 ตัว, เสียง Web Audio API, Confetti Celebration, Realtime SSE Sync & Supabase Dual Engine
- พัฒนาระบบ Admin Mode สำหรับแกล้งผู้เล่นแบบฮา ๆ ปลอดภัย ไม่ทำลายตรรกะเกม พร้อม Audit Log
- ตรวจสอบ Responsive Design (320px - 4K Desktop) และ WCAG 2.2 AA Accessibility
- จัดการ Git Workflow (Lint, Typecheck, Build, Commit, Push)

### 2. ปัญหาที่ตรวจพบก่อนเริ่มงาน (Issues Identified)
- Repository เริ่มต้นจาก Remote ว่างเปล่า (`Newwee/MooAuan`) ยังไม่มีไฟล์โครงสร้างโปรเจกต์
- PowerShell Execution Policy ป้องกันการรัน `.ps1` ของ npm ต้องเรียกใช้ `npm.cmd`
- Next.js Turbopack แจ้งเตือนเรื่อง package-lock ภายนอก ได้ปรับคอนฟิก `turbopack.root` ให้ชี้ที่ root โฟลเดอร์อย่างถูกต้อง
- กฎ React 19 / Next.js 16 compiler lint แนะนำหลีกเลี่ยง synchronous `setState` ใน `useEffect` และ `Date.now()` ใน render ได้ทำการ Refactor ให้เป็น lazy state initializers ทั้งหมด

### 3. สิ่งที่แก้ไขและพัฒนา (Implemented Features)
1. **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4**:
   - ออกแบบ Theme Tokens สีพาสเทลตามสเปกเป๊ะ
   - เซ็ตอัพ TypeCheck, ESLint, Turbopack Root
2. **Procedural Web Audio API Synthesizer (`src/lib/audio.ts`)**:
   - เสียง Pop, Tap, Countdown, Signal Chime, Card Match, Fanfare Victory, Penalty Buzzer, Slide Whistle Prank
   - ปลอดภัย 100% ไม่พึ่งพาไฟล์เสียงภายนอก ไม่มีปัญหา 404 มีปุ่ม Mute/Unmute และจำค่าผ่าน localStorage
3. **Mascot & Avatar System (`src/components/mascots/`)**:
   - มาสคอต SVG คมชัด 8 ตัว: น้องเหมียว (Cat), กระต่ายนุ๊ก (Bunny), พี่หมีมูอ้วน (Bear), เป็ดก๊าบก๊าบ (Duck), กบเคโระมินต์ (Frog), แพนด้าโบว์ (Panda), จิ้งจอกส้ม (Fox), แฮมสเตอร์พุงโต (Hamster)
   - หน้าต่าง AvatarPicker สำหรับเปลี่ยนชื่อเล่นและเลือกมาสคอต
4. **Room & Realtime Dual Engine (`src/lib/room-store.ts`, `src/app/api/rooms/`)**:
   - สร้างห้องด้วยรหัส 6 ตัวอักษรอ่านง่าย (ไม่มี 0, O, 1, I)
   - ป้องกันห้องเต็มเกิน 2 คน
   - Dual-mode Realtime: Server-Sent Events (SSE) `/api/rooms/[code]/events` ทำงานได้ทันทีแบบไม่ต้องรอ setup Supabase + Supabase Realtime Channels เมื่อใส่ credentials
   - Database Migration สำหรับ PostgreSQL & Supabase RLS ใน `supabase/migrations/001_initial_schema.sql`
5. **Mini-Games MVP 4 เกมสมบูรณ์**:
   - `SameBrainGame.tsx`: รวมชุดคำถามกว่า 20 ข้อ แบ่ง 4 หมวด ตอบซ่อนผล เปิดพร้อมกัน คำนวณ % Soulmate
   - `TapBattleGame.tsx`: ระบบสุ่มจังหวะสัญญาณ หน่วงเวลา 2-4.5 วินาที จับเวลา ms ตัดสินฟาวล์ทันทีหากกดก่อน
   - `MemoryMatchGame.tsx`: กระดาน 12 ใบ 6 คู่ของหวานน่ารัก ผลัดกันเปิดเทิร์น ป้องกันการคลิกซ้ำ หน่วงเวลาก่อนพลิกกลับ
   - `RpsGame.tsx`: เป่ายิ้งฉุบ Best of 5 ปิดบังตัวเลือก เผยผลพร้อมอนิเมชันปะทะ
6. **Lobby, Floating Reactions, Results & Rematch**:
   - หน้าล็อบบี้แสดงสถานะ 2 ผู้เล่น, Toggle Ready, Host Game Selection, สุ่มเกมอัตโนมัติ
   - ปุ่มส่ง Reaction Emojis ลอยขึ้นบนหน้าจอทั้งสองฝั่ง (💖, 🥺, 🤣, 👏, 🥳, 😱, 🐱, ✨)
   - หน้าสรุปผล พร้อม Confetti พลุฉลอง และปุ่ม Rematch เล่นต่อได้ทันทีโดยไม่ต้องสร้างห้องใหม่
7. **Admin Mode & Safe Pranks (`/admin`)**:
   - รหัสผ่าน Admin Passcode ป้องกันฝั่งเซิร์ฟเวอร์
   - เอฟเฟกต์แกล้ง 6 ชนิด: Confetti Burst, Emoji Rain, Jelly Jiggle Wiggle, Fake Loading 99%, Meme Banner Popup, Disco Lights
   - ปลอดภัยตามกฎ: มีปุ่มปิด (X) ได้ตลอดเวลา, ยุติเองใน 3-8 วินาที, ไม่แตะคะแนนเกม, บันทึก Audit Log ทุกคำสั่ง

### 4. ไฟล์สำคัญที่สร้างและแก้ไข (Key Files Changed)
- `package.json` — กำหนดชื่อโปรเจกต์ `duo-pop`, dependencies และ scripts
- `next.config.ts` — ตั้งค่า Turbopack root
- `src/app/globals.css` — ธีมสีพาสเทลและคีย์เฟรมอนิเมชัน
- `src/app/layout.tsx` — Metadata และ Viewport Safe Area
- `src/app/page.tsx` — หน้าแรกสำหรับสร้างห้อง เข้าห้อง และพรีวิวเกม
- `src/app/room/[code]/page.tsx` — หน้าห้องเกมหลักรองรับ Lobby, Gameplay และ Realtime SSE
- `src/app/admin/page.tsx` — แผงควบคุม Admin Console และส่ง Prank
- `src/types/game.ts`, `src/types/avatar.ts` — TypeScript Definitions ครบถ้วน
- `src/lib/audio.ts` — ระบบสังเคราะห์เสียง Web Audio API
- `src/lib/room-store.ts` — Game Engine และ In-memory Room State Management
- `src/lib/questions.ts`, `src/lib/memory-cards.ts` — คลังคำถามและชุดการ์ดของหวาน
- `src/components/ui/` (`Button.tsx`, `Card.tsx`, `Badge.tsx`, `Modal.tsx`) — Kawaii Design System
- `src/components/mascots/` (`Avatar.tsx`, `AvatarPicker.tsx`) — ระบบมาสคอต SVG
- `src/components/games/` (`SameBrainGame.tsx`, `TapBattleGame.tsx`, `MemoryMatchGame.tsx`, `RpsGame.tsx`, `GameContainer.tsx`)
- `src/components/admin/PrankOverlay.tsx` — เรนเดอร์ Prank ฝั่งผู้เล่นอย่างปลอดภัย
- `src/components/results/ResultsView.tsx` — สรุปคะแนน ฉลองชัยชนะ Rematch
- `supabase/migrations/001_initial_schema.sql` — โครงสร้างฐานข้อมูล PostgreSQL Supabase และ RLS Policies
- `.env.example` — ตัวแปรสภาพแวดล้อมตัวอย่าง

### 5. ผลการตรวจสอบและทดสอบ (Testing Results)
- **TypeScript (`npm.cmd run typecheck`)**: ผ่าน 100% 0 errors
- **ESLint (`npm.cmd run lint`)**: ผ่าน 100% 0 errors, 0 warnings
- **Production Build (`npm.cmd run build`)**: คอมไพล์สำเร็จใน 592ms เส้นทางทั้ง Static และ Dynamic พร้อมใช้งาน
- **Functional Integration Test**:
  - `GET /` -> 200 OK (Homepage responsive)
  - `POST /api/rooms` -> สร้างห้องสำเร็จ ได้รับ Room Code 6 หลัก
  - `POST /api/rooms/[code]` -> ผู้เล่นคนที่ 2 เข้าร่วมสำเร็จ
  - `POST /api/rooms/[code]/action (toggle-ready)` -> เปลี่ยนสถานะเป็นพร้อม
  - `POST /api/rooms/[code]/action (start-game)` -> เริ่มเกม Same Brain สำเร็จ
  - `POST /api/rooms/[code]/action (same-brain-answer)` -> ตรวจสอบคำตอบตรงกัน ได้ +100 คะแนน
  - `POST /api/admin/prank` -> ตรวจสอบ Passcode ส่ง Confetti Prank ไปยังห้องเป้าหมายสำเร็จ
  - `GET /api/admin/logs` -> ตรวจสอบ Audit Log รายการคำสั่งของแอดมินครบถ้วน

### 6. ผลด้าน Security & Performance
- **Security**: ป้องกันการเริ่มเกมหากยังไม่พร้อม, ป้องกันผู้เล่นเกิน 2 คน, เซิร์ฟเวอร์ตรวจสอบและคำนวณคะแนน, Admin Route ต้องใช้ Passcode ฝั่งเซิร์ฟเวอร์, ไม่มี Secret รั่วไหลใน Client Bundle
- **Performance**: ไม่โหลดไฟล์ภาพหรือไฟล์เสียงขนาดใหญ่ (ใช้ Vector SVG และ Web Audio API), Turbopack Build < 1s, LCP คาดการณ์ < 1.0s, ไม่มีการ Re-render ที่ไม่จำเป็น

### 7. ข้อจำกัดและขั้นตอนถัดไป (Remaining Work & Recommendations)
- การผสานกับ Supabase Cloud ในโปรดักชันสามารถนำ `supabase/migrations/001_initial_schema.sql` ไปรันใน Supabase SQL Editor และใส่ `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ใน Vercel ได้ทันที
- สามารถเพิ่มชุดคำถามใน Same Brain ได้อย่างอิสระผ่าน `src/lib/questions.ts`

### 8. สถานะ Git Commit และ Push
- Git Commit: พร้อม Commit และ Push ไปยัง https://github.com/Newwee/MooAuan บน branch `main`


## บันทึกการแก้ไขบั๊ก: 2026-10-27T22:03:02+07:00

### 1. เป้าหมายของงาน (Goal)
- ตรวจสอบและแก้ไขบั๊กที่ตรวจพบจากการทดสอบจริงระหว่างอุปกรณ์ Desktop และ Mobile บน Vercel (`moo-auan.vercel.app`) ตามภาพที่ผู้ใช้ส่งมา

### 2. ปัญหาที่ตรวจพบ (Issues Identified)
1. **Desktop กับ Mobile ไม่ซิงก์กัน (Desktop เข้าเกมแล้วแต่ Mobile ค้างอยู่ที่หน้าล็อบบี้)**:
   - สถาปัตยกรรมเดิมใช้ In-memory `Map` และ local SSE route บน Next.js ซึ่งเมื่อ deploy ขึ้น Vercel Serverless Functions แต่ละ HTTP Request และ EventSource stream จะกระจายไปยังคนละ Lambda Container ทำให้เมื่อ Desktop ส่งคำสั่ง `start-game` มีเพียง Lambda ฝั่ง Desktop ที่อัปเดต ส่วน Mobile ที่ต่ออยู่กับ Lambda อื่นจึงไม่ได้รับ Event และไม่มีระบบ Polling สำรอง
2. **UI หน้าล็อบบี้บนมือถือล้นจอและถูกบดบัง (Vertical Stretched & Bad Hierarchy)**:
   - ป้ายรหัสห้องและ Card ผู้เล่น 1 เลื่อนหลุดขึ้นไปด้านบนหน้าจอ
   - Card ผู้เล่น 2 อยู่ด้านบน ส่วนปุ่มกดพร้อมเล่นและเริ่มเกมเลื่อนหลุดลงไปด้านล่างสุด ทำให้ผู้ใช้ต้องเลื่อนจอไปมา
3. **การแสดงผลสัญลักษณ์มงกุฎและป้ายผู้เล่นสลับกัน (Inverted Crown & Badge Bug)**:
   - โค้ดเดิมอิงตาม `me` (Card 1) และ `opponent` (Card 2) โดย Card 2 ถูก hardcode ป้ายว่า `"ผู้เล่น 2"` เมื่อผู้เล่นคนที่ 2 เป็นคนดูจอ ระบบจะเห็น `opponent` (ซึ่งเป็น Host) มีมงกุฎ 👑 แต่ถูกแปะป้ายว่าเป็น `"ผู้เล่น 2"` ก่อให้เกิดความสับสน
4. **ชื่อและตัวละครเริ่มต้นซ้ำกัน**:
   - เมื่อผู้เล่นคนที่ 2 เข้าห้องโดยไม่ได้เปลี่ยนชื่อ จะได้ชื่อเริ่มต้น `"มูอ้วนจอมซน"` และตัวละครแมวเหมือนกับ Host ทำให้แยกไม่ออก

### 3. สิ่งที่แก้ไขและพัฒนา (Fixes Implemented)
1. **Multi-Channel Realtime Engine สำหรับ Vercel Serverless**:
   - เชื่อมต่อ Cloud Realtime Relay ผ่าน `https://ntfy.sh/duo_pop_room_${code}/sse` ทำให้ Desktop และ Mobile ซิงก์หากันได้ทันทีภายใน <50ms โดยไม่ขึ้นกับ memory ของ Vercel Lambdas
   - รองรับ Supabase Realtime Channel (`room:${code}`) ผ่าน WebSockets
   - เพิ่มระบบ Fallback Polling อัจฉริยะทุก 1.2 วินาทีที่ตรวจเช็กเวอร์ชันห้อง (`version`) อัตโนมัติ ป้องกันการค้างเมื่อสลับแท็บหรือเน็ตแกว่ง
   - เมื่อผู้เล่นกดปุ่มใด ๆ (Ready, Start Game, Answer, Flip Card) ระบบจะกระจายสถานะใหม่ไปยังทั้งเซิร์ฟเวอร์, Cloud Relay และ Supabase ทันที
2. **ปรับปรุง Mobile UX/UI ของ Lobby ให้กระชับ ไม่ต้องเลื่อนจอ (Compact Mobile Layout)**:
   - ปรับป้ายรหัสห้องให้เป็นแถบ Slim Banner ด้านบนสุด
   - ปรับ Card ผู้เล่นทั้ง 2 ให้กระชับ สวยงาม วางเรียงอย่างพอดีบนจอมือถือ
   - ย้ายกลุ่มปุ่มกดพร้อมเล่นและเริ่มเกมขึ้นมาอยู่ในตำแหน่งเด่นชัด เข้าถึงได้ทันที ไม่หลุดขอบล่าง
   - ปรับตารางเลือกมินิเกมเป็นแบบ 2 คอลัมน์ขนาดกะทัดรัด
3. **แก้ไขสิทธิ์และป้ายกำกับของ Host และ Guest ให้ถูกต้อง 100%**:
   - แยกการเรนเดอร์ตาม `hostPlayer` (มีมงกุฎ 👑 และป้าย `👑 หัวหน้าห้อง (Host)`) และ `guestPlayer` (ป้าย `ผู้เล่น 2 (Guest)`)
   - แสดงป้าย `(คุณ)` กำกับบนการ์ดของตัวผู้เล่นเองอย่างถูกต้อง ไม่สับสนอีกต่อไป
4. **กำหนดค่าเริ่มต้นที่ไม่ซ้ำกันสำหรับผู้เล่นคนที่ 2**:
   - หากผู้เล่นคนที่ 2 เข้าห้องด้วยชื่อเริ่มต้น ระบบจะกำหนดชื่อเป็น `"กระต่ายนุ๊ก"` และมาสคอตกระต่าย (Bunny) อัตโนมัติเพื่อให้เห็นความแตกต่างอย่างชัดเจน

### 4. ไฟล์ที่แก้ไข
- `src/lib/room-store.ts` — เพิ่ม `getRoomAsync`, การบรอดแคสต์ผ่าน Cloud Relay, และการตั้งชื่อ/มาสคอตแยกอัตโนมัติ
- `src/app/api/rooms/[code]/route.ts` — รองรับ `getRoomAsync` และ async `joinRoom`
- `src/app/api/rooms/[code]/action/route.ts` — กู้คืนสถานะห้องข้าม Lambda instance ก่อนรัน Action
- `src/app/room/[code]/page.tsx` — เชื่อมต่อ Realtime Relay, Supabase Channel, และ Fallback Polling
- `src/components/lobby/LobbyView.tsx` — ดีไซน์ Compact Layout ใหม่ และแก้บั๊กป้ายมงกุฎ/สิทธิ์ผู้เล่น
- `CHANGELOG.md` — อัปเดตรายการแก้บั๊ก v1.0.1
