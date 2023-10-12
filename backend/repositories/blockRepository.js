const BlockModel = require("../models/blockModel");

class BlockRepository {
  static async saveBlockToDatabase(
    index,
    previousHash,
    timestamp,
    data,
    nonce,
    hash
  ) {
    const newBlock = new BlockModel({
      index,
      previousHash,
      timestamp,
      data,
      nonce,
      hash,
    });

    await newBlock.save();
  }
}
module.exports = BlockRepository;
