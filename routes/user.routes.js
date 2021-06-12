const express = require("express");
const router = express.Router();

const Folder = require("../models/Folders.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../Middleware/isAuthenticated");

router.get("/newfolder", isAuthenticated, (req, res) => {
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

router.get("/profile/:folderId", isAuthenticated, (req, res) => {
  const { folderId } = req.params;

  Folder.findById(folderId)
    .then((folder) => {
      res.render("users/show-folder", folder);
    })
    .catch((err) =>
      console.log(`Error while getting posts of user from DB: ${err}`)
    );
});

router.post("/profile/:folderId/delete", (req, res, next) => {
  const { folderId } = req.params;

  Folder.findByIdAndDelete(folderId)
    .then(() => res.redirect("/profile"))
    .catch((err) => next(err));
});

router.get("/:folderId/edit", isAuthenticated, (req, res, next) => {
  const { folderId } = req.params;

  Folder.findById(folderId)
    .then((folderToEdit) => {
      res.render("users/folder-edit", { folder: folderToEdit });
    })
    .catch((err) => next(err));
});

router.post("/:folderId/edit", (req, res, next) => {
  const { folderId } = req.params;

  const { title, keywords, description } = req.body;

  Folder.findByIdAndUpdate(
    folderId,
    { title, keywords, description },
    { new: true }
  )
    .then(() => res.redirect(`/profile/${folderId}`))
    .catch((err) => next(err));
});

module.exports = router;
