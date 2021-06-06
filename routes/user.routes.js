const express = require("express");
const router = express.Router();

const Folder = require("../models/Folders.model");
const User = require("../models/User.model");

router.get("/newfolder", (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }
  res.render("users/newfolder", { user: req.user });
});

router.post("/newfolder", (req, res, next) => {
  const { title, keywords, description } = req.body;

  Folder.create({
    title,
    keywords,
    description,
    user: req.user,
  })
    .then((folder) => {
      return User.findByIdAndUpdate(req.user._id, {
        $push: { folders: folder._id },
      });
    })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => next(err));
});

router.get("/profile/:folderId", (req, res) => {
  const { folderId } = req.params;

  Folder.findById(folderId)
    .then((folder) => {
      console.log(folder);
      res.render("users/show-folder", folder);
    })
    .catch((err) =>
      console.log(`Errpr while getting posts of user from DB: ${err}`)
    );
});

router.post("/profile/:folderId/delete", (req, res, next) => {
  const { folderId } = req.params;

  Folder.findByIdAndDelete(folderId)
    .then(() => res.redirect("/profile"))
    .catch((err) => next(err));
});

router;
module.exports = router;
