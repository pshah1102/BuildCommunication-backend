const express = require("express");
require("./db/conn");
const User = require("./models/users");
const module1 = require("./models/module");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

app.post("/user/signup", async (req, res) => {
  try {
    console.log(req.body);
    // const password = await bcrypt.hash(req.body.password, 10)
    const data = new User({
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      password: req.body.password,
    });
    const token = await data.generatetoken();
    const registered = await data.save();
    res.cookie("BuildCommunication", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      // secure:true only for https access
    });
    res.status(201).send(req.body);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
  // .save()
  // .then(()=>{
  //     res.status(201).send(user)
  // })
  // .catch((err)=>{
  //     res.status(400).send(err);
  // })
});
app.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const usermail = await User.findOne({ email: email });
    const ismatch = await bcrypt.compare(password, usermail.password);
    const token = await usermail.generatetoken();
    res.cookie("BuildCommunication", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: false,
      // secure:true only for https access
    });
    // console.log(cookie);
    console.log("token part is" + token);

    if (ismatch) {
      res.status(201).send("login successful");
    } else {
      res.status(400).send("password not matching");
    }
  } catch (error) {
    res.status(400).send("Invalid details");
    console.log(error);
  }
});

//api for receivinf and sending questions
app.post("/module1/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new module1({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
    });
    console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

//to retrieve questions from database
app.get("/module1/get", async (req, res) => {
  try {
    var alldata = await module1.find({});
    console.log("Question: " + alldata);
    //    var odata=await module1.findOne({options:options});
    //    var adata=await module1.findOne({answer:answer});
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});
// end of apis for new collection

// set score of module 1
app.post("/module1/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, "ournameis19it133and19it092project");
    var user = await User.findById(user_id._id);
    var userData = await User.findByIdAndUpdate(user_id._id, {
      module1: {
        previous: user.module1.score,
        score: data.score,
        date: data.date,
      },
    });

    res.status(201).send(userData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.listen(PORT, () => {
  console.log("This is Build Communication");
});
