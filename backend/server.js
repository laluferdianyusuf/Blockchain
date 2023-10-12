const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db_config");

app.use(express.json());
app.use(cors());

const PORT = 2001;

// certificate controller
const certificate = require("./controller/certificateController");

// certificate api
app.post("/api/certificates/generate", certificate.generateCertificate);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
