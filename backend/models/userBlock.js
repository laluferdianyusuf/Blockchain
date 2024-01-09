const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  index: { type: Number },
  previousHash: { type: String },
  timestamp: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },
  nonce: { type: Number },
  hash: { type: String },
});

const BlockUser = mongoose.model("BlockUser", BlockSchema);
module.exports = BlockUser;
