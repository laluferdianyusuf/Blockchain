const CertificateService = require("../services/certificateService");

const generateCertificate = async (req, res) => {
  const { number, nik, address, city, province, length, area, issueDate } =
    req.body;

  try {
    const { status, statusCode, message, data } =
      await CertificateService.generateCertificate({
        number,
        nik,
        address,
        city,
        province,
        length,
        area,
        issueDate,
      });

    res.status(statusCode).send({
      status: status,
      message: message,
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      statusCode: 500,
      message: "Internal server error " + error.message,
      data: {
        certificates: error.data,
      },
    });
  }
};

module.exports = {
  generateCertificate,
};
