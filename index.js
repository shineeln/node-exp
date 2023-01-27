const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const config = require("./config/key");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
const { User } = require("./models/User");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(config.mongoURI);
}

app.get("/", (req, res) => res.send("Hello world!"));

app.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "not exist",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "wrong password" });

      user.generateToken((err, user) => {});
    });
  });
});

app.listen(port, () => console.log(`Example app listening port ${port}`));
