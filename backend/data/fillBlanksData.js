// backend/data/fillBlanksData.js
const fillBlanksQuestions = [
     {
        id: 1,
        sentence: "I ___ to school every day.",
        blanks: ["go"], // 1 chỗ trống, 1 đáp án
        hints: ["present simple verb"],
        level: "easy",
        category: "grammar"
    },
    {
        id: 2,
        sentence: "She ___ a book when I ___ her.",
        blanks: ["was reading", "saw"], // 2 chỗ trống, mỗi chỗ 1 đáp án
        hints: ["past continuous", "past simple"],
        level: "medium",
        category: "grammar"
    },
    {
        id: 3,
        sentence: "The capital of France is ___.",
        blanks: ["Paris"], // 1 chỗ trống, 1 đáp án
        hints: ["city name"],
        level: "easy",
        category: "geography"
    },
    {
        id: 4,
        sentence: "I have ___ finished my homework.",
        blanks: [["already", "just"]], // 1 chỗ trống, chấp nhận 2 đáp án
        hints: ["adverb of time"],
        level: "medium",
        category: "grammar"
    }
];

module.exports = fillBlanksQuestions;
