const mongoose = require("mongoose");
const questionschema = new mongoose.Schema({
  question: {
    type: String,
  },

  options: [String],
  answer: {
    type: Number,
  },
});

const chwords = new mongoose.model("chwords", questionschema);
module.exports = chwords;
