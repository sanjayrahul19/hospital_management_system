const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mongoDB = require("./config/db");
const ejs = require("ejs");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const Patient = require("./models/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "#$%RSGFDyEf",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoDB();

const userSchema = new mongoose.Schema({
  email: String,
  passport: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  // User.register({ username: req.body.username }, req.body.password)
  //   .then((user) => {
  //     passport.authenticate("local")(req, res, () => {
  //       res.redirect("/admin");
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.redirect("/");
  //   });
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/admin");
      });
    }
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("admin");
  } else {
    res.redirect("/");
  }
});

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("register");
  } else {
    res.redirect("/");
  }
});

app.post("/admin", (req, res) => {
  const patient = JSON.parse(
    // this line remove all space in (req.body)
    JSON.stringify(req.body).replace(/"\s+|\s+"/g, '"')
  );

  console.log(patient);

  new Patient(patient).save().then(() => {
    res.render("success", {
      subTitle: "Success",
      subject: "Added",
    });
  });
});

app.get("/delete", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("search", {
      option: "Delete",
      buttonName: "Delete",
      url: "delete",
    });
  }
});

app.post("/delete", (req, res) => {
  Patient.findOneAndDelete({ patientId: req.body.patientId }).then(() => {
    res.render("success", {
      subTitle: "Delete",
      subject: "Deleted",
    });
  });
});

app.get("/update", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("search", {
      option: "Update",
      buttonName: "Search",
      url: "update",
    });
  } else {
    res.redirect("/");
  }
});

app.post("/update", (req, res) => {
  Patient.findOne({ patientId: req.body.patientId }).then((userData) => {
    if (userData) {
      res.render("updatePage", {
        patientId: userData.patientId,
        patientName: userData.patientName,
        patientAge: userData.patientAge,
        patientMobileNo: userData.patientMobileNo,
        patientAddress: userData.patientAddress,
        patientDisease: userData.patientDisease,
      });
    } else {
      res.render("searchFailure", {
        url: "update",
      });
    }
  });
});

app.post("/updateResults", (req, res) => {
  const patientData = JSON.parse(
    // this line remove all space in (req.body)
    JSON.stringify(req.body).replace(/"\s+|\s+"/g, '"')
  );

  console.log("patientData: ");
  console.log(patientData);

  Patient.findOneAndUpdate({ patientId: req.body.patientId }, patientData).then(
    () => {
      res.render("success", {
        subTitle: "Updated",
        subject: "updated",
      });
    }
  );
});

app.get("/search", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("search", {
      option: "Search",
      buttonName: "Search",
      url: "search",
    });
  } else {
    res.redirect("/");
  }
});

app.post("/search", (req, res) => {
  Patient.findOne({ patientId: req.body.patientId }).then((userData) => {
    if (userData) {
      res.render("searchResults", {
        patientId: userData.patientId,
        patientName: userData.patientName,
        patientAge: userData.patientAge,
        patientMobileNo: userData.patientMobileNo,
        patientAddress: userData.patientAddress,
        patientDisease: userData.patientDisease,
      });
    } else {
      res.render("searchFailure", {
        url: "search",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is up and running");
});
