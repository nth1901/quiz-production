// backend/data/quizData.js
const quizQuestions = [
    {
        id: 1,
        question: "What is the capital of England?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 0,
        level: "easy", // Thêm độ khó
        category: "geography" // Thêm danh mục
    },
    {
        id: 2,
        question: "How do you say 'Xin chào' in English?",
        options: ["Goodbye", "Hello", "Thank you", "Sorry"],
        correctAnswer: 1,
        level: "easy",
        category: "vocabulary"
    },
    {
        id: 3,
        question: "What color is the sky?",
        options: ["Green", "Red", "Blue", "Yellow"],
        correctAnswer: 2,
        level: "easy",
        category: "general"
    },
    {
        id: 4,
        question: "Which verb form is correct: 'She ___ to school every day'?",
        options: ["go", "goes", "going", "went"],
        correctAnswer: 1,
        level: "medium",
        category: "grammar"
    },
	{
    id: 5,
    question: "Which verb form is correct: 'They ___ dinner at 7 PM every night'?",
    options: ["has", "have", "having", "had"],
    correctAnswer: 1,
    level: "medium"
	}

];

module.exports = quizQuestions; // Export để sử dụng ở file khác
// JavaScript source code
