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

const chwordsi = new mongoose.model("chwordsi", questionschema);
module.exports = chwordsi;
