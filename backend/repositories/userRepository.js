const UserModels = require("../models/userModel");
const twilio = require("twilio");

class UserRepository {
  static async CreateUser({
    full_name,
    username,
    email,
    password,
    phone_number,
    otp_enable,
    otp_code,
  }) {
    const createUser = new UserModels({
      full_name,
      username,
      email,
      password,
      phone_number,
      otp_enable,
      otp_code,
    });

    const user = await createUser.save();
    return user;
  }

  static async FindByPhoneNumber({ phone_number }) {
    const findUser = UserModels.findOne({ phone_number });
    return findUser;
  }

  static async FindByEmail({ email }) {
    const findUser = UserModels.findOne({ email });
    return findUser;
  }

  static async sendOTPviaSMS(phone_number, otp_code) {
    try {
      const twilioClient = twilio(
        "AC2daccc77f82de0500d09b71bc4fb20e7",
        "42ad54c79a878a48b52cb37b463481d8"
      );

      twilioClient.messages.create({
        body: `Kode OTP Anda: ${otp_code}`,
        from: "+12053089792",
        to: phone_number,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = UserRepository;
