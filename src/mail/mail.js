const { attachment } = require("express/lib/response");
const nodemailer = require("nodemailer");
const { getMaxListeners } = require("pdfkit");
const User = require("../models/users");
const GeneratePDF = require("../pdf/pdf-generator");
// async..await is not allowed in global scope, must use a wrapper
async function main() {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  const data = await User.find({});
  let variable = await Promise.all(
    data.map(async (user) => {
      GeneratePDF(user);
      let info = await transporter.sendMail({
        from: '"Build Communication " <company@buildcommunication.com>',
        to: user.email,
        subject: "Weekly Report",
        text: "Dear Student, please check out attachment and checkout the weekly report. HAVE GREAT LEARNING! ",
        attachments: [
          {
            filename: user._id + ".pdf",
            path:
              "D:/SGP(Main folder)/Backend(BuildCommunication)/" +
              user._id +
              ".pdf",
            contentType: "application/pdf",
          },
        ],
        function(err, info) {
          if (err) {
            console.error(err);
          } else {
            console.log(info);
          }
        },
      });
    })
  );

  // send mail with defined transport object
  //   let info = await transporter.sendMail({
  //     from: '"Build Communication " <company@buildcommunication.com>', // sender address
  //     to: "shahpoojan@protonmail.com, devhpatel2@gmail.com", // list of receivers
  //     subject: "Testing Email", // Subject line
  //     text: "First Email", // plain text body
  //     html: "<h1> Your Weekly report </h1>", // html body
  //   });

  //   console.log("Message sent: %s", info.messageId);
  //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // }
}
var cron = require("node-cron");

cron.schedule("33 11 * * Mon", () => {
  main().catch(console.error);
  console.log("Sending Mails.....");
});
