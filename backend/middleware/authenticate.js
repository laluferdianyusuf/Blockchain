const jwt = require("jsonwebtoken");
const { JWT } = require("../lib/const");
const UserRepository = require("../repositories/userRepository");

const authenticate = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send({
      status: false,
      message: "You have to sign in first",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { email } = jwt.verify(token, JWT.SECRET);
    const user = await UserRepository.FindByEmail({ email: email });

    if (!user) {
      return res.status(401).send({
        status: false,
        message: "User not found",
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({
      status: false,
      message: "Your session has expired" + err,
      data: null,
    });
  }
};

module.exports = { authenticate };
