let mongoose = require("mongoose");
const DestinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

let Destination = mongoose.model("destinations", DestinationSchema);

module.exports = Destination;
