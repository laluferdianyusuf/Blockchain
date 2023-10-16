const Certificate = require("../models/certificateModel");

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

  static async updateCertificateOwnershipByNumber(number, newOwner) {
    try {
      const certificate = await Certificate.findOne({ number });

      if (!certificate) {
        return null;
      }

      certificate.owner = newOwner;

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
}

module.exports = CertificateRepository;
