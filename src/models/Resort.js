let mongoose = require("mongoose");
const ResortSchema = new mongoose.Schema(
  {
    destinationId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

let Resort = mongoose.model("resorts", ResortSchema);

module.exports = Resort;
