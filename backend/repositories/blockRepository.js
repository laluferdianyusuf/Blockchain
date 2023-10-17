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

  static async findBlocksByCertificateNumber({ number }) {
    try {
      const blocks = await BlockModel.find({
        "data.number": parseFloat(number),
      });

      return blocks;
    } catch (error) {
      console.error("Error finding blocks:", error);
      return null;
    }
  }
}
module.exports = BlockRepository;
