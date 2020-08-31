let mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Car_id: { type: String, required: true },
    Body: { type: String, required: true },
    User_id: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

let Review = mongoose.model("reviews", ReviewSchema);

module.exports = Review;
