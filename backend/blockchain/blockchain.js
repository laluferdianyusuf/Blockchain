const { SHA256 } = require("crypto-js");
const fs = require("fs");
const crypto = require("crypto");

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
  return SHA256(index + previousHash + timestamp + data + nonce).toString();
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
    const data = fs.readFileSync("blockchain.json");
    blockchain = JSON.parse(data);
  } catch (err) {
    blockchain = [createGenesisBlock()];
  }
};

const saveBlockchain = () => {
  fs.writeFileSync("blockchain.json", JSON.stringify(blockchain, null, 2));
};

loadBlockchain();

const generateKeyPair = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  // Simpan kunci pribadi dengan aman (misalnya, dalam file terenkripsi)
  fs.writeFileSync("private_key.pem", privateKey, "utf8");

  // Kunci publik dapat digunakan dalam blockchain
  return publicKey;
};

const addBlock = (data, userPublicKey) => {
  if (usedCertificateNumbers.has(data.number)) {
    console.error("Nomor sertifikat sudah digunakan sebelumnya.");
    return null;
  }

  const previousBlock = blockchain[blockchain.length - 1];
  const index = previousBlock.index + 1;
  const timestamp = Date.now().toString();
  let nonce = 0;
  let hash;

  do {
    hash = calculateHash(
      index,
      previousBlock.hash,
      timestamp,
      JSON.stringify(data),
      nonce.toString()
    );
    nonce++;
  } while (!hash.startsWith("0000"));

  const newBlock = new Block(
    index,
    previousBlock.hash,
    timestamp,
    data,
    nonce - 1,
    hash
  );

  // Verifikasi tanda tangan digital menggunakan kunci publik
  const isSignatureValid = verifySignature(
    dataToSign,
    userPublicKey,
    signature
  );

  if (!isSignatureValid) {
    console.error("Tanda Tangan Digital Tidak Valid.");
    return null;
  }

  blockchain.push(newBlock);
  usedCertificateNumbers.add(data.number);
  lastDataHash = calculateHash(JSON.stringify(data));
  saveBlockchain();

  return newBlock;
};

const verifySignature = (data, publicKey, signature) => {
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(data);
    return verify.verify(publicKey, signature, "base64");
  } catch (error) {
    return false;
  }
};

module.exports = {
  blockchain,
  addBlock,
  generateKeyPair,
  verifySignature,
};
