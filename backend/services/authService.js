const UserRepository = require("../repositories/userRepository");
const LoginHistoryRepository = require("../repositories/historyRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUND = 10;
const { JWT } = require("../lib/const");
const { generateKeyPair } = require("../blockchain/blockchain");
require("dotenv").config();

class UserService {
  static async registerUser({
    full_name,
    username,
    email,
    password,
    phone_number,
  }) {
    try {
      const existingEmail = await UserRepository.FindByEmail({ email });
      console.log(existingEmail);

      if (existingEmail) {
        return {
          status: false,
          statusCode: 400,
          message: "Email is already in use",
          data: { user: null },
        };
      } else {
        // Enkripsi kata sandi
        const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
        const { publicKey } = generateKeyPair();

        // Buat entitas pengguna baru
        const user = await UserRepository.CreateUser({
          full_name,
          username,
          email,
          password: hashedPassword,
          phone_number,
          otp_code: null,
          otp_enable: false,
          private_key: null,
          public_key: publicKey,
        });

        return {
          status: true,
          statusCode: 200,
          message: "Registration successful",
          data: { user: user },
        };
      }
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: "Registration failed: " + error,
        data: { user: null },
      };
    }
  }

  static async sendLoginOTP({
    email,
    password,
    phone_number,
    otp_code,
    userId,
    deviceName,
    deviceInfo,
    userAgent,
    ipAddress,
    loginTime,
  }) {
    try {
      const user = await UserRepository.FindByEmail({ email });

      if (!user) {
        return {
          status: false,
          statusCode: 404,
          message: "Invalid email address",
          data: { user: null },
        };
      }
      const isUserMatch = await bcrypt.compare(password, user.password);

      if (isUserMatch) {
        if (!user.otp_enable) {
          const generatedOTP = Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          user.otp_code = generatedOTP;
          user.otp_enable = true;
          user.private_key = null;
          await user.save();

          await UserRepository.sendOTPviaSMS(phone_number, generatedOTP);

          return {
            status: true,
            statusCode: 200,
            message: "OTP sent for verification",
            data: {
              user: user,
              otp_status: true,
            },
          };
        } else if (user.otp_code === otp_code) {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
            },
            JWT.SECRET,
            {
              expiresIn: JWT.EXPIRED,
            }
          );
          const { privateKey } = generateKeyPair();

          user.otp_enable = false;
          user.otp_code = null;
          user.private_key = privateKey;
          await user.save();

          const loginHistory = {
            userId,
            deviceName,
            deviceInfo,
            userAgent,
            ipAddress,
            loginTime,
          };

          await LoginHistoryRepository.createLoginHistory({ loginHistory });

          return {
            status: true,
            statusCode: 200,
            message: "Login successful",
            data: {
              user: user,
              token: token,
              otp_status: false,
            },
          };
        } else {
          return {
            status: false,
            statusCode: 400,
            message: "Invalid OTP",
            data: { user: null },
          };
        }
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "Wrong Email or Password",
          data: {
            user: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: "Failed to send OTP: " + error,
        data: { user: null },
      };
    }
  }

  static async verifyOTP({ phone_number, otp_code }) {
    try {
      const user = await UserRepository.FindByPhoneNumber({ phone_number });

      if (!user) {
        return {
          status: false,
          statusCode: 404,
          message: "User not found",
          data: { user: null },
        };
      }

      if (!user.otp_enable) {
        return {
          status: false,
          statusCode: 400,
          message: "OTP verification is not enabled for this user",
          data: { user: null },
        };
      }

      if (user.otp_code !== otp_code) {
        return {
          status: false,
          statusCode: 400,
          message: "Invalid OTP code",
          data: { user: null },
        };
      }

      // Jika semua verifikasi berhasil, nonaktifkan OTP dan simpan perubahan
      user.otp_enable = false;
      user.otp_code = null;
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT.SECRET,
        {
          expiresIn: JWT.EXPIRED,
        }
      );

      return {
        status: true,
        statusCode: 200,
        message: "OTP verification successful",
        data: {
          user: user,
          token: token, // Mengirimkan token ke pengguna
        },
      };
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: "Failed to verify OTP: " + error,
        data: { user: null },
      };
    }
  }

  static async createHistory({
    userId,
    deviceName,
    deviceInfo,
    userAgent,
    ipAddress,
  }) {
    try {
      const userHistory = await LoginHistoryRepository.createLoginHistory({
        userId,
        deviceName,
        deviceInfo,
        userAgent,
        ipAddress,
        loginTime: new Date(),
      });
      return {
        status: true,
        statusCode: 200,
        message: "Successfully created",
        data: { user: userHistory },
      };
    } catch (error) {
      console.error(error);
      return {
        status: true,
        statusCode: 200,
        message: "Internal Server Error",
        data: { user: null },
      };
    }
  }

  static async getAllLoginHistory() {
    try {
      const loginHistory = await LoginHistoryRepository.getAllLoginHistory();
      if (loginHistory) {
        return {
          status: true,
          statusCode: 200,
          message: "Successful get login history",
          data: loginHistory,
        };
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "Nobody is logged in",
          data: null,
        };
      }
    } catch (error) {
      return {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: null,
      };
    }
  }
}

module.exports = UserService;
