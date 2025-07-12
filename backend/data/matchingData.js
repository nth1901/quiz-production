// backend/data/matchingData.js
const matchingQuestions = [
    {
        id: 1,
        title: "Match animals with their sounds",
        instruction: "Nối động vật với tiếng kêu của chúng", // Thêm hướng dẫn
        leftColumn: [
            { id: "a1", text: "Dog" },
            { id: "a2", text: "Cat" },
            { id: "a3", text: "Cow" },
            { id: "a4", text: "Bird" }
        ],
        rightColumn: [
            { id: "b1", text: "Meow" },
            { id: "b2", text: "Woof" },
            { id: "b3", text: "Moo" },
            { id: "b4", text: "Tweet" }
        ],
        correctPairs: [
            { left: "a1", right: "b2" }, // Dog - Woof
            { left: "a2", right: "b1" }, // Cat - Meow
            { left: "a3", right: "b3" }, // Cow - Moo
            { left: "a4", right: "b4" }  // Bird - Tweet
        ],
        level: "easy",
        category: "animals"
    },
    {
        id: 2,
        title: "Match English words with Vietnamese meanings",
        instruction: "Nối từ tiếng Anh với nghĩa tiếng Việt",
        leftColumn: [
            { id: "c1", text: "Book" },
            { id: "c2", text: "Water" },
            { id: "c3", text: "House" },
            { id: "c4", text: "Friend" }
        ],
        rightColumn: [
            { id: "d1", text: "Nước" },
            { id: "d2", text: "Nhà" },
            { id: "d3", text: "Sách" },
            { id: "d4", text: "Bạn bè" }
        ],
        correctPairs: [
            { left: "c1", right: "d3" }, // Book - Sách
            { left: "c2", right: "d1" }, // Water - Nước
            { left: "c3", right: "d2" }, // House - Nhà
            { left: "c4", right: "d4" }  // Friend - Bạn bè
        ],
        level: "easy",
        category: "vocabulary"
    }
];

module.exports = matchingQuestions;
// JavaScript source code
