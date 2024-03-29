const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
