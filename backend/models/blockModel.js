const mongoose = require("mongoose");

const BlockModel = mongoose.model("Block", {
  index: Number,
  previousHash: String,
  timestamp: String,
  data: String,
  nonce: Number,
  hash: String,
});

module.exports = BlockModel;
