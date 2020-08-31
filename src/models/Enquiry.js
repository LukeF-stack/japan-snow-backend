let mongoose = require("mongoose");
const EnquirySchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Body: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

let Enquiry = mongoose.model("enquiries", EnquirySchema);

module.exports = Enquiry;
