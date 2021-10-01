const mongoose = require("mongoose");
const questionschema = new mongoose.Schema({
  question: {
    type: String,
  },

  answer: {
    type: String,
  },
  image: {
    type: String,
  },
});

const module3 = new mongoose.model("module3", questionschema);
module.exports = module3;
