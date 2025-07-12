// JavaScript source code
// backend/routes/matching.js
const express = require('express');
const router = express.Router();
const matchingQuestions = require('../data/matchingData');

// GET /api/matching - Lấy tất cả câu hỏi nối nghĩa
router.get('/', (req, res) => {
    const { level, category } = req.query;

    let filteredQuestions = matchingQuestions;

    if (level) {
        filteredQuestions = filteredQuestions.filter(q => q.level === level);
    }

    if (category) {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }

    // Trả về không có correctPairs
    const questionsWithoutAnswers = filteredQuestions.map(q => ({
        id: q.id,
        title: q.title,
        instruction: q.instruction,
        leftColumn: q.leftColumn,
        rightColumn: q.rightColumn,
        level: q.level,
        category: q.category
    }));

    res.json(questionsWithoutAnswers);
});

// GET /api/matching/:id - Lấy một câu hỏi theo ID
router.get('/:id', (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = matchingQuestions.find(q => q.id === questionId);

    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }

    res.json({
        id: question.id,
        title: question.title,
        instruction: question.instruction,
        leftColumn: question.leftColumn,
        rightColumn: question.rightColumn,
        level: question.level,
        category: question.category
    });
});

// POST /api/matching/check - Kiểm tra đáp án
router.post('/check', (req, res) => {
    const { questionId, userPairs } = req.body;

    if (!questionId || !Array.isArray(userPairs)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const question = matchingQuestions.find(q => q.id === questionId);

    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }

    // Kiểm tra từng cặp
    let correctCount = 0;
    const results = userPairs.map(userPair => {
        const isCorrect = question.correctPairs.some(
            correctPair =>
                correctPair.left === userPair.left &&
                correctPair.right === userPair.right
        );
        if (isCorrect) correctCount++;
        return {
            left: userPair.left,
            right: userPair.right,
            isCorrect: isCorrect
        };
    });

    // Tính điểm
    const score = correctCount;
    const total = question.correctPairs.length;
    const percentage = Math.round((score / total) * 100);

    res.json({
        score: score,
        total: total,
        percentage: percentage,
        results: results,
        correctPairs: question.correctPairs,
        message: percentage === 100 ? "Perfect! Excellent work!" :
            percentage >= 75 ? "Good job!" :
                percentage >= 50 ? "Not bad, keep practicing!" :
                    "Keep trying, you can do better!"
    });
});

// GET /api/matching/categories - Lấy danh sách categories
router.get('/info/categories', (req, res) => {
    const categories = [...new Set(matchingQuestions.map(q => q.category))];
    res.json(categories);
});

// GET /api/matching/levels - Lấy danh sách levels
router.get('/info/levels', (req, res) => {
    const levels = [...new Set(matchingQuestions.map(q => q.level))];
    res.json(levels);
});

module.exports = router;
