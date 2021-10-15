const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 3,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already registered"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  dob: {
    type: Date,
    required: true,
    validate(value) {
      if (!validator.isDate(value)) {
        throw new Error("Invalid Date");
      }
      // if(!Date.parse(value)){
      //   throw new Error
      // }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Invalid Password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  speech_rate: {
    type: String,
  },
  module1: {
    score: {
      type: Number,
    },
    previous: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },
  module2: {
    score: {
      type: Number,
    },
    previous: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },

  module3: {
    score: {
      type: Number,
    },
    previous: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },

  module4: {
    score: {
      type: Number,
    },
    previous: {
      type: Number,
    },
    date: {
      type: Date,
    },
  },
});

//generate tokens
userschema.methods.generatetoken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // console.log("jwt token sign"+token)
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    // res.send(error);
    console.log("Error part is" + error);
    throw error;
  }
};

userschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Password check", this.password);
  }
  next();
});

const User = new mongoose.model("User", userschema);
module.exports = User;
