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

// //apis for module 2
// app.post("/module2/add", async (req, res) => {
//   try {
//     console.log(req.body);
//     const moduledata = new module2({
//       question: req.body.question,
//       options: req.body.options,
//       answer: req.body.answer,
//       image: req.body.image,
//     });
//     console.log("module data is :" + moduledata);
//     const registered = await moduledata.save();
//     res.status(201).send(req.body);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// //to retrieve questions from database
// app.get("/module2/get", async (req, res) => {
//   try {
//     var alldata = await module2.find({});
//     console.log("Question: " + alldata);
//     res.status(201).send(alldata);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // set score of module 2
// app.post("/module2/score", async (req, res) => {
//   try {
//     var data = req.body;
//     var token = req.cookies.BuildCommunication;
//     var user_id = await jwt.verify(token, process.env.SECRET_KEY);
//     // console.log(user_id);
//     var user = await User.findById(user_id._id);

//     var userData = await User.findByIdAndUpdate(user_id._id, {
//       module2: {
//         previous: user.module2 ? user.module2.score : 0,
//         score: data.score,
//         date: data.date,
//       },
//     });

//     res.status(201).send(userData);
//   } catch (err) {
//     console.log(err);
//     res.status(400).send(err);
//   }
// });
