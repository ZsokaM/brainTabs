const express = require("express");
const router = express.Router();
const axios = require("axios");

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
  try {
    await User.findByIdAndUpdate(res.locals.sessionUser._id, {
      $pull: { folders: folderId },
    });

    await Folder.findByIdAndDelete(folderId);
    return res.redirect("/profile");
  } catch (err) {
    next(err);
  }
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

router.post("/newtab", async (req, res, next) => {
  const { category, description } = req.body;

  const link = await axios.post("https://api.linkpreview.net", {
    q: `${description}`,
    key: `${process.env.LINK_KEY}`,
  });

  Tab.create({
    category,
    title: link.data.title,
    description: link.data.description,
    image: link.data.image,
    url: link.data.url,
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

router.post("/newtab/:tabId/delete", async (req, res) => {
  const { tabId } = req.params;
  try {
    await Tab.findByIdAndDelete(tabId);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { tabs: tabId },
    });
    return res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});
module.exports = router;
