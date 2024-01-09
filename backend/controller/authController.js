const AuthService = require("../services/authService");
const os = require("os");
const requestIp = require("request-ip");
const UserService = require("../services/authService");

const Register = async (req, res) => {
  const { full_name, username, nik, email, password, phone_number } = req.body;

  const { status, statusCode, message, data } = await AuthService.registerUser({
    full_name,
    username,
    nik,
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
  const getIpAddress = requestIp.getClientIp;
  const usersAgent = req.get("user-agent");
  const useragent = require("useragent");
  const agent = useragent.parse(usersAgent);

  const deviceName = os.hostname();
  const deviceInfo = agent.os.toString();
  const userAgent = agent.toAgent();
  const ipAddress = getIpAddress(req);
  const loginTime = new Date();

  const { status, statusCode, message, data } = await AuthService.sendLoginOTP({
    email,
    password,
    phone_number,
    otp_code,
    deviceName,
    deviceInfo,
    userAgent,
    ipAddress,
    loginTime,
  });

  res.status(statusCode).send({
    status: status,
    message: message,
    data: data,
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
    const userId = req.user.id;
    const { status, statusCode, message, data } =
      await AuthService.getAllLoginHistory({ userId });
    res.status(statusCode).send({
      status,
      message,
      data,
    });
  } catch (error) {
    throw error;
  }
};

const currentUser = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).send({
      status: false,
      message: "User not authenticated.",
      data: null,
    });
  }

  res.status(200).send({
    status: true,
    message: "Get current user success.",
    data: {
      user: user,
    },
  });
};

const logout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, statusCode, message, data } = await AuthService.logoutUser({
      id,
      userId,
    });

    res
      .status(statusCode)
      .send({ status: status, message: message, data: data });
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

const filterUser = async (req, res) => {
  const { full_name, username } = req.query;

  const { status, statusCode, message, data } = await UserService.filterUser({
    full_name,
    username,
  });
  res.status(statusCode).send({
    status: status,
    message: message,
    data: data,
  });
};

module.exports = {
  Register,
  Login,
  verifyOTP,
  getLoginHistory,
  currentUser,
  logout,
  filterUser,
};
