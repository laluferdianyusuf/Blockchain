const LoginHistoryModel = require("../models/historyModel");

class LoginHistoryRepository {
  static async createLoginHistory({
    userId,
    deviceName,
    deviceInfo,
    userAgent,
    ipAddress,
    loginTime,
  }) {
    try {
      const newLoginHistory = new LoginHistoryModel({
        userId,
        deviceName,
        deviceInfo,
        userAgent,
        ipAddress,
        loginTime,
      });
      await newLoginHistory.save();
      return newLoginHistory;
    } catch (error) {
      throw error;
    }
  }

  static async getAllLoginHistory({ userId }) {
    try {
      const loginHistory = await LoginHistoryModel.find({ userId });
      return loginHistory;
    } catch (error) {
      throw error;
    }
  }

  static async findById({ id }) {
    const findById = await LoginHistoryModel.findById(id);

    return findById;
  }

  static async deleteHistory({ id }) {
    const deleteHistory = LoginHistoryModel.findByIdAndDelete(id, {
      new: true,
    });

    return deleteHistory;
  }
}

module.exports = LoginHistoryRepository;
