const Certificate = require("../models/certificateModel");
const { ObjectId } = require("mongoose").Types;
class CertificateRepository {
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
    publicKey,
    signature,
  }) {
    try {
      const certificate = new Certificate({
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
        publicKey,
        signature,
      });

      await certificate.save();

      return {
        status: true,
        data: certificate,
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        statusCode: 500,
        message: "Repository " + error.message,
        data: {
          certificates: null,
        },
      };
    }
  }

  static async updateCertificateOwnershipByNumber(number, newOwner, newUserId) {
    try {
      const certificate = await Certificate.findOne({ number });

      if (!certificate) {
        return null;
      }

      certificate.owner = newOwner;
      certificate.user_id = newUserId;

      const updatedCertificate = await certificate.save();

      return updatedCertificate;
    } catch (error) {
      console.error("Error updating certificate ownership:", error);
      return null;
    }
  }

  static async findCertificateByNumber({ number }) {
    const certificate = await Certificate.findOne({ number });
    return certificate;
  }

  static async getOwnershipHistoryByNumber(number) {
    return Certificate.find({ number }).select("owner timestamp");
  }

  static async getCertificatesByUserId({ user_id }) {
    try {
      const certificates = await Certificate.find({ user_id });
      console.log(certificates);
      return certificates;
    } catch (error) {
      console.error("Can't get certificates:", error.message);
      throw error;
    }
  }
}

module.exports = CertificateRepository;
