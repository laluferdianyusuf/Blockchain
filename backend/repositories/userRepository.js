const UserModels = require("../models/userModel");
const twilio = require("twilio");
require("dotenv").config();

class UserRepository {
  static async CreateUser({
    full_name,
    username,
    nik,
    email,
    password,
    phone_number,
    otp_enable,
    otp_code,
    private_key,
    public_key,
  }) {
    const createUser = new UserModels({
      full_name,
      username,
      nik,
      email,
      password,
      phone_number,
      otp_enable,
      otp_code,
      private_key,
      public_key,
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

  static async findUserId(_id) {
    const user = await UserModels.findById(_id);
    return user;
  }
  static async sendOTPviaSMS(phone_number, otp_code) {
    try {
      const twilioClient = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH
      );

      twilioClient.messages.create({
        body: `Here your OTP: ${otp_code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone_number,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  static async filterUser({ full_name, username }) {
    const query = {};

    if (full_name) {
      query.full_name = new RegExp(full_name, "i");
    }

    if (username) {
      query.username = new RegExp(username, "i");
    }

    const userToFilter = await UserModels.find(query);
    return userToFilter;
  }
}

module.exports = UserRepository;
