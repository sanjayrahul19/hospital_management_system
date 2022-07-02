const mongoose = require("mongoose");

const Patient = mongoose.model("patients", {
  patientId: String,
  patientName: String,
  patientAge: String,
  patientMobileNo: Number,
  patientAddress: String,
  patientDisease: String,
});

module.exports = Patient;
