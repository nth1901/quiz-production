// JavaScript sourc// backend/routes/quiz.js
const express = require('express');
const router = express.Router(); // Tạo router riêng cho module
const quizQuestions = require('../data/quizData'); // Import dữ liệu

// GET /api/quiz - Lấy tất cả câu hỏi
router.get('/', (req, res) => {
    // Có thể filter theo level hoặc category nếu cần
    const { level, category } = req.query;

    let filteredQuestions = quizQuestions;

    // Filter theo level nếu có
    if (level) {
        filteredQuestions = filteredQuestions.filter(q => q.level === level);
    }

    // Filter theo category nếu có
    if (category) {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }

    // Trả về câu hỏi không có đáp án
    const questionsWithoutAnswers = filteredQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        level: q.level,
        category: q.category
    }));

    res.json(questionsWithoutAnswers);
});

// GET /api/quiz/:id - Lấy một câu hỏi theo ID
router.get('/:id', (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = quizQuestions.find(q => q.id === questionId);

    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }

    // Trả về không có đáp án
    res.json({
        id: question.id,
        question: question.question,
        options: question.options,
        level: question.level,
        category: question.category
    });
});

// POST /api/quiz/check - Kiểm tra đáp án
router.post('/check', (req, res) => {
    const { questionId, selectedAnswer } = req.body;

    // Validate input
    if (!questionId || selectedAnswer === undefined) {
        return res.status(400).json({ error: "Missing questionId or selectedAnswer" });
    }

    const question = quizQuestions.find(q => q.id === questionId);

    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    res.json({
        isCorrect: isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: isCorrect ? "Correct! Well done!" : "Incorrect. Try again!"
    });
});

// POST /api/quiz/check-multiple - Kiểm tra nhiều câu cùng lúc
router.post('/check-multiple', (req, res) => {
    const { answers } = req.body; // answers: [{questionId: 1, selectedAnswer: 0}, ...]

    if (!Array.isArray(answers)) {
        return res.status(400).json({ error: "Invalid answers format" });
    }

    const results = answers.map(answer => {
        const question = quizQuestions.find(q => q.id === answer.questionId);
        if (!question) {
            return { questionId: answer.questionId, error: "Question not found" };
        }

        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        return {
            questionId: answer.questionId,
            isCorrect: isCorrect,
            correctAnswer: question.correctAnswer
        };
    });

    const score = results.filter(r => r.isCorrect).length;
    const total = results.length;

    res.json({
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        results: results
    });
});

module.exports = router; // Export router

