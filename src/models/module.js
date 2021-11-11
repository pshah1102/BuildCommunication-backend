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

// //api for receivinf and sending questions
// app.post("/module1/add", async (req, res) => {
//   try {
//     console.log(req.body);
//     const moduledata = new module1({
//       question: req.body.question,
//       options: req.body.options,
//       answer: req.body.answer,
//     });
//     // console.log("module data is :" + moduledata);
//     const registered = await moduledata.save();
//     console.log(registered);
//     res.status(201).send(req.body);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// //to retrieve questions from database
// app.get("/module1/get", async (req, res) => {
//   try {
//     var alldata = await module1.find({});
//     console.log("Question: " + alldata);
//     //    var odata=await module1.findOne({options:options});
//     //    var adata=await module1.findOne({answer:answer});
//     res.status(201).send(alldata);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });
// // end of apis for new collection

// // set score of module 1
// app.post("/module1/score", async (req, res) => {
//   try {
//     var data = req.body;
//     var token = req.cookies.BuildCommunication;
//     var user_id = await jwt.verify(token, process.env.SECRET_KEY);
//     // console.log(user_id);
//     var user = await User.findById(user_id._id);

//     var userData = await User.findByIdAndUpdate(user_id._id, {
//       module1: {
//         previous:
//           user && user.module1 && user.module1.score ? user.module1.score : 0,
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
