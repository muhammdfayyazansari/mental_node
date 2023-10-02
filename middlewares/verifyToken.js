const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to verify JWT token
function verifyMyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded; // Token is valid
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

const verifyToken = (req, res, next) => {
  // let token = req?.headers?.Authorization;
  let token = req.get("Authorization")
  console.log("token barear", token);

  try {
    if (!token) {
      // res.send({
      //   status: 404,
      //   message: "Token not found",
      // });
      throw new Error("Token not found");
    }

    // if (token.split(" ")[0] === "Barear") {
    //   token = token.split(" ")[1];
    // }
    if (token.split(" ")[0] === "Bearer") {
      token = token.split(" ")[1];
    }
    // const result = jwt.verify(token, process.env.JWT_SECRET);
    const decodedToken = verifyMyToken(token, process.env.JWT_SECRECT)
    console.log("decodedToken", decodedToken);
    console.log("decodedToken token", token);
    console.log("decodedToken process.env.JWT_SECRECT", process.env.JWT_SECRECT);

    // if(decodedToken){

    // }
    // if (decodedToken._id) {
    //   console.log("decodedToken id ", decodedToken._id);
    //   next();
    // }
    if (decodedToken) {
      // console.log("decodedToken id ", decodedToken.id);
      next();
    }else{
      throw new Error("Invalid Token or Expired");
    }

    // res.send({
    //     status: 400,
    //     message: "Invalid Token Or Expired",
    // })
  } catch (e) {
    console.log(e);
    res.send({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = verifyToken;
