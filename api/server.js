import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// 1. กำหนดค่า .env (Environment Variables)
dotenv.config();

// 2. กำหนดค่าคงที่
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 3. เริ่มต้น Express App
const app = express();

// 4. Middlewares
// อนุญาตให้ Client เข้าถึงได้ (สำหรับ React/Frontend)
app.use(cors({
    origin: '*', // ควรเปลี่ยนเป็น URL ของ Frontend เมื่อนำไปใช้งานจริง เช่น 'http://localhost:3000'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// ทำให้ Express เข้าใจ JSON body ที่ส่งมาจาก Client
app.use(express.json());

// 5. การเชื่อมต่อฐานข้อมูล MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // ไม่ต้องใส่ตัวเลือก useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify อีกต่อไป
        });
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // ออกจากกระบวนการหากเชื่อมต่อฐานข้อมูลไม่ได้
        process.exit(1);
    }
};

// 6. กำหนด Route หลัก (Test Route)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'SmartV3 API is running! 🚀',
        environment: process.env.NODE_ENV || 'development'
    });
});

// *** ในส่วนนี้คุณจะเพิ่ม Route อื่นๆ เข้ามา (เช่น app.use('/api/users', userRoutes);) ***


// 7. Start Server และ Connect DB
const startServer = async () => {
    // 7.1. เชื่อมต่อฐานข้อมูลก่อน
    await connectDB();

    // 7.2. เริ่ม Server
    app.listen(PORT, () => {
        console.log(`📡 Server is running on port: ${PORT}`);
        console.log(`   Access: http://localhost:${PORT}`);
    });
};

// รันฟังก์ชันเพื่อเริ่มต้นทุกอย่าง
startServer();
