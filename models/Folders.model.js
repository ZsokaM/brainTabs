const { Schema, model } = require("mongoose");

const folderSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Add a short title"],
      trim: true,
    },
    keywords: {
      type: String,
      trim: true,
    },
    description: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tabs: {
      type: Schema.Types.ObjectId,
      ref: "Tabs",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Folder", folderSchema);
