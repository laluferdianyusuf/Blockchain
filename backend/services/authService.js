const UserRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUND = 10;
const { JWT } = require("../lib/const");

class UserService {
  static async registerUser({
    full_name,
    username,
    email,
    password,
    phone_number,
  }) {
    try {
      // Periksa apakah email atau nomor telepon sudah digunakan oleh pengguna lain
      const existingEmail = await UserRepository.FindByEmail({ email });
      console.log(existingEmail);
      const existingPhone = await UserRepository.FindByPhoneNumber({
        phone_number,
      });

      if (existingEmail || existingPhone) {
        return {
          status: false,
          statusCode: 400,
          message: "Email or phone number are already in use",
          data: { user: null },
        };
      } else {
        // Enkripsi kata sandi
        const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

        // Buat entitas pengguna baru
        const user = await UserRepository.CreateUser({
          full_name,
          username,
          email,
          password: hashedPassword,
          phone_number,
          otp_code: null,
          otp_enable: false,
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

  static async sendLoginOTP({ email, password, phone_number, otp_code }) {
    try {
      const userEmail = await UserRepository.FindByEmail({ email });
      const user = await UserRepository.FindByPhoneNumber({ phone_number });

      if (!userEmail || !user) {
        return {
          status: false,
          statusCode: 404,
          message: "Invalid email address or phone number",
          data: { user: null },
        };
      }

      const isUserMatch = await bcrypt.compare(password, user.password);

      if (isUserMatch) {
        if (!user.otp_enable) {
          // OTP belum diaktifkan, kirimkan OTP baru
          const generatedOTP = Math.floor(
            1000 + Math.random() * 9000
          ).toString();
          user.otp_code = generatedOTP;
          user.otp_enable = true;
          await user.save();

          // Kirimkan OTP ke nomor telepon pengguna
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
          // OTP cocok, pengguna berhasil login
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

          // Nonaktifkan OTP setelah berhasil login
          user.otp_enable = false;
          user.otp_code = null;
          await user.save();

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
          // OTP tidak cocok
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
}

module.exports = UserService;
