let Utils = require("./../Utils.js");
let mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

UserSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    this.password = Utils.hashPassword(this.password);
  }
  next();
});

let User = mongoose.model("users", UserSchema);

module.exports = User;
