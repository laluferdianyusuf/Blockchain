const Certificate = require("../models/certificateModel");
const User = require("../models/userModel");
class CertificateRepository {
  static async generateCertificate({
    user_id,
    number,
    owner,
    address,
    city,
    province,
    length,
    issueDate,
    validator,
    nip,
    signature,
    isValid,
    hash,
  }) {
    try {
      const certificate = new Certificate({
        user_id,
        number,
        owner,
        address,
        city,
        province,
        length,
        issueDate,
        validator,
        nip,
        signature,
        isValid,
        hash,
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
  static async findCertificateByOwner({ owner }) {
    const certificate = await Certificate.findOne({ owner });
    return certificate;
  }
  static async findCertificateByAddress({ address }) {
    const certificate = await Certificate.findOne({ address });
    return certificate;
  }
  static async findCertificateByCity({ city }) {
    const certificate = await Certificate.findOne({ city });
    return certificate;
  }
  static async findCertificateByProvince({ province }) {
    const certificate = await Certificate.findOne({ province });
    return certificate;
  }
  static async findCertificateByLength({ length }) {
    const certificate = await Certificate.findOne({ length });
    return certificate;
  }
  static async findCertificateByArea({ area }) {
    const certificate = await Certificate.findOne({ area });
    return certificate;
  }

  static async getOwnershipHistoryByNumber(number) {
    return Certificate.find({ number }).select("owner timestamp");
  }

  static async getCertificatesByUserId({ user_id }) {
    try {
      const certificates = await Certificate.find({ user_id });
      return certificates;
    } catch (error) {
      console.error("Can't get certificates:", error.message);
      throw error;
    }
  }

  static async getCertificateBySignature({ signature }) {
    console.log(signature);
    const certificateBuffer = Buffer.from(signature, "base64");

    const certificate = await Certificate.find({
      signature: certificateBuffer,
    });
    return certificate;
  }

  static async getAllCertificates() {
    const Certificates = await Certificate.find();
    return Certificates;
  }
}

module.exports = CertificateRepository;
