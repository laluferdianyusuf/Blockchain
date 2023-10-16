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
      JSON.stringify(blockchain, null, 1),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving blockchain:", err);
  }
};

loadBlockchain();

let privateKey, publicKey;

const generateKeyPair = () => {
  if (fs.existsSync("private_key.pem") && fs.existsSync("public_key.pem")) {
    privateKey = fs.readFileSync("private_key.pem", "utf8");
    publicKey = fs.readFileSync("public_key.pem", "utf8");
  } else {
    const keys = forge.pki.rsa.generateKeyPair(1024);

    privateKey = forge.pki.privateKeyToPem(keys.privateKey);
    publicKey = forge.pki.publicKeyToPem(keys.publicKey);

    try {
      fs.writeFileSync("private_key.pem", privateKey, "utf8");
      fs.writeFileSync("public_key.pem", publicKey, "utf8");
    } catch (err) {
      console.error("Error saving keys:", err);
    }
  }

  return { privateKey, publicKey };
};

generateKeyPair();

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

  // Menambang (mine) blok
  const { nonce, hash } = mineBlock(index, previousBlock.hash, timestamp, data);

  const dataToSign = JSON.stringify(data);
  console.log("data To Sign: ", dataToSign);

  const sign = crypto.createSign("RSA-SHA256"); // Gunakan algoritma yang sesuai
  sign.update(dataToSign);
  const signature = sign.sign(privateKey);

  const newBlock = new Block(
    index,
    previousBlock.hash,
    timestamp,
    data, // Gunakan objek JavaScript langsung
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

    const verify = crypto.createVerify("RSA-SHA256"); // Gunakan algoritma yang sesuai
    verify.update(data);
    return verify.verify(publicKey, signature);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
};

const updateBlockData = (blockIndex, newData, newOwnerPublicKey) => {
  if (blockIndex < 0 || blockIndex >= blockchain.length) {
    return false;
  }

  const block = blockchain[blockIndex];

  // Verifikasi tanda tangan dari pemilik sertifikat sebelum memperbarui data
  if (verifySignature(block.data, newOwnerPublicKey, newData.signature)) {
    block.data = newData; // Gunakan objek JavaScript langsung
    const newHash = calculateHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.data,
      block.nonce
    );
    block.hash = newHash;
    saveBlockchain();
    return true;
  } else {
    return false;
  }
};

module.exports = {
  blockchain,
  addBlock,
  generateKeyPair,
  verifySignature,
  updateBlockData,
};
