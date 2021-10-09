const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_NAME, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection is successful");
  })
  .catch((e) => {
    console.log("DB Connection failed");
  });
