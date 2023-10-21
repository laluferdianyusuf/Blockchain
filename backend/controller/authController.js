const AuthService = require("../services/authService");
const device = require("express-device");
const os = require("os");
const requestIp = require("request-ip");

const Register = async (req, res) => {
  const { full_name, username, email, password, phone_number } = req.body;

  const { status, statusCode, message, data } = await AuthService.registerUser({
    full_name,
    username,
    email,
    password,
    phone_number,
  });

  res.status(statusCode).send({
    status,
    message,
    data,
  });
};

const Login = async (req, res) => {
  const { email, password, phone_number, otp_code } = req.body;

  const login = await AuthService.sendLoginOTP({
    email,
    password,
    phone_number,
    otp_code,
  });
  console.log(login);

  if (login.status) {
    const getIpAddress = requestIp.getClientIp;
    const loginHistory = {
      userId: login.data.user._id,
      deviceName: os.hostname(),
      deviceInfo: req.device || "Unknown device",
      userAgent: req.get("user-agent"),
      ipAddress: getIpAddress(req),
      loginTime: new Date(),
    };
    console.log(loginHistory);
    await AuthService.createHistory(loginHistory);
  }

  res.status(login.statusCode).send({
    status: login.status,
    message: login.message,
    data: login.data,
  });
};

const verifyOTP = async (req, res) => {
  const { phone_number, otp_code } = req.body;

  const { status, statusCode, message, data } = await AuthService.verifyOTP({
    phone_number,
    otp_code,
  });

  res.status(statusCode).send({
    status,
    message,
    data,
  });
};

const getLoginHistory = async (req, res) => {
  try {
    const { status, statusCode, message, data } =
      await AuthService.getAllLoginHistory();
    res.status(statusCode).send({
      status,
      message,
      data,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { Register, Login, verifyOTP, getLoginHistory };
