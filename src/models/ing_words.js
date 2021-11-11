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

const ingwords = new mongoose.model("ingwords", questionschema);
module.exports = ingwords;
