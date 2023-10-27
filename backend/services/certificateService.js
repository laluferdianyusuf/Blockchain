const CertificateRepository = require("../repositories/certificateRepository");
const UserRepository = require("../repositories/userRepository");
const BlockRepository = require("../repositories/blockRepository");
const {
  verifySignature,
  blockchain,
  addBlock,
} = require("../blockchain/blockchain");
const fs = require("fs");
const crypto = require("crypto");

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
    issueDate,
  }) {
    try {
      const existNumber = await CertificateRepository.findCertificateByNumber({
        number,
      });
      if (existNumber) {
        console.error("The certificate number has been used previously.");
        return {
          status: false,
          statusCode: 400,
          message: "The certificate number has been used previously.",
          data: null,
        };
      }

      if (!fs.existsSync("private_key.pem")) {
        console.error(
          "Private key is not available. Please create a private key and save it as 'private_key.pem' in your project directory."
        );
        return {
          status: false,
          statusCode: 400,
          message: "Private key is not available.",
          data: null,
        };
      }

      const privateKey = fs.readFileSync("private_key.pem", "utf8");
      const publicKey = fs.readFileSync("public_key.pem", "utf8");
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
        issueDate,
      });

      const sign = crypto.createSign("SHA256");
      sign.update(dataToSign);
      const signature = sign.sign(privateKey);

      const lastBlockData = JSON.stringify(
        blockchain[blockchain.length - 1].data
      );

      if (lastBlockData === dataToSign) {
        console.error("Data cannot be used in consecutive transactions.");
        return {
          status: false,
          statusCode: 400,
          message: "Data cannot be used in consecutive transactions.",
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
        certificate.isValid = isSignatureValid;
        await certificate.save();
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "The current owner's signature is invalid.",
          data: null,
        };
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
        issueDate,
        signature,
        publicKey,
      };

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
          issueDate,
          publicKey: publicKey,
          signature: signature,
        });

        return {
          status: true,
          statusCode: 200,
          message:
            "The certificate is successfully generated and stored on the blockchain",
          data: {
            certificates: certificates.data,
          },
        };
      } else {
        console.error("Failed to add certificate to blockchain.");
        return {
          status: false,
          statusCode: 500,
          message: "Failed to add certificate to blockchain.",
          data: null,
        };
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        status: false,
        statusCode: 500,
        message: "Service Error: " + error.message,
        data: {
          certificates: null,
        },
      };
    }
  }

  static async transferOwnership({
    number,
    currentOwnerPrivateKey,
    newOwner,
    newUserId,
  }) {
    try {
      const certificate = await CertificateRepository.findCertificateByNumber({
        number,
      });
      const existUser = await UserRepository.findUserId(newUserId);

      if (!certificate) {
        return {
          status: false,
          statusCode: 404,
          message: "Certificate not found.",
          data: null,
        };
      }

      if (!existUser) {
        return {
          status: false,
          statusCode: 404,
          message: "User not found.",
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
          message: "The current owner's signature is invalid.",
          data: null,
        };
      } else {
        certificate.isValid = true;
        await certificate.save();
      }

      certificate.owner = newOwner;
      certificate.user_id = newUserId;

      const updatedCertificate =
        await CertificateRepository.updateCertificateOwnershipByNumber(
          number,
          newOwner,
          newUserId,
          certificate.signature
        );

      if (updatedCertificate) {
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
              "Certificate ownership is successfully updated on the blockchain.",
            data: {
              certificate: updatedCertificate,
            },
          };
        } else {
          return {
            status: false,
            statusCode: 500,
            message: "Failed to add a new block to the blockchain.",
            data: null,
          };
        }
      } else {
        return {
          status: false,
          statusCode: 500,
          message: "Failed to update certificate ownership in the database.",
          data: null,
        };
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        status: false,
        statusCode: 500,
        message: "Service error: " + error.message,
        data: null,
      };
    }
  }

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
            ownershipHistory.push({
              owner: previousOwner,
              loginHistory: [block.timestamp], // Catat waktu login pertama
            });
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

  static async getCertificatesByUserId({ user_id }) {
    try {
      const certificates = await CertificateRepository.getCertificatesByUserId({
        user_id,
      });

      if (certificates && certificates.length > 0) {
        return {
          status: true,
          statusCode: 200,
          message: "Certificates found",
          data: {
            certificates,
          },
        };
      } else {
        return {
          status: false,
          statusCode: 404,
          message: "Certificates not found",
          data: {
            certificates: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: "Internal server error: " + error.message,
        data: {
          certificates: null,
        },
      };
    }
  }
}

module.exports = CertificateService;
