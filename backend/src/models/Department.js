const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
