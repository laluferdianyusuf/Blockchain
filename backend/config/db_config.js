const mongoose = require("mongoose");

const db_name = "Blockchain_TA";
const mongoURI = `mongodb://127.0.0.1:27017/${db_name}`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => console.log(`MongoDB connection error: ${err}`));
db.once("open", () => console.log("Connected to MongoDB"));

module.exports = db;
