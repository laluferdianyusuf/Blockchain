const CertificateRepository = require("../repositories/certificateRepository");
const {
  blockchain,
  addBlock,
  generateKeyPair,
  verifySignature,
} = require("../blockchain/blockchain");

const BlockRepository = require("../repositories/blockRepository");
const fs = require("fs");
const crypto = require("crypto");

const usedCertificateNumbers = new Set();

class CertificateService {
  static async generateCertificate({
    number,
    nik,
    address,
    city,
    province,
    length,
    area,
  }) {
    try {
      if (usedCertificateNumbers.has(number)) {
        console.error("Nomor sertifikat sudah digunakan sebelumnya.");
        return {
          status: false,
          statusCode: 400,
          message: "Nomor sertifikat sudah digunakan sebelumnya.",
          data: null,
        };
      }

      // Check if the private key file exists
      if (!fs.existsSync("private_key.pem")) {
        console.error(
          "Kunci pribadi tidak tersedia. Harap buat kunci pribadi dan simpan sebagai 'private_key.pem' dalam direktori proyek Anda."
        );
        return {
          status: false,
          statusCode: 400,
          message: "Kunci pribadi tidak tersedia.",
          data: null,
        };
      }

      // Load the private key
      const privateKey = fs.readFileSync("private_key.pem", "utf8");
      const { publicKey } = generateKeyPair();

      const dataToSign = JSON.stringify({
        number,
        nik,
        address,
        city,
        province,
        length,
        area,
        issueDate: new Date().getTime(),
      });

      // Sign data using the private key
      const sign = crypto.createSign("SHA256");
      sign.update(dataToSign);
      const signature = sign.sign(privateKey, "base64");

      const lastBlockData = JSON.stringify(
        blockchain[blockchain.length - 1].data
      );

      if (lastBlockData === dataToSign) {
        console.error(
          "Data tidak dapat digunakan dalam transaksi berturut-turut."
        );
        return {
          status: false,
          statusCode: 400,
          message: "Data tidak dapat digunakan dalam transaksi berturut-turut.",
          data: null,
        };
      }

      const isSignatureValid = verifySignature(
        dataToSign,
        signature,
        publicKey
      );

      if (!isSignatureValid) {
        console.error("Tanda Tangan Digital Tidak Valid.");
        return {
          status: false,
          statusCode: 400,
          message: "Tanda Tangan Digital Tidak Valid.",
          data: null,
        };
      }

      const newBlock = addBlock({
        number,
        nik,
        address,
        city,
        province,
        length,
        area,
        issueDate: new Date().getTime(),
        signature, // Menyertakan tanda tangan digital
        publicKey, // Menyertakan kunci publik
      });

      if (newBlock) {
        usedCertificateNumbers.add(number);

        await BlockRepository.saveBlockToDatabase(
          newBlock.index,
          newBlock.previousHash,
          newBlock.timestamp,
          newBlock.data,
          newBlock.nonce,
          newBlock.hash
        );

        const certificates = await CertificateRepository.generateCertificate({
          number,
          nik,
          address,
          city,
          province,
          length,
          area,
          issueDate: new Date().getTime(),
        });

        return {
          status: true,
          statusCode: 200,
          message: "Sertifikat berhasil dibuat dan disimpan di blockchain",
          data: {
            certificates: certificates.data,
          },
        };
      } else {
        console.error("Gagal menambahkan sertifikat ke blockchain.");
        return {
          status: false,
          statusCode: 500,
          message: "Gagal menambahkan sertifikat ke blockchain.",
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        statusCode: 500,
        message: "Kesalahan Layanan: " + error.message,
        data: {
          certificates: null,
        },
      };
    }
  }
}

module.exports = CertificateService;
