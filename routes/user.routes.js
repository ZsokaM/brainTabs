const express = require("express");
const router = express.Router();

const Tab = require("../models/Tabs.model");
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

router.post("/profile/:folderId/delete", async (req, res, next) => {
  const { folderId } = req.params;
  await User.findByIdAndUpdate(res.locals.sessionUser._id, {
    $pull: { folders: folderId },
  });

  await Folder.findByIdAndDelete(folderId);
  return res.redirect("/profile");
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

router.post("/newtab", (req, res, next) => {
  const { category, description } = req.body;

  Tab.create({
    category,
    description,
    user: req.user,
  })
    .then((tab) => {
      return User.findByIdAndUpdate(req.user._id, {
        $push: { tabs: tab._id },
      });
    })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => next(err));
});

router.post("/profile/:tabId/delete", async (req, res, next) => {
  const { tabId } = req.params;
  await User.findByIdAndUpdate(res.locals.sessionUser._id, {
    $pull: { tabs: tabId },
  });

  await Tab.findByIdAndDelete(tabId);
  return res.redirect("/profile");
});
module.exports = router;
