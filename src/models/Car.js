let mongoose = require("mongoose");
const CarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    model: { type: String, required: true },
    seats: { type: Number, required: true },
    transmission: { type: String, required: true },
    body_type: { type: String, required: true },
    drive_type: { type: String, required: true },
    year: { type: Number, require: true },
    dates_booked: { type: Array },
    available: { type: Boolean, required: true },
    price_per_day: { type: Number, required: true },
    cover_image: { type: String, required: true },
    description: { type: String },
    brand: { type: String }
  },
  {
    versionKey: false
  }
);

let Car = mongoose.model("cars", CarSchema);

module.exports = Car;
