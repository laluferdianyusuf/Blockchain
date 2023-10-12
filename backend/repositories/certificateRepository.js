const Certificate = require("../models/certificateModel");

class CertificateRepository {
  static async generateCertificate({
    number,
    nik,
    address,
    city,
    province,
    length,
    area,
    issueDate,
  }) {
    try {
      const certificate = new Certificate({
        number,
        nik,
        address,
        city,
        province,
        length,
        area,
        issueDate,
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
}

module.exports = CertificateRepository;
