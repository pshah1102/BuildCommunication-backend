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

const module1 = new mongoose.model("module1", questionschema);
module.exports = module1;
