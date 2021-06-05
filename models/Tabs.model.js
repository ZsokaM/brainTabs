const { Schema, model } = require("mongoose");

const tabSchema = new Schema(
  {
    category: {
      enum: ["video", "article", "podcast"],
      required: [true, "Select a category: video, article, podcast"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Add a short title"],
      trim: true,
    },
    description: String,
    keywords: {
      type: String,
      required: [true, "Add at least 1 keyword"],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    folders: {
      type: Schema.Types.ObjectId,
      ref: "Folders",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Tab", tabSchema);
