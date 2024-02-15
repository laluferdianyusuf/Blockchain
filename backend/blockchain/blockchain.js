const { SHA256 } = require("crypto-js");
const fs = require("fs");
const crypto = require("crypto");
const process = require("process");

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
    )
  );
};

let blockchain = [];
const usedCertificateNumbers = new Set();

const loadBlockchain = () => {
  try {
    const data = fs.readFileSync("blockchain.json", "utf8");
    blockchain = JSON.parse(data);
  } catch (err) {
    blockchain = [createGenesisBlock()];
  }
};

const saveBlockchain = () => {
  try {
    fs.writeFileSync(
      "blockchain.json",
      JSON.stringify(blockchain, null, 4),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving blockchain:", err);
  }
};

loadBlockchain();

let privateKey = "";
let publicKey = "";
const generateKeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
  privateKey = keyPair.privateKey;
  publicKey = keyPair.publicKey;

  return { privateKey, publicKey };
};

const mineBlock = (index, previousHash, timestamp, data, difficulty) => {
  let nonce = 0;
  let hash = "";
  const targetPrefix = "0".repeat(difficulty);

  const startMemoryUsage = process.memoryUsage().heapUsed;

  while (!hash.startsWith(targetPrefix)) {
    nonce++;
    hash = calculateHash(index, previousHash, timestamp, data, nonce);
  }

  const endMemoryUsage = process.memoryUsage().heapUsed;
  const memoryUsage = endMemoryUsage - startMemoryUsage;

  console.log(`Memory usage during mining: ${memoryUsage} bytes`);

  return { nonce, hash };
};

const addBlock = (data) => {
  const keyPair = generateKeyPair();
  const privateKey = keyPair.privateKey;
  const publicKey = keyPair.publicKey;
  if (usedCertificateNumbers.has(data.number)) {
    console.error("Certificate number has been used.");
    return null;
  }

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
  const endMiningTime = new Date().getTime();
  const miningTime = endMiningTime - startMiningTime;
  console.log(`Mining time: ${miningTime} ms`);

  const dataToSign = JSON.stringify(data);

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(dataToSign);
  sign.end();
  const signature = sign.sign(privateKey);

  const newBlock = new Block(
    index,
    previousBlock.hash,
    timestamp,
    data,
    nonce,
    hash
  );

  const isSignatureValid = verifySignature(dataToSign, publicKey, signature);
  console.log("Is block valid?", isSignatureValid);

  if (isSignatureValid) {
    blockchain.push(newBlock);
    usedCertificateNumbers.add(data.number);
    saveBlockchain();
  } else {
    console.error("Digital signature is not valid.");
  }

  return isSignatureValid ? newBlock : null;
};

const verifySignature = (data, publicKey, signature) => {
  try {
    if (!publicKey || !signature) {
      console.error("Public key or signature is undefined.");
      return false;
    }

    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(data);
    return verify.verify(publicKey, signature);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

module.exports = {
  blockchain,
  addBlock,
  generateKeyPair,
  verifySignature,
};
