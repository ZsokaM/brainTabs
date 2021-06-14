const { Schema, model } = require("mongoose");

const tabSchema = new Schema(
  {
    category: String,
    description: String,
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
