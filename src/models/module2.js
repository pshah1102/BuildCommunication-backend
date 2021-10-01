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

const module2 = new mongoose.model("module2", questionschema);
module.exports = module2;
