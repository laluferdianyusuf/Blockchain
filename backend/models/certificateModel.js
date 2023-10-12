const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  //   user_id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: [true, "User ID is required"],
  //   },
  number: {
    type: Number,
    required: [true, "Certificate number can't be empty"],
  },
  nik: {
    type: Number,
    required: [true, "NIK can't be empty"],
  },
  address: {
    type: String,
    required: [true, "Land address can't be empty"],
  },
  city: {
    type: String,
    required: [true, "City can't be empty"],
  },
  province: {
    type: String,
    required: [true, "Province can't be empty"],
  },
  length: {
    type: Number,
    required: [true, "Length of the land can't be empty"],
  },
  area: {
    type: Number,
    required: [true, "Land area can't be empty"],
  },
  issueDate: {
    type: Date,
    required: [true, "Issue date can't be empty"],
  },
  //   verified: { type: Boolean, default: false },
});

// CertificateSchema.methods.setIsVerified = function (status) {
//   this.isVerified = status;
// };

// CertificateSchema.methods.getIsVerified = function () {
//   return this.isVerified;
// };

const Certificate = mongoose.model("Certificate", CertificateSchema);

module.exports = Certificate;
