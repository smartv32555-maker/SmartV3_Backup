/**
 * db_connector.js - ตัวเชื่อมต่อฐานข้อมูล
 * * ไฟล์นี้ถูกออกแบบมาให้เป็น "ตัวกลาง" ในการติดต่อฐานข้อมูล MongoDB
 * ในช่วงที่ยังไม่ได้รับ Connection String จริง เราจะใช้ข้อมูลจำลอง (Mock Data) 
 * เพื่อให้ส่วนอื่นๆ ของแอปพลิเคชันสามารถทำงานและทดสอบได้
 */

// ----------------------------------------------------------------
// ส่วนที่ 1: ข้อมูลจำลอง (Mock Data)
// ----------------------------------------------------------------
// นี่คือข้อมูลที่เราจะใช้ "ปลอม" ขึ้นมา เพื่อให้แอปพลิเคชันมีอะไรแสดงผล
const mockLeaderboardData = [
    { id: 'u001', name: 'วีรบุรุษ A', score: 9850, date: '2025-10-20' },
    { id: 'u002', name: 'คู่หูผู้กล้า B', score: 9210, date: '2025-10-21' },
    { id: 'u003', name: 'นักสู้พิทักษ์โลก C', score: 8700, date: '2025-10-20' },
    { id: 'u004', name: 'ผู้กล้าไร้นาม D', score: 7550, date: '2025-10-22' },
];

// ตัวแปรสำหรับ Connection String จริง (เตรียมรอไว้)
const MONGODB_URI = ""; // เมื่อ MongoDB ส่งอีเมลมา ให้เอา URI จริงมาใส่ที่นี่

let isConnected = false;

// ----------------------------------------------------------------
// ส่วนที่ 2: ฟังก์ชันการเชื่อมต่อ (เมื่อได้ URI จริง)
// ----------------------------------------------------------------

/**
 * ฟังก์ชันจำลองการเชื่อมต่อฐานข้อมูล
 * (ตอนนี้ยังไม่มีการเชื่อมต่อจริง รอ URI จาก MongoDB)
 */
async function connectToDatabase() {
    if (isConnected) {
        console.log("Status: ฐานข้อมูลเชื่อมต่ออยู่แล้ว");
        return;
    }

    if (MONGODB_URI) {
        // *** เมื่อได้ URI จริง ให้ลบส่วนนี้ออก และใส่โค้ดเชื่อมต่อ MongoDB จริงๆ ***
        // เช่น: await MongoClient.connect(MONGODB_URI, { ... });
        // *** --------------------------------------------------------- ***
        console.log("Status: กำลังเชื่อมต่อ MongoDB จริง (เมื่อได้ URI แล้ว)");
        isConnected = true;
    } else {
        console.warn("WARNING: ยังไม่ได้ใส่ MONGODB_URI. จะใช้ข้อมูลจำลอง.");
    }
}

// ----------------------------------------------------------------
// ส่วนที่ 3: ฟังก์ชันดึง/บันทึกข้อมูล (ใช้ Mock Data ไปก่อน)
// ----------------------------------------------------------------

/**
 * ดึงข้อมูล Leaderboard
 * @returns {Promise<Array<Object>>} ข้อมูลผู้เล่น
 */
export async function getLeaderboard() {
    await connectToDatabase(); // ลองเชื่อมต่อ (แต่ตอนนี้อาจจะใช้ Mock)
    
    if (MONGODB_URI && isConnected) {
        // *** เมื่อเชื่อมต่อ MongoDB จริง ให้ใส่โค้ดดึงข้อมูลจริงจาก DB ที่นี่ ***
        // เช่น: return await db.collection('scores').find().sort({ score: -1 }).toArray();
        console.log("LOG: กำลังดึงข้อมูลจาก MongoDB จริง...");
        // ให้คืนค่า Mock ไปก่อนจนกว่าจะใส่โค้ดจริง
        return mockLeaderboardData.sort((a, b) => b.score - a.score); 
    } else {
        // ใช้ข้อมูลจำลอง
        console.log("LOG: ดึงข้อมูลจำลอง (Mock Data) มาแสดงผล");
        // จัดเรียงข้อมูลจำลองตามคะแนน เพื่อให้เหมือนจริง
        return mockLeaderboardData.sort((a, b) => b.score - a.score); 
    }
}

/**
 * บันทึกคะแนนใหม่
 * @param {Object} data ข้อมูลคะแนนใหม่ที่ต้องการบันทึก
 */
export async function saveNewScore(data) {
    await connectToDatabase();
    
    if (MONGODB_URI && isConnected) {
        // *** เมื่อเชื่อมต่อ MongoDB จริง ให้ใส่โค้ดบันทึกข้อมูลจริงที่นี่ ***
        // เช่น: await db.collection('scores').insertOne(data);
        console.log(`LOG: บันทึกข้อมูลจริง (แต่ตอนนี้แค่ Log): ${JSON.stringify(data)}`);
    } else {
        // ในโหมดจำลอง เราแค่แสดงผลใน Console
        console.log(`LOG: โหมดจำลอง! บันทึกคะแนนใหม่: ${JSON.stringify(data)}`);
        // ในโปรเจกต์จริง อาจเพิ่มข้อมูลนี้เข้าไปใน mockLeaderboardData ด้วยก็ได้
    }
}
