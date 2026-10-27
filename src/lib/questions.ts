import { QuestionData } from '@/types/game';

export const SAME_BRAIN_QUESTIONS: QuestionData[] = [
  // 1. เรื่องกินเรื่องใหญ่
  {
    id: 'food_1',
    category: 'เรื่องกินเรื่องใหญ่',
    promptTh: 'ถ้าหิวตอน 5 ทุ่ม เมนูที่ต้องกดสั่งทันทีคืออะไร?',
    promptEn: 'Late night craving at 11 PM: What are you ordering?',
    options: [
      { id: 'a', textTh: 'หม่าล่าหม้อไฟรสแซ่บ', textEn: 'Spicy Mala Hotpot', emoji: '🍲' },
      { id: 'b', textTh: 'ชานมไข่มุกหวานร้อย', textEn: 'Boba Milk Tea 100% Sweet', emoji: '🧋' },
      { id: 'c', textTh: 'มาม่าต้มยำใส่ไข่ลวก', textEn: 'Instant Noodles + Egg', emoji: '🍜' },
      { id: 'd', textTh: 'ไก่ทอดกรอบซอสเกาหลี', textEn: 'Crispy Fried Chicken', emoji: '🍗' },
    ],
  },
  {
    id: 'food_2',
    category: 'เรื่องกินเรื่องใหญ่',
    promptTh: 'หมูกระทะ สิ่งแรกที่ต้องคีบลงกระทะคือ?',
    promptEn: 'Mookata barbecue: What goes onto the grill first?',
    options: [
      { id: 'a', textTh: 'สามชั้นหมักนุ่มๆ', textEn: 'Pork Belly slices', emoji: '🥓' },
      { id: 'b', textTh: 'กะหล่ำปลีฝอยลงต้ม', textEn: 'Cabbage into the soup', emoji: '🥬' },
      { id: 'c', textTh: 'มันหมูถูให้ทั่วกระทะ', textEn: 'Pork lard to grease grill', emoji: '🧈' },
      { id: 'd', textTh: 'กุ้งแม่น้ำตัวโต', textEn: 'River Prawn', emoji: '🦐' },
    ],
  },
  {
    id: 'food_3',
    category: 'เรื่องกินเรื่องใหญ่',
    promptTh: 'ของหวานที่เยียวยาจิตใจได้ดีที่สุด?',
    promptEn: 'Best soul-healing dessert?',
    options: [
      { id: 'a', textTh: 'บิงซูสตรอว์เบอร์รี', textEn: 'Strawberry Bingsu', emoji: '🍧' },
      { id: 'b', textTh: 'ครัวซองต์เนยฉ่ำๆ', textEn: 'Buttery Croissant', emoji: '🥐' },
      { id: 'c', textTh: 'ไอศกรีมช็อกโกแลตฟัดจ์', textEn: 'Chocolate Fudge Ice Cream', emoji: '🍨' },
      { id: 'd', textTh: 'โรตีกรอบใส่นมข้นหวาน', textEn: 'Crispy Roti with condensed milk', emoji: '🥞' },
    ],
  },
  {
    id: 'food_4',
    category: 'เรื่องกินเรื่องใหญ่',
    promptTh: 'ส้มตำจานโปรด รสชาติที่สั่งประจำคือ?',
    promptEn: 'Your go-to Papaya Salad order?',
    options: [
      { id: 'a', textTh: 'ตำไทยไข่เค็ม เปรี้ยวหวาน', textEn: 'Tum Thai Salted Egg', emoji: '🥗' },
      { id: 'b', textTh: 'ตำปูปลาร้า พริก 10 เม็ด', textEn: 'Tum Pu Plara extra spicy', emoji: '🌶️' },
      { id: 'c', textTh: 'ตำข้าวโพดกุ้งสด', textEn: 'Corn Salad with fresh shrimp', emoji: '🌽' },
      { id: 'd', textTh: 'ตำซั่วแคบหมูกรอบ', textEn: 'Tum Sua with crispy pork rinds', emoji: '🥓' },
    ],
  },
  {
    id: 'food_5',
    category: 'เรื่องกินเรื่องใหญ่',
    promptTh: 'เครื่องดื่มประจำร้านกาแฟ?',
    promptEn: 'Your everyday cafe drink order?',
    options: [
      { id: 'a', textTh: 'อเมริกาโน่เย็น ไม่หวาน', textEn: 'Iced Americano No Sugar', emoji: '☕' },
      { id: 'b', textTh: 'มัทฉะลาเต้ หวานน้อย', textEn: 'Matcha Latte Low Sweet', emoji: '🍵' },
      { id: 'c', textTh: 'คาราเมลมัคคิอาโต หอมหวาน', textEn: 'Caramel Macchiato', emoji: '🍯' },
      { id: 'd', textTh: 'ชาไทยเย็น หวานมัน', textEn: 'Authentic Thai Iced Tea', emoji: '🧋' },
    ],
  },

  // 2. แฟน & ความรัก (Romance & Vibes)
  {
    id: 'romance_1',
    category: 'แฟน & ความรัก',
    promptTh: 'เดทแรกในฝัน อยากไปที่ไหนที่สุด?',
    promptEn: 'Dream first date location?',
    options: [
      { id: 'a', textTh: 'พิพิธภัณฑ์สัตว์น้ำ ดูเพนกวิน', textEn: 'Aquarium watching sea life', emoji: '🐬' },
      { id: 'b', textTh: 'คาเฟ่แมว นั่งลูบพุงแมว', textEn: 'Cat Cafe cuddling kitties', emoji: '🐱' },
      { id: 'c', textTh: 'สวนสนุก เล่นเครื่องเล่นหวาดเสียว', textEn: 'Theme Park rollercoasters', emoji: '🎢' },
      { id: 'd', textTh: 'นอนดูซีรีส์กินป๊อปคอร์นที่ห้อง', textEn: 'Cozy movie night at home', emoji: '🍿' },
    ],
  },
  {
    id: 'romance_2',
    category: 'แฟน & ความรัก',
    promptTh: 'เวลาแฟนงอน วิธีง้อที่มีประสิทธิภาพที่สุด?',
    promptEn: 'Best way to reconcile when your partner is pouting?',
    options: [
      { id: 'a', textTh: 'พาไปกินของอร่อยที่ชอบ', textEn: 'Take them to their favorite food', emoji: '🍣' },
      { id: 'b', textTh: 'กอดแน่นๆ แล้วพูดเสียงสอง', textEn: 'Big warm hugs + soft baby voice', emoji: '🤗' },
      { id: 'c', textTh: 'โอนเงินพร้อมแนบสลิปหัวใจ', textEn: 'Transfer allowance with love note', emoji: '💸' },
      { id: 'd', textTh: 'นั่งฟังอย่างตั้งใจและขอโทษจริงใจ', textEn: 'Listen patiently & sincere apology', emoji: '💐' },
    ],
  },
  {
    id: 'romance_3',
    category: 'แฟน & ความรัก',
    promptTh: 'ของขวัญวันครบรอบที่อยากได้ที่สุด?',
    promptEn: 'Most wished anniversary gift?',
    options: [
      { id: 'a', textTh: 'ทริปเที่ยวต่างจังหวัด 3 วัน 2 คืน', textEn: 'Getaway trip for 3 days 2 nights', emoji: '✈️' },
      { id: 'b', textTh: 'การ์ดเขียนมือกับอัลบั้มรูปคู่', textEn: 'Handwritten letter + photo book', emoji: '💌' },
      { id: 'c', textTh: 'ของที่อยากได้มานาน (แกดเจ็ต/ของใช้)', textEn: 'Wishlist gadget or fashion item', emoji: '🎁' },
      { id: 'd', textTh: 'มื้อดินเนอร์ใต้แสงเทียนสุดหรู', textEn: 'Romantic candlelit fine dining', emoji: '🕯️' },
    ],
  },
  {
    id: 'romance_4',
    category: 'แฟน & ความรัก',
    promptTh: 'โมเมนต์ที่รู้สึกว่าอีกคน "น่ารักที่สุด"?',
    promptEn: 'Moment when your partner looks cutest?',
    options: [
      { id: 'a', textTh: 'ตอนกินของอร่อยแล้วตาโตยิ้มแป้น', textEn: 'Eyes light up eating yummy food', emoji: '😋' },
      { id: 'b', textTh: 'ตอนเพิ่งตื่นหัวฟูๆ หน้ามึนๆ', textEn: 'Sleepy bedhead morning face', emoji: '🥱' },
      { id: 'c', textTh: 'ตอนตั้งใจทำอะไรสักอย่างจนลืมมองเรา', textEn: 'Super focused on their passion', emoji: '✨' },
      { id: 'd', textTh: 'ตอนทำตัวเป็นเด็กขี้อ้อน', textEn: 'Acting clingy and sweet', emoji: '🥺' },
    ],
  },

  // 3. วันหยุด & ไลฟ์สไตล์ (Weekend & Lifestyle)
  {
    id: 'life_1',
    category: 'วันหยุด & ไลฟ์สไตล์',
    promptTh: 'วันเสาร์ที่ไม่มีธุระ อยากตื่นกี่โมง?',
    promptEn: 'Lazy Saturday with no plans: Wake up time?',
    options: [
      { id: 'a', textTh: 'ตื่นเช้า 7 โมง สดชื่นวิ่งออกกำลังกาย', textEn: '7:00 AM energetic morning jog', emoji: '🏃' },
      { id: 'b', textTh: 'ตื่นสายๆ 10 โมง กำลังสบาย', textEn: '10:00 AM nice & relaxed brunch', emoji: '🥞' },
      { id: 'c', textTh: 'บ่ายโมงไปเลย นอนชดเชยทั้งสัปดาห์', textEn: '1:00 PM sleep marathon', emoji: '🛌' },
      { id: 'd', textTh: 'ไม่ตั้งนาฬิกาปลุก ตื่นเมื่อไหร่ก็เมื่อนั้น', textEn: 'No alarm, whenever body wants', emoji: '😴' },
    ],
  },
  {
    id: 'life_2',
    category: 'วันหยุด & ไลฟ์สไตล์',
    promptTh: 'ถ้าได้ตั๋วเครื่องบินฟรี 1 ใบ ปลายทางคือ?',
    promptEn: 'Free plane ticket! Where are you flying?',
    options: [
      { id: 'a', textTh: 'ญี่ปุ่น กินราเมง ชมซากุระ', textEn: 'Japan: Ramen & Cherry blossoms', emoji: '🗾' },
      { id: 'b', textTh: 'สวิตเซอร์แลนด์ นั่งรถไฟชมเทือกเขา', textEn: 'Switzerland: Alpine scenic train', emoji: '🏔️' },
      { id: 'c', textTh: 'เกาหลีใต้ ช้อปปิ้ง คาเฟ่ฮอปปิ้ง', textEn: 'South Korea: K-fashion & Cafes', emoji: '🇰🇷' },
      { id: 'd', textTh: 'มัลดีฟส์ นอนวิลล่าเหนือน้ำทะเลใส', textEn: 'Maldives: Overwater villa luxury', emoji: '🏝️' },
    ],
  },
  {
    id: 'life_3',
    category: 'วันหยุด & ไลฟ์สไตล์',
    promptTh: 'แนวภาพยนตร์ที่ชอบเปิดดูตอนว่าง?',
    promptEn: 'Favorite movie genre for movie night?',
    options: [
      { id: 'a', textTh: 'รอมคอม อบอุ่นหัวใจ ยิ้มตามทั้งเรื่อง', textEn: 'Romantic Comedy & Feel Good', emoji: '💖' },
      { id: 'b', textTh: 'สยองขวัญ สั่นประสาท กรี๊ดลั่นบ้าน', textEn: 'Horror / Thriller jumpscares', emoji: '👻' },
      { id: 'c', textTh: 'แอ็กชัน สืบสวนสอบสวน หักมุม', textEn: 'Action & Mystery mind-benders', emoji: '🕵️' },
      { id: 'd', textTh: 'แอนิเมชันดิสนีย์ / จิบลิ ภาพสวยๆ', textEn: 'Disney / Ghibli cozy animation', emoji: '🎨' },
    ],
  },
  {
    id: 'life_4',
    category: 'วันหยุด & ไลฟ์สไตล์',
    promptTh: 'ถ้าต้องเลี้ยงสัตว์คู่กัน อยากเลี้ยงตัวไหน?',
    promptEn: 'Dream couple pet?',
    options: [
      { id: 'a', textTh: 'น้องแมวส้มตัวอ้วนกลม', textEn: 'Chonky Orange Cat', emoji: '🐱' },
      { id: 'b', textTh: 'น้องหมาโกลเด้นใจดี', textEn: 'Friendly Golden Retriever', emoji: '🐕' },
      { id: 'c', textTh: 'น้องกระต่ายหูตกขนนุ่ม', textEn: 'Fluffy Lop-eared Bunny', emoji: '🐰' },
      { id: 'd', textTh: 'นกแก้วพูดเก่ง คุยเจื้อยแจ้ว', textEn: 'Chatty Smart Parrot', emoji: '🦜' },
    ],
  },

  // 4. ตลกโปกฮา (Funny & Random)
  {
    id: 'funny_1',
    category: 'ตลกโปกฮา',
    promptTh: 'ถ้าวันหนึ่งตื่นมากลายเป็นสัตว์ จะเป็นอะไร?',
    promptEn: 'Wake up transformed into an animal: Which one?',
    options: [
      { id: 'a', textTh: 'แพนด้า มีคนป้อนไผ่นอนทั้งวัน', textEn: 'Panda fed bamboo all day', emoji: '🐼' },
      { id: 'b', textTh: 'นกอินทรี บินไปไหนก็ได้ไม่ต้องซื้อตั๋ว', textEn: 'Eagle flying free anywhere', emoji: '🦅' },
      { id: 'c', textTh: 'คาปิบารา ชิลล์ที่สุดในปฐพี', textEn: 'Capybara zen master', emoji: '🦫' },
      { id: 'd', textTh: 'ปลาโลมา ว่ายน้ำเล่นกับเพื่อน', textEn: 'Playful Dolphin in warm ocean', emoji: '🐬' },
    ],
  },
  {
    id: 'funny_2',
    category: 'ตลกโปกฮา',
    promptTh: 'ถ้าได้พลังวิเศษ 1 อย่าง อยากได้อะไร?',
    promptEn: 'Pick one ultimate superpower!',
    options: [
      { id: 'a', textTh: 'วาร์ปไปที่ไหนในโลกก็ได้ในพริบตา', textEn: 'Instant Teleportation', emoji: '⚡' },
      { id: 'b', textTh: 'อ่านใจคนได้ รู้หมดคิดอะไรอยู่', textEn: 'Mind Reading telepathy', emoji: '🔮' },
      { id: 'c', textTh: 'กินเท่าไหร่ก็ไม่อ้วน สุขภาพดี 100%', textEn: 'Eat unlimited without gaining weight', emoji: '🍕' },
      { id: 'd', textTh: 'หยุดเวลาได้ตอนอยากนอนต่อ', textEn: 'Time Freeze for extra sleep', emoji: '⏳' },
    ],
  },
  {
    id: 'funny_3',
    category: 'ตลกโปกฮา',
    promptTh: 'สถานการณ์ที่เขินจนอยากแทรกแผ่นดินหนี?',
    promptEn: 'Most awkward moment you want to vanish?',
    options: [
      { id: 'a', textTh: 'โบกมือทักคนผิดกลางห้าง', textEn: 'Waving at stranger mistakenly', emoji: '🙋' },
      { id: 'b', textTh: 'ท้องร้องเสียงดังในห้องสอบเงียบๆ', textEn: 'Loud stomach rumble in silent room', emoji: '🔊' },
      { id: 'c', textTh: 'เดินสะดุดขาตัวเองเกือบล้มต่อหน้าคนเยอะๆ', textEn: 'Tripping on flat ground in crowd', emoji: '👟' },
      { id: 'd', textTh: 'ส่งข้อความนินทาผิดกลุ่มเข้ากลุ่มเป้าหมาย', textEn: 'Accidental wrong chat screenshot', emoji: '📱' },
    ],
  },
  {
    id: 'funny_4',
    category: 'ตลกโปกฮา',
    promptTh: 'ฉายาที่เพื่อนชอบเรียกเรามากที่สุด?',
    promptEn: 'Nicknames friends usually give you?',
    options: [
      { id: 'a', textTh: 'เจ้าตัวกินแหลก ไม่เคยอิ่ม', textEn: 'The Bottomless Foodie', emoji: '🍔' },
      { id: 'b', textTh: 'คนขี้เซา ปลุกยากที่สุดในโลก', textEn: 'The Eternal Sleeper', emoji: '💤' },
      { id: 'c', textTh: 'ดาวเด่นสายตลก มุกแป๊กก็ยังฮา', textEn: 'The Chaos Comedian', emoji: '🎪' },
      { id: 'd', textTh: 'คุณแม่ของกลุ่ม คอยดูแลทุกคน', textEn: 'The Group Mom / Caretaker', emoji: '👩‍👧‍👦' },
    ],
  },
];

// Helper to get random subset of questions
export function getRandomQuestions(count: number = 5): QuestionData[] {
  const shuffled = [...SAME_BRAIN_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
