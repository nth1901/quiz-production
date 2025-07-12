// routes/fillBlanks.js
const express = require('express');
const router = express.Router();
const fillBlanksQuestions = require('../data/fillBlanksData');

// GET /api/fill-blanks - Lấy tất cả câu hỏi
router.get('/', (req, res) => {
    const { level, category } = req.query;
    
    let filteredQuestions = fillBlanksQuestions;
    
    if (level) {
        filteredQuestions = filteredQuestions.filter(q => q.level === level);
    }
    
    if (category) {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    
    // Trả về câu hỏi với số chỗ trống thực tế
    const questionsForClient = filteredQuestions.map(q => {
        // Đếm số ___ thực tế trong câu
        const actualBlankCount = (q.sentence.match(/___/g) || []).length;
        
        // Kiểm tra data consistency
        const expectedBlankCount = Array.isArray(q.blanks[0]) ? q.blanks.length : q.blanks.length;
        if (actualBlankCount !== expectedBlankCount) {
            console.warn(`Câu ${q.id}: có ${actualBlankCount} ___ nhưng ${expectedBlankCount} blanks trong data`);
        }
        
        return {
            id: q.id,
            sentence: q.sentence,
            hints: q.hints,
            level: q.level,
            category: q.category,
            blankCount: actualBlankCount // Dùng số ___ thực tế
        };
    });
    
    res.json(questionsForClient);
});

// POST /api/fill-blanks/check - Kiểm tra đáp án một câu
router.post('/check', (req, res) => {
    const { questionId, userAnswers } = req.body;
    
    if (!questionId || !Array.isArray(userAnswers)) {
        return res.status(400).json({ error: "Invalid input format" });
    }
    
    const question = fillBlanksQuestions.find(q => q.id === questionId);
    
    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }
    
    // Kiểm tra từng chỗ trống
    const results = userAnswers.map((answer, index) => {
        let correctAnswers;
        
        // Xử lý cấu trúc data mới - kiểm tra xem blanks có phải array lồng nhau không
        if (Array.isArray(question.blanks[0])) {
            // Nếu blanks là array của arrays: [["already", "just"]]
            correctAnswers = question.blanks[index] || [];
        } else {
            // Nếu blanks là array đơn giản: ["go"]
            // Với câu 4 cũ có 2 phần tử ["already", "just"], cần xử lý đặc biệt
            if (question.blanks.length > 1 && index === 0 && question.id === 4) {
                // Trường hợp đặc biệt cho câu 4 với format cũ
                correctAnswers = question.blanks;
            } else {
                correctAnswers = [question.blanks[index]];
            }
        }
        
        // Đảm bảo correctAnswers luôn là array
        if (!Array.isArray(correctAnswers)) {
            correctAnswers = [correctAnswers];
        }
        
        const isCorrect = correctAnswers.some(
            correct => correct && correct.toLowerCase().trim() === (answer || '').toLowerCase().trim()
        );
        
        return {
            userAnswer: answer || '',
            isCorrect: isCorrect,
            correctAnswers: correctAnswers
        };
    });
    
    const score = results.filter(r => r.isCorrect).length;
    const total = results.length;
    
    res.json({
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        results: results,
        message: score === total ? "Perfect! Excellent work!" : 
                 score > total/2 ? "Good job! Keep it up!" : 
                 "Keep practicing, you can do better!"
    });
});

// POST /api/fill-blanks/check-all - Kiểm tra tất cả câu hỏi
router.post('/check-all', (req, res) => {
    const { answers } = req.body;
    
    if (!Array.isArray(answers)) {
        return res.status(400).json({ error: "Invalid answers format" });
    }
    
    const results = answers.map(answer => {
        const question = fillBlanksQuestions.find(q => q.id === answer.questionId);
        
        if (!question) {
            return { 
                questionId: answer.questionId, 
                error: "Question not found",
                score: 0,
                total: 0,
                results: []
            };
        }
        
        // Đếm số chỗ trống thực tế
        const actualBlankCount = (question.sentence.match(/___/g) || []).length;
        
        // Kiểm tra từng chỗ trống
        const blankResults = answer.userAnswers.map((userAnswer, index) => {
            if (index >= actualBlankCount) {
                return {
                    userAnswer: userAnswer,
                    isCorrect: false,
                    correctAnswers: []
                };
            }
            
            let correctAnswers;
            
            // Xử lý cấu trúc data
            if (Array.isArray(question.blanks[0])) {
                // Format mới: [["already", "just"]]
                correctAnswers = question.blanks[index] || [];
            } else {
                // Format cũ hoặc đơn giản
                if (question.id === 4 && question.blanks.length > actualBlankCount) {
                    // Xử lý đặc biệt cho câu 4 với format cũ
                    correctAnswers = question.blanks; // ["already", "just"]
                } else {
                    correctAnswers = [question.blanks[index]];
                }
            }
            
            // Đảm bảo correctAnswers là array
            if (!Array.isArray(correctAnswers)) {
                correctAnswers = [correctAnswers];
            }
            
            const isCorrect = correctAnswers.some(
                correct => correct && correct.toLowerCase().trim() === (userAnswer || '').toLowerCase().trim()
            );
            
            return {
                userAnswer: userAnswer || '',
                isCorrect: isCorrect,
                correctAnswers: correctAnswers
            };
        });
        
        const score = blankResults.filter(r => r.isCorrect).length;
        
        return {
            questionId: answer.questionId,
            score: score,
            total: actualBlankCount, // Dùng số chỗ trống thực tế
            results: blankResults
        };
    });
    
    // Tính tổng điểm
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalBlanks = results.reduce((sum, r) => sum + r.total, 0);
    const percentage = totalBlanks > 0 ? Math.round((totalScore / totalBlanks) * 100) : 0;
    
    res.json({
        totalScore: totalScore,
        totalBlanks: totalBlanks,
        percentage: percentage,
        questionResults: results,
        message: percentage >= 80 ? "Excellent performance!" :
                 percentage >= 60 ? "Good job!" :
                 percentage >= 40 ? "Not bad, keep practicing!" :
                 "You need more practice!"
    });
});

// Các route khác giữ nguyên...
router.get('/:id', (req, res) => {
    const questionId = parseInt(req.params.id);
    const question = fillBlanksQuestions.find(q => q.id === questionId);
    
    if (!question) {
        return res.status(404).json({ error: "Question not found" });
    }
    
    const actualBlankCount = (question.sentence.match(/___/g) || []).length;
    
    res.json({
        id: question.id,
        sentence: question.sentence,
        hints: question.hints,
        level: question.level,
        category: question.category,
        blankCount: actualBlankCount
    });
});

module.exports = router;
