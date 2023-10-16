const AuthService = require("../services/authService");

const otpVerificationMiddleware = async (req, res, next) => {
  const { phone_number, otp_code } = req.body;

  if (!phone_number || !otp_code) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP code are required" });
  }

  const otpVerificationResult = await AuthService.verifyOTP({
    phone_number,
    otp_code,
  });

  if (!otpVerificationResult.status) {
    return res.status(400).json({ message: otpVerificationResult.message });
  }

  // Jika verifikasi OTP berhasil, lanjutkan ke rute yang sesuai
  next();
};

module.exports = otpVerificationMiddleware;
