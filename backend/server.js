// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000; 

// Import các route module
const quizRoutes = require('./routes/quiz');
const matchingRoutes = require('./routes/matching');
const fillBlanksRoutes = require('./routes/fillBlanks');

// Middleware
app.use(cors());
app.use(express.json());

// Sử dụng các route module
app.use('/api/quiz', quizRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/fill-blanks', fillBlanksRoutes);

// Route chào mừng
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to English Learning API',
        modules: [
            { name: 'Quiz', endpoint: '/api/quiz' },
            { name: 'Matching', endpoint: '/api/matching' },
            { name: 'Fill Blanks', endpoint: '/api/fill-blanks' }
        ]
    });
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});
