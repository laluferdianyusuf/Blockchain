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
    signature,
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
        signature,
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
  const { number, currentOwnerPrivateKey, newOwner, newUserId } = req.body;
  try {
    const { status, statusCode, message, data } =
      await CertificateService.transferOwnership({
        number,
        currentOwnerPrivateKey,
        newOwner,
        newUserId,
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

const findCertificateByNumber = async (req, res) => {
  try {
    const { number } = req.params;
    const { status, statusCode, message, data } =
      await CertificateService.findBlocksByCertificateNumber({ number });
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
  try {
    const { number } = req.params;
    const { status, statusCode, message, data } =
      await CertificateService.getOwnershipHistory({ number });
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

const getCertificateByUserId = async (req, res) => {
  try {
    const user_id = req.user._id;
    console.log(user_id);
    const { status, statusCode, message, data } =
      await CertificateService.getCertificatesByUserId({ user_id });

    res.status(statusCode).send({
      status: status,
      message: message,
      data: data,
    });
  } catch (error) {
    console.error("Error get certificate:", error);

    res.status(500).send({
      status: false,
      message: "Internal server error",
      data: {
        certificates: null,
      },
    });
  }
};

module.exports = {
  generateCertificate,
  transferCertificateOwnership,
  getOwnershipHistory,
  findCertificateByNumber,
  getCertificateByUserId,
};
