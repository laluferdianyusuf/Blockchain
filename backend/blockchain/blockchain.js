const { SHA256 } = require("crypto-js");
const fs = require("fs");
const crypto = require("crypto");
const forge = require("node-forge");

class Block {
  constructor(index, previousHash, timestamp, data, nonce, hash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = nonce;
    this.hash = hash;
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
      JSON.stringify(blockchain, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving blockchain:", err);
  }
};

loadBlockchain();

const privateKey = fs.readFileSync("private_key.pem", "utf8");
const publicKey = fs.readFileSync("public_key.pem", "utf8");

const generateKeyPair = () => {
  const keys = forge.pki.rsa.generateKeyPair(1024);

  const privateKey = forge.pki.privateKeyToPem(keys.privateKey);
  const publicKey = forge.pki.publicKeyToPem(keys.publicKey);

  try {
    fs.writeFileSync("private_key.pem", privateKey, "utf8");
    fs.writeFileSync("public_key.pem", publicKey, "utf8");
  } catch (err) {
    console.error("Error saving keys:", err);
  }

  return { privateKey, publicKey };
};

const mineBlock = (index, previousHash, timestamp, data) => {
  let nonce = 0;
  let hash = "";
  const targetPrefix = "0000";

  while (!hash.startsWith(targetPrefix)) {
    nonce++;
    hash = calculateHash(index, previousHash, timestamp, data, nonce);
  }

  return { nonce, hash };
};

const addBlock = (data) => {
  if (usedCertificateNumbers.has(data.number)) {
    console.error("Certificate number has been used.");
    return null;
  }

  const previousBlock = blockchain[blockchain.length - 1];
  const index = previousBlock.index + 1;
  const timestamp = Date.now().toString();

  const { nonce, hash } = mineBlock(index, previousBlock.hash, timestamp, data);

  const dataToSign = JSON.stringify(data);
  console.log("data To Sign: ", dataToSign);

  // Sign the data with the private key
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(dataToSign);
  sign.end(); // You need to call sign.end() to complete the data to be signed
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
