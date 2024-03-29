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
const certificateController = require("./controller/certificateController");

// auth controller
const auth = require("./controller/authController");

// middleware
const middleware = require("./middleware/authenticate");

// auth api
app.post("/api/auth/register", auth.Register);
app.post("/api/auth/login", auth.Login);
app.post("/api/auth/otp/verify", auth.verifyOTP);
app.get("/api/auth/history", middleware.authenticate, auth.getLoginHistory);
app.get("/api/auth/me", middleware.authenticate, auth.currentUser);
app.delete("/api/history/:id", middleware.authenticate, auth.logout);
app.get("/api/user/filter?", auth.filterUser);

// certificate api
app.post(
  "/api/certificates/generate",
  middleware.authenticate,
  certificateController.generateCertificate
);
app.put(
  "/api/certificates/transfer-owner/:number",
  middleware.authenticate,
  certificateController.transferCertificateOwnership
);
app.get(
  "/api/certificates/:number",
  middleware.authenticate,
  certificateController.findCertificateByNumber
);
app.get(
  "/api/v1/certificates/:number",
  middleware.authenticate,
  certificateController.findCertificatesByNumber
);
app.get(
  "/api/certificates/owner/history/:number",
  middleware.authenticate,
  certificateController.getOwnershipHistory
);
app.get(
  "/api/certificates/user/:user_id",
  middleware.authenticate,
  certificateController.getCertificateByUserId
);
app.get(
  "/v1/api/certificates/:hash",
  middleware.authenticate,
  certificateController.getCertificateByHash
);

app.get("/v1/api/certificates-all", certificateController.getAllCertificates);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
