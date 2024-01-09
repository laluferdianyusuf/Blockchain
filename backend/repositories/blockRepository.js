const BlockModel = require("../models/blockModel");
const BlockUser = require("../models/userBlock");

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

  static async findBlockByHash({ hash }) {
    const blocks = await BlockModel.find({ hash });

    return blocks;
  }

  static async saveUserToBlock(
    index,
    previousHash,
    timestamp,
    data,
    nonce,
    hash
  ) {
    const newBlock = new BlockUser({
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
