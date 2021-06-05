const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    tabs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tabs",
      },
    ],
    folders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
