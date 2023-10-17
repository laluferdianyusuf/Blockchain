const CertificateRepository = require("../repositories/certificateRepository");
const BlockRepository = require("../repositories/blockRepository");
const {
  verifySignature,
  blockchain,
  generateKeyPair,
  addBlock,
} = require("../blockchain/blockchain");
const fs = require("fs");
const crypto = require("crypto");

const usedCertificateNumbers = new Set();

class CertificateService {
  static async generateCertificate({
    user_id,
    number,
    owner,
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

      const { privateKey, publicKey } = generateKeyPair();
      console.log("public key: " + JSON.stringify(publicKey));

      const dataToSign = JSON.stringify({
        user_id,
        number,
        owner,
        nik,
        address,
        city,
        province,
        length,
        area,
        issueDate: new Date().getTime(),
      });

      const sign = crypto.createSign("SHA256");
      sign.update(dataToSign);
      const signature = sign.sign(privateKey);

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
        publicKey,
        signature
      );

      console.log("Is Signature Valid:", isSignatureValid);

      if (isSignatureValid) {
        console.log(dataToSign);
      }

      const certificate = {
        user_id,
        number,
        owner,
        nik,
        address,
        city,
        province,
        length,
        area,
        issueDate: new Date().getTime(),
        signature,
        publicKey,
      };

      const newBlock = addBlock(certificate);

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
          user_id,
          number,
          owner,
          nik,
          address,
          city,
          province,
          length,
          area,
          issueDate: new Date().getTime(),
          publicKey: publicKey,
          signature: signature,
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
      console.error("Error:", error);
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

  static async transferOwnership({ number, currentOwnerPrivateKey, newOwner }) {
    try {
      const certificate = await CertificateRepository.findCertificateByNumber({
        number,
      });

      if (!certificate) {
        return {
          status: false,
          statusCode: 404,
          message: "Sertifikat tidak ditemukan.",
          data: null,
        };
      }

      const dataToSign = JSON.stringify(certificate);

      const currentOwnerPublicKey = fs.readFileSync("public_key.pem", "utf8");
      const sign = crypto.createSign("SHA256");
      sign.update(dataToSign);
      certificate.signature = sign.sign(currentOwnerPrivateKey);

      const isSignatureValid = verifySignature(
        dataToSign,
        currentOwnerPublicKey,
        certificate.signature
      );

      if (!isSignatureValid) {
        return {
          status: false,
          statusCode: 400,
          message: "Tanda tangan pemilik saat ini tidak valid.",
          data: null,
        };
      }

      certificate.owner = newOwner;

      // Memperbarui kepemilikan sertifikat di database
      const updatedCertificate =
        await CertificateRepository.updateCertificateOwnershipByNumber(
          number,
          newOwner,
          certificate.signature
        );

      if (updatedCertificate) {
        // Jika berhasil memperbarui blockchain, tambahkan blok baru
        const newBlock = addBlock(certificate);

        if (newBlock) {
          await BlockRepository.saveBlockToDatabase(
            newBlock.index,
            newBlock.previousHash,
            newBlock.timestamp,
            newBlock.data,
            newBlock.nonce,
            newBlock.hash
          );
          return {
            status: true,
            statusCode: 200,
            message:
              "Kepemilikan sertifikat berhasil diperbarui di blockchain.",
            data: {
              certificate: updatedCertificate,
              newBlock,
            },
          };
        } else {
          return {
            status: false,
            statusCode: 500,
            message: "Gagal menambahkan blok baru ke blockchain.",
            data: null,
          };
        }
      } else {
        return {
          status: false,
          statusCode: 500,
          message: "Gagal memperbarui kepemilikan sertifikat di database.",
          data: null,
        };
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        status: false,
        statusCode: 500,
        message: "Kesalahan Layanan: " + error.message,
        data: null,
      };
    }
  }

  // static async getOwnershipHistory(number) {
  //   try {
  //     const blocks = await BlockRepository.findBlocksByCertificateNumber(
  //       number
  //     );
  //     const databaseEntries =
  //       await CertificateRepository.getOwnershipHistoryByNumber(number);
  //     const history = [];

  //     // Daftar perubahan kepemilikan dari blockchain
  //     const blockchainOwnershipChanges = blocks.map((block) => {
  //       const blockData = JSON.parse(block.data);
  //       return {
  //         owner: blockData.owner,
  //         timestamp: block.timestamp,
  //       };
  //     });

  //     // Daftar perubahan kepemilikan dari database
  //     const databaseOwnershipChanges = databaseEntries.map((entry) => {
  //       return {
  //         owner: entry.owner,
  //         timestamp: entry.timestamp,
  //       };
  //     });

  //     // Gabungkan dan urutkan perubahan kepemilikan dari blockchain dan database
  //     const allOwnershipChanges = [
  //       ...blockchainOwnershipChanges,
  //       ...databaseOwnershipChanges,
  //     ];
  //     allOwnershipChanges.sort((a, b) => a.timestamp - b.timestamp);

  //     // Buat riwayat dengan pemilik sebelumnya dan pemilik saat ini
  //     let previousOwner = null;
  //     for (const change of allOwnershipChanges) {
  //       if (previousOwner !== null) {
  //         history.push({
  //           previousOwner,
  //           newOwner: change.owner,
  //           timestamp: change.timestamp,
  //         });
  //       } else {
  //         // Jika ini adalah entri pertama dalam riwayat, maka pemilik sebelumnya dan sesudahnya adalah sama
  //         history.push({
  //           previousOwner: change.owner,
  //           newOwner: change.owner,
  //           timestamp: change.timestamp,
  //         });
  //       }
  //       previousOwner = change.owner;
  //     }

  //     return {
  //       status: true,
  //       statusCode: 200,
  //       message: "Riwayat kepemilikan berhasil diambil.",
  //       data: {
  //         history,
  //       },
  //     };
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return {
  //       status: false,
  //       statusCode: 500,
  //       message: "Gagal mengambil riwayat kepemilikan.",
  //       data: null,
  //     };
  //   }
  // }

  static async findBlocksByCertificateNumber({ number }) {
    try {
      console.log("Number to search:", number);
      const blocks = await BlockRepository.findBlocksByCertificateNumber({
        number,
      });

      if (blocks && blocks.length > 0) {
        // Handle the found blocks (since there can be multiple with the same certificate number)
        console.log("Blocks found:", blocks);
        return {
          status: true,
          statusCode: 200,
          message: "Success get certificates",
          data: blocks,
        };
      } else {
        console.log("Blocks not found for number:", number);
        return {
          status: false,
          statusCode: 404,
          message: "Cannot get certificates",
          data: null,
        };
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }

  static async getOwnershipHistory({ number }) {
    const blocks = await BlockRepository.findBlocksByCertificateNumber({
      number,
    });

    if (blocks && blocks.length > 0) {
      const ownershipHistory = [];
      let previousOwner = null;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (block.data && block.data.owner) {
          if (previousOwner === null) {
            // Set pemilik pertama
            previousOwner = block.data;
          } else if (block.data.owner !== previousOwner) {
            // Temukan perubahan pemilik
            ownershipHistory.push({
              previousOwner,
              currentOwner: block.data,
              transactionDate: block.timestamp,
            });
            previousOwner = block.data;
          }
        }
      }

      if (ownershipHistory.length > 0) {
        return {
          status: true,
          statusCode: 200,
          message: "Success get ownership history",
          data: ownershipHistory,
        };
      }
    }

    return {
      status: false,
      statusCode: 400,
      message: "Cannot get ownership history",
      data: null,
    };
  }
}

module.exports = CertificateService;
