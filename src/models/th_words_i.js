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

const thwordsi = new mongoose.model("thwordsi", questionschema);
module.exports = thwordsi;
