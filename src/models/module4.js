const mongoose = require("mongoose");
const questionschema = new mongoose.Schema({
  comprehension: {
    type: String,
  },
  questions: [
    {
      question: {
        type: String,
      },

      options: [String],
      answer: {
        type: Number,
      },
    },
  ],
});

const module4 = new mongoose.model("module4", questionschema);
module.exports = module4;
