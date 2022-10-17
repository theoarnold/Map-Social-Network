const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      min: 1,
      max: 1000000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);
