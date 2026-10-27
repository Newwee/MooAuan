# Changelog

All notable changes to the **DUO POP / MooAuan** project will be documented in this file.

## [1.0.2] - 2026-10-27

### Fixed
- **Same Brain Game Round Progression ("กดทั้งคู่แต่เกมไม่ไปต่อ")**:
  - Fixed client state lingering where `selectedLocal` was retained across rounds, preventing players from clicking answers on subsequent questions. Replaced with pure derived state `selectedAnswer?.questionIndex === state.questionIndex`.
  - Added an automatic 4-second countdown timer upon answer reveal that auto-advances both players without requiring manual clicks, while retaining the instant "คำถามถัดไป ➔" button for fast skipping.
  - Fixed server-side question progression: questions are now stored on room initialization (`sb.questions`), avoiding reshuffling on every round.
  - Fixed dual-answer detection by checking active room players (`slice(0, 2)`).
- **Bot / Link Crawler Auto-Joining Rooms ("เวลาสร้างห้องชอบมีเหมือนบอทเข้ามา")**:
  - Removed unconditional `POST /api/rooms/[code]` on room URL mount. Initial page load now performs a safe read-only `GET` request.
  - Added an interactive **"คำเชิญเข้าห้อง (Join Room Invitation)"** card for visitors not yet in the room. Joining requires a real human click on "เข้าร่วมห้องเลย! 💖", which web crawlers and link preview bots never execute.
  - Added Host "เตะออก ✕ (Kick Player)" feature in `LobbyView` to instantly expel any unwanted or accidental joins.
  - Obfuscated cloud relay topic using salted room hash (`getCloudTopic(code)`) to prevent public topic scanners from snooping or injecting events.
- **Direct Nickname Customization ("สามารถตั้งชื่อเล่นได้ด้วย")**:
  - Added a prominent **"🏷️ ตั้งชื่อเล่นของคุณ (Nickname)"** text input directly in the Homepage Hero section with live local persistence.
  - Added direct nickname input inside the Join Room Invitation card on `/room/[code]` so guests joining via shared links can type their nickname before entering.
  - Enhanced lobby cards with a clear "แก้ไขชื่อ / ตัวละคร ✏️" button for both Host and Guest to edit their profile anytime.

## [1.0.1] - 2026-10-27

### Fixed
- **Multi-Device Sync on Vercel Serverless**:
  - Implemented multi-channel Realtime engine using Cloud Relay (`ntfy.sh/duo_pop_room_*`) and Supabase Realtime channels to overcome Vercel Lambda memory isolation.
  - Added 1.2s auto-polling fallback with room state versioning to guarantee instant state sync when games start or answers are submitted.
- **Mobile Lobby Layout Overflow**:
  - Redesigned `LobbyView` to be compact and mobile-first, ensuring player cards and action buttons fit comfortably without vertical scrolling.
- **Inverted Crown & Badge Role Display**:
  - Fixed player identification logic in `LobbyView` so the Host is always labeled "หัวหน้าห้อง (Host)" with the crown, and the Guest is labeled "ผู้เล่น 2 (Guest)", with "(คุณ)" tagged dynamically on the viewer's card.
- **Duplicate Avatar/Nickname for Player 2**:
  - Auto-assigned distinct name ("กระต่ายนุ๊ก") and avatar ("bunny") for Player 2 if joining with default host credentials.

## [1.0.0] - 2026-10-27

### Added
- **Core Architecture**:
  - Initialized Next.js 16 (App Router) with TypeScript and Tailwind CSS v4.
  - Setup Turbopack root configuration for instant fast compilation.
  - Configured strict ESLint & TypeScript validation rules.
- **Cute Pastel Design System**:
  - Integrated visual identity: Cream (#FFF7F4), Pastel Pink (#FFB8D2), Lavender (#CDBEFF), Mint (#B9F0D5), Lemon (#FFE89A), and Contrast Text (#41364F).
  - Built handcrafted reusable UI components: `Button` (with soft 3D squish), `Card`, `Badge`, `Modal`.
  - Added ReactBits-inspired animated background `FloatingDuoBackground` with ambient glow and floating particles.
- **Mascot & Avatar System**:
  - Designed 8 crisp SVG mascots: Cat (เหมียว), Bunny (กระต่ายนุ๊ก), Bear (พี่หมีมูอ้วน), Duck (เป็ดก๊าบ), Frog (กบเคโระ), Panda (แพนด้าโบว์), Fox (จิ้งจอกส้ม), Hamster (แฮมสเตอร์พุงโต).
  - Built `AvatarPicker` for instant nickname customization and avatar switching.
- **Web Audio API Procedural Synthesizer**:
  - Built zero-dependency procedural audio generator (`src/lib/audio.ts`): pop, tap, tick, go chime, match chord, fanfare victory, buzzer, slide whistle.
  - Added Mute toggle and Volume persistence in `localStorage`.
- **Room & Multiplayer Engine**:
  - Implemented 6-character room codes (`/api/rooms`, `/api/rooms/[code]`).
  - Strict 2-player capacity, host privileges, and reconnect handling.
  - Realtime Server-Sent Events (SSE) stream (`/api/rooms/[code]/events`) for instant zero-config play.
  - Prepared PostgreSQL schema & RLS policies in `supabase/migrations/001_initial_schema.sql`.
- **4 MVP Mini-Games**:
  - **Same Brain (ใจตรงกัน)**: Simultaneous prompt, hidden selection, reveal, match scoring, and soulmate compatibility percentage.
  - **Tap Battle (แตะไวชิงจังหวะ)**: Randomized delay, false-start penalty, accurate reaction time in milliseconds, Best of 3.
  - **Memory Match (จับคู่ขนมหวาน)**: 12-card synchronized grid (6 dessert pairs), turn-based flip, mismatch auto-reset.
  - **Rock Paper Scissors (เป่ายิ้งฉุบมหาศึก)**: Rock/Paper/Scissors clash, Best of 5, simultaneous reveal.
- **Interactive Player Engagement**:
  - Floating Reaction Emoji bar (`ReactionFloater`) for live expressions during gameplay.
  - Match Results screen with confetti celebration and instant rematch without room recreation.
- **Admin & Safe Prank Mode**:
  - Protected Admin portal at `/admin` with server passcode authentication.
  - 6 harmless, entertaining prank triggers: Confetti burst, Emoji rain, Jelly shake, Fake 99% download, Meme popups, Disco lights.
  - Built-in audit log at `/api/admin/logs`.
