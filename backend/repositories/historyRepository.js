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

  static async getAllLoginHistory() {
    try {
      const loginHistory = await LoginHistoryModel.find();
      return loginHistory;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LoginHistoryRepository;
