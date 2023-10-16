const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db_config");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const PORT = 2001;

// certificate controller
const certificate = require("./controller/certificateController");

// auth controller
const auth = require("./controller/authController");

// middleware
const middleware = require("./middleware/authenticate");
const otpMiddleware = require("./middleware/verifyOtp");

// certificate api
app.post(
  "/api/certificates/generate",
  middleware.authenticate,
  certificate.generateCertificate
);
app.put(
  "/api/certificates/transfer/owner",
  middleware.authenticate,
  certificate.transferCertificateOwnership
);
app.get(
  "/api/certificates/owner/history/:number",
  middleware.authenticate,
  certificate.getOwnershipHistory
);

// auth api
app.post("/api/auth/register", auth.Register);
app.post("/api/auth/login", auth.Login);
app.post("/api/auth/otp/verify", auth.verifyOTP);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
