const mongoose = require("mongoose");
const questionschema = new mongoose.Schema({
  question: {
    type: String,
  },

  options: [String],
  answer: {
    type: Number,
  },
  image: {
    type: String,
  },
});

const ingwordsi = new mongoose.model("ingwordsi", questionschema);
module.exports = ingwordsi;
