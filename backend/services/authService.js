const UserRepository = require("../repositories/userRepository");
const LoginHistoryRepository = require("../repositories/historyRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUND = 10;
const { JWT } = require("../lib/const");
const { generateKeyPair } = require("../blockchain/blockchain");
const { blockchain, addBlock } = require("../blockchain/userBlock");
const BlockRepository = require("../repositories/blockRepository");
require("dotenv").config();

class UserService {
  static async registerUser({
    full_name,
    username,
    nik,
    email,
    password,
    phone_number,
  }) {
    try {
      const existingEmail = await UserRepository.FindByEmail({ email });

      const dataToSign = JSON.stringify({
        full_name,
        username,
        nik,
        email,
        password,
        phone_number,
      });

      const lastBlockData = JSON.stringify(
        blockchain[blockchain.length - 1].data
      );

      if (lastBlockData === dataToSign) {
        console.error("Data cannot be used in consecutive transactions.");
        return {
          status: false,
          statusCode: 400,
          message: "Data cannot be used in consecutive transactions.",
          data: null,
        };
      }

      if (existingEmail) {
        return {
          status: false,
          statusCode: 400,
          message: "Email is already in use",
          data: { user: null },
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

        const user = await UserRepository.CreateUser({
          full_name,
          username,
          nik,
          email,
          password: hashedPassword,
          phone_number,
          otp_code: null,
          otp_enable: false,
          private_key: null,
          public_key: null,
        });
        const newBlock = addBlock(user);
        const blocks = await BlockRepository.saveUserToBlock(
          newBlock.index,
          newBlock.previousHash,
          newBlock.timestamp,
          newBlock.data,
          newBlock.nonce,
          newBlock.hash
        );
        return {
          status: true,
          statusCode: 200,
          message: "Registration successful",
          data: { user: user, block: blocks },
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
      userId = user.id;

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
          const keyPair = generateKeyPair();
          user.private_key = keyPair.privateKey;
          user.public_key = keyPair.publicKey;
          user.otp_enable = false;
          user.otp_code = null;
          await user.save();
          const userHistory = await LoginHistoryRepository.createLoginHistory({
            userId,
            deviceName,
            deviceInfo,
            userAgent,
            ipAddress,
            loginTime,
          });
          const newBlock = addBlock(user);
          const blocks = await BlockRepository.saveUserToBlock(
            newBlock.index,
            newBlock.previousHash,
            newBlock.timestamp,
            newBlock.data,
            newBlock.nonce,
            newBlock.hash
          );

          return {
            status: true,
            statusCode: 200,
            message: "Login successful",
            data: {
              user: user,
              token: token,
              userHistory,
              otp_status: false,
              block: blocks,
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

      user.otp_enable = false;
      user.otp_code = null;
      await user.save();

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
          token: token,
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

  static async getAllLoginHistory({ userId }) {
    try {
      const loginHistory = await LoginHistoryRepository.getAllLoginHistory({
        userId,
      });
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

  static async logoutUser({ id, userId }) {
    try {
      const getUsers = await LoginHistoryRepository.findById({ id });

      if (getUsers.userId == userId) {
        const deleteHistory = await LoginHistoryRepository.deleteHistory({
          id,
        });
        return {
          status: true,
          statusCode: 200,
          message: "Successful delete history",
          data: deleteHistory,
        };
      } else {
        return {
          status: false,
          statusCode: 404,
          message: "Cannot delete history",
          data: null,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        statusCode: 500,
        message: "Error deleting history",
        data: null,
      };
    }
  }

  static async filterUser({ full_name, username }) {
    try {
      const user = await UserRepository.filterUser({ full_name, username });

      if (user) {
        return {
          status: true,
          statusCode: 200,
          message: "User founded successfully",
          data: user,
        };
      } else {
        return {
          status: false,
          statusCode: 400,
          message: "Cannot find user",
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
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
