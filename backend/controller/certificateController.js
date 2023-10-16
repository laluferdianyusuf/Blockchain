const CertificateService = require("../services/certificateService");

const generateCertificate = async (req, res) => {
  const {
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
  } = req.body;
  const user_id = req.user.id;

  try {
    const { status, statusCode, message, data } =
      await CertificateService.generateCertificate({
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

const transferCertificateOwnership = async (req, res) => {
  const { number, currentOwnerPrivateKey, newOwner } = req.body;
  try {
    const { status, statusCode, message, data } =
      await CertificateService.transferOwnership({
        number,
        currentOwnerPrivateKey,
        newOwner,
      });

    res.status(statusCode).send({
      status: status,
      message: message,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

const getOwnershipHistory = async (req, res) => {
  const { number } = req.params;
  try {
    const { status, statusCode, message, data } =
      await CertificateService.getOwnershipHistory(number);
    res.status(statusCode).send({
      status: status,
      message: message,
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = {
  generateCertificate,
  transferCertificateOwnership,
  getOwnershipHistory,
};
