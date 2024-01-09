const { SHA256 } = require("crypto-js");
const fs = require("fs");

class Block {
  constructor(index, previousHash, timestamp, data, nonce, hash, difficulty) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = nonce;
    this.hash = hash;
    this.difficulty = difficulty;
  }
}

const calculateHash = (index, previousHash, timestamp, data, nonce) => {
  return SHA256(
    index + previousHash + timestamp + JSON.stringify(data) + nonce
  ).toString();
};

const createGenesisBlock = () => {
  const nonce = 0;
  return new Block(
    0,
    "0",
    Date.now().toString(),
    "Genesis Block",
    nonce,
    calculateHash(
      0,
      "0",
      Date.now().toString(),
      "Genesis Block",
      nonce.toString()
    ),
    4
  );
};

let blockchain = [];

const loadBlockchain = () => {
  try {
    const data = fs.readFileSync("blockchainUser.json", "utf8");
    blockchain = JSON.parse(data);
  } catch (err) {
    blockchain = [createGenesisBlock()];
  }
};

const saveBlockchain = () => {
  try {
    fs.writeFileSync(
      "blockchainUser.json",
      JSON.stringify(blockchain, null, 4),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving blockchain:", err);
  }
};

loadBlockchain();

const mineBlock = (index, previousHash, timestamp, data, difficulty) => {
  let nonce = 0;
  let hash = "";
  const targetPrefix = "0".repeat(difficulty);

  while (!hash.startsWith(targetPrefix)) {
    nonce++;
    hash = calculateHash(index, previousHash, timestamp, data, nonce);
  }

  return { nonce, hash };
};

const isChainValid = () => {
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    if (
      currentBlock.hash !==
        calculateHash(
          currentBlock.index,
          currentBlock.previousHash,
          currentBlock.timestamp,
          currentBlock.data,
          currentBlock.nonce
        ) ||
      currentBlock.previousHash !== previousBlock.hash
    ) {
      return false;
    }
  }
  return true;
};

const addBlock = (data) => {
  const previousBlock = blockchain[blockchain.length - 1];
  const index = previousBlock.index + 1;
  const timestamp = Date.now().toString();

  const startMiningTime = new Date().getTime();
  const { nonce, hash } = mineBlock(
    index,
    previousBlock.hash,
    timestamp,
    data,
    4
  );

  const newBlock = new Block(
    index,
    previousBlock.hash,
    timestamp,
    data,
    nonce,
    hash,
    4
  );

  const endMiningTime = new Date().getTime();
  const miningTime = endMiningTime - startMiningTime;
  console.log(`Mining time: ${miningTime} ms`);

  const isValid = isChainValid();

  if (isValid) {
    blockchain.push(newBlock);
    saveBlockchain();
  } else {
    console.error("Not Valid");
  }

  return isValid ? newBlock : null;
};

module.exports = {
  blockchain,
  addBlock,
};
