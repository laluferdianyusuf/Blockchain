const CertificateRepository = require("../repositories/certificateRepository");
const UserRepository = require("../repositories/userRepository");
const BlockRepository = require("../repositories/blockRepository");
const {
  verifySignature,
  blockchain,
  addBlock,
  generateKeyPair,
} = require("../blockchain/blockchain");
const crypto = require("crypto");

class CertificateService {
  static async generateCertificate({
    user_id,
    number,
    owner,
    address,
    city,
    province,
    length,
    area,
    issueDate,
    validator,
    nip,
  }) {
    try {
      const existNumber = await CertificateRepository.findCertificateByNumber({
        number,
      });
      const existOwner = await CertificateRepository.findCertificateByOwner({
        owner,
      });
      const existAddress = await CertificateRepository.findCertificateByAddress(
        {
          address,
        }
      );
      const existLength = await CertificateRepository.findCertificateByLength({
        length,
      });
      const user = await UserRepository.findUserId(user_id);
      if (existNumber || existOwner || existAddress || existLength) {
        return {
          status: false,
          statusCode: 400,
          message: "The certificate has been used previously.",
          data: null,
        };
      }

      if (!user.private_key || !user.public_key) {
        const keyPair = generateKeyPair();
        user.private_key = keyPair.privateKey;
        user.public_key = keyPair.publicKey;
        await user.save();
      }

      const privateKey = user.private_key;
      const publicKey = user.public_key;

      const dataToSign = JSON.stringify({
        user_id,
        number,
        owner,
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

      if (isSignatureValid) {
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
        address,
        city,
        province,
        length,
        area,
        issueDate,
        signature,
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
          address,
          city,
          province,
          length,
          area,
          issueDate,
          validator,
          nip,
          signature,
          isValid: isSignatureValid,
          hash: newBlock.hash,
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
    currentOwnerPublicKey,
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
      const blocks = await BlockRepository.findBlocksByCertificateNumber({
        number,
      });

      if (blocks && blocks.length > 0) {
        return {
          status: true,
          statusCode: 200,
          message: "Success get certificates",
          data: blocks,
        };
      } else {
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

  static async findCertificateByNumber({ number }) {
    try {
      const certificate = await CertificateRepository.findCertificateByNumber({
        number,
      });

      if (certificate && certificate.length > 0) {
        return {
          status: true,
          statusCode: 200,
          message: "Success get certificates",
          data: certificate,
        };
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "Cannot get certificates",
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
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
      let previousOwnerHash = null;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (block.data && block.data.owner) {
          if (previousOwner === null) {
            previousOwner = block.data;
            previousOwnerHash = block.hash;
          } else if (block.data.owner !== previousOwner) {
            ownershipHistory.push({
              previousOwner: previousOwner,
              previousOwnerHash,
              currentOwner: block.data,
              currentOwnerHash: block.hash,
              transactionDate: block.timestamp,
            });
            previousOwner = block.data;
          }
        }
      }

      if (ownershipHistory.length > 0) {
        const latestOwnership = ownershipHistory[ownershipHistory.length - 1];
        return {
          status: true,
          statusCode: 200,
          message: "Success get ownership history",
          data: latestOwnership,
        };
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "There's no ownership history",
          data: null,
        };
      }
    } else {
      return {
        status: false,
        statusCode: 400,
        message: "Cannot get ownership history",
        data: null,
      };
    }
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

  static async getCertificateByHash({ hash }) {
    try {
      const certificate = await BlockRepository.findBlockByHash({ hash });

      if (!certificate) {
        return {
          status: false,
          statusCode: 404,
          message: "Certificate not found",
          data: null,
        };
      } else {
        return {
          status: true,
          statusCode: 200,
          message: "Certificate founded",
          data: certificate[0].data,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal server error",
        data: null,
      };
    }
  }

  static async getAllCertificates() {
    try {
      const certificates = await CertificateRepository.getAllCertificates();

      if (certificates && certificates.length > 0) {
        return {
          status: true,
          statusCode: 200,
          message: "Certificates were successfully retrieved",
          data: certificates,
        };
      } else {
        return {
          status: false,
          statusCode: 404,
          message: "Certificates could not be retrieved",
          data: null,
        };
      }
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: "Couldn't connect to the server",
        data: null,
      };
    }
  }
}

module.exports = CertificateService;
