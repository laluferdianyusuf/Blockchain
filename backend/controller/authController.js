const AuthService = require("../services/authService");

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

  const { status, statusCode, message, data } = await AuthService.sendLoginOTP({
    email,
    password,
    phone_number,
    otp_code,
  });

  res.status(statusCode).send({
    status,
    message,
    data,
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

module.exports = { Register, Login, verifyOTP };
