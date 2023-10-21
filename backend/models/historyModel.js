const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  userId: { type: String },
  deviceName: { type: String },
  deviceInfo: { type: String },
  userAgent: { type: String },
  ipAddress: { type: String },
  loginTime: { type: Date },
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;
