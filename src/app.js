require("dotenv").config();
const express = require("express");
var cors = require("cors");
require("./db/conn");
require("./mail/mail");
const User = require("./models/users");
const module2 = require("./models/module2");
const module1 = require("./models/module");
const chwords = require("./models/ch_words");
const thwords = require("./models/th_words");
const ingwords = require("./models/ing_words");
const chwordsi = require("./models/ch_words_i");
const thwordsi = require("./models/th_words_i");
const ingwordsi = require("./models/ing_words_i");
const module3 = require("./models/module3");
const module4 = require("./models/module4");
const GeneratePDF = require("./pdf/pdf-generator");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000;

// app.use(function (req, res, next) {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://buildcommunication.netlify.app"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
var corsOptions = {
  origin: "http://localhost:3000", //frontend url
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// for images
app.use("/images", express.static("images"));

app.get("/", (req, res) => {
  res.send(res.cookie.BuildCommunication);
});

// get user details
app.get("/user", async (req, res) => {
  try {
    console.log(req.query.id);
    var user = await User.findById(req.query.id);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
app.post("/user/update", async (req, res) => {
  try {
    console.log(req.body);
    var userData = await User.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      dob: req.body.dob,
      speech_rate: req.body.speech_rate,
    });
    var user = await User.findById(req.body.id);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
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
      module1: { previous: 0, score: 0 },
      module2: { previous: 0, score: 0 },
      module3: { previous: 0, score: 0 },
      module4: { previous: 0, score: 0 },
    });
    const token = await data.generatetoken();
    const registered = await data.save();
    res.cookie("BuildCommunication", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    const userData = {
      user: await User.findOne({ email: req.body.email }),
      token: token,
    };
    res.status(201).send(userData);
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
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // console.log(cookie);
    console.log("token part is" + token);

    if (ismatch) {
      const userData = {
        user: usermail,
        token: token,
      };
      res.status(201).send(userData);
    } else {
      res.status(400).send("password not matching");
    }
  } catch (error) {
    res.status(400).send("Invalid details");
    console.log(error);
  }
});

// api for logout
app.get("/user/logout/:token", async (req, res) => {
  try {
    var token = req.params.token;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    console.log(user_id);
    var user = await User.findById(user_id._id);
    console.log(user);
    user.tokens = user.tokens.filter((currToken) => {
      return currToken.token !== token;
    });
    // res.clearCookie("BuildCommunication");
    await user.save();
    res.status(200).send("Successfully logged out");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// ch words type 1
app.post("/chwords/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new chwords({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
    });
    // console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    console.log(registered);
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/chwords/get", async (req, res) => {
  try {
    var alldata = await chwords.find({});
    console.log("Question: " + alldata);
    //    var odata=await module1.findOne({options:options});
    //    var adata=await module1.findOne({answer:answer});
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

// set score of ch words
app.post("/chwords/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      chwords: {
        previous:
          user && user.chwords && user.chwords.score ? user.chwords.score : 0,
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

// th words type 1
app.post("/thwords/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new thwords({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
    });
    // console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    console.log(registered);
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/thwords/get", async (req, res) => {
  try {
    var alldata = await thwords.find({});
    console.log("Question: " + alldata);
    //    var odata=await module1.findOne({options:options});
    //    var adata=await module1.findOne({answer:answer});
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

// set score of ch words
app.post("/thwords/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      thwords: {
        previous:
          user && user.thwords && user.thwords.score ? user.thwords.score : 0,
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

// ing words type 1
app.post("/ingwords/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new ingwords({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
    });
    // console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    console.log(registered);
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/ingwords/get", async (req, res) => {
  try {
    var alldata = await ingwords.find({});
    console.log("Question: " + alldata);
    //    var odata=await module1.findOne({options:options});
    //    var adata=await module1.findOne({answer:answer});
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

// set score of ch words
app.post("/ingwords/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      ingwords: {
        previous:
          user && user.ingwords && user.ingwords.score
            ? user.ingwords.score
            : 0,
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

//apis for module 2
app.post("/module2/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new module2({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      image: req.body.image,
    });
    console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

//to retrieve questions from database
app.get("/module2/get", async (req, res) => {
  try {
    var alldata = await module2.find({});
    console.log("Question: " + alldata);
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

// set score of module 2
app.post("/module2/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      module2: {
        previous: user.module2 ? user.module2.score : 0,
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

// ch words typ 2
app.post("/chwordsi/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new chwordsi({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      image: req.body.image,
    });
    console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/chwordsi/get", async (req, res) => {
  try {
    var alldata = await chwordsi.find({});
    console.log("Question: " + alldata);
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/chwordsi/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      chwordsi: {
        previous: user.chwordsi ? user.chwordsi.score : 0,
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

// th words typ 2
app.post("/thwordsi/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new thwordsi({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      image: req.body.image,
    });
    console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/thwordsi/get", async (req, res) => {
  try {
    var alldata = await thwordsi.find({});
    console.log("Question: " + alldata);
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/thwordsi/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      thwordsi: {
        previous: user.thwordsi ? user.thwordsi.score : 0,
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

// ing words typ 2
app.post("/ingwordsi/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new ingwordsi({
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      image: req.body.image,
    });
    console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/ingwordsi/get", async (req, res) => {
  try {
    var alldata = await ingwordsi.find({});
    console.log("Question: " + alldata);
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/ingwordsi/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      ingwordsi: {
        previous: user.ingwordsi ? user.ingwordsi.score : 0,
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

//api's for module 3
app.post("/module3/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new module3({
      question: req.body.question,
      answer: req.body.answer,
      image: req.body.image,
    });
    console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    res.status(201).send(registered);
  } catch (error) {
    res.status(400).send(error);
  }
});

//to retrieve questions from database
app.get("/module3/get", async (req, res) => {
  try {
    var alldata = await module3.find({});
    console.log("Question: " + alldata);
    res.status(201).send(alldata);
  } catch (error) {
    res.status(400).send(error);
  }
});

// set score of module 3
app.post("/module3/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      module3: {
        previous: user.module3.score ? user.module3.score : 0,
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

// api for module 4
app.post("/module4/add", async (req, res) => {
  try {
    console.log(req.body);
    const moduledata = new module4({
      comprehension: req.body.comprehension,
      questions: req.body.questions,
    });
    // console.log("module data is :" + moduledata);
    const registered = await moduledata.save();
    console.log(registered);
    res.status(201).send(req.body);
  } catch (error) {
    res.status(400).send(error);
  }
});

//to retrieve questions from database
app.get("/module4/get", async (req, res) => {
  try {
    var alldata = await module4.find({});
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
app.post("/module4/score", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    var userData = await User.findByIdAndUpdate(user_id._id, {
      module4: {
        previous: user.module4 ? user.module4.score : 0,
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

// generate pdf
app.get("/user/pdf", async (req, res) => {
  try {
    var data = req.body;
    var token = req.cookies.BuildCommunication;
    var user_id = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(user_id);
    var user = await User.findById(user_id._id);

    GeneratePDF(user);

    res.status(201).send("PDF Generated");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.listen(PORT, () => {
  console.log("This is Build Communication");
});
