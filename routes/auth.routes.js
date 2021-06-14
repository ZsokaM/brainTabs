const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");
const Folder = require("../models/Folders.model");
const Tab = require("../models/Tabs.model");
const { isAuthenticated } = require("../Middleware/isAuthenticated");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Indicate username, email and password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }
      bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hashSync(password, salt))
        .then((hashedPassword) => {
          return User.create({
            username,
            email,
            password: hashedPassword,
            tabs: [],
            folders: [],
          });
        })
        .then(() => res.redirect("/profile"));
    })
    .catch((err) => next(err));
});

router.get("/login", (req, res, next) =>
  res.render("auth/login", { errorMessage: req.flash("error") })
);

router.post(
  "/login",
  passport.authenticate("local", {
    session: true,
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/profile", isAuthenticated, (req, res) => {
  if (req.user.folders !== []) {
    User.findOne({ username: req.user.username })
      .populate("folders")
      .populate("tabs")
      .then((user) => {
        res.render("users/profile", { user: user });
      })
      .catch((err) =>
        console.log(`Err while getting a single post from the  DB: ${err}`)
      );
  } else {
    res.render("users/profile", { user: req.user });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
