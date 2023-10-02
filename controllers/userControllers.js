const mongoose = require("mongoose");
const UsersModel = require("./../schemaModels/UserModels");
const jwt = require('jsonwebtoken');

module.exports.register = (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("USER DATA>>>", req.body);
  try {
    const userRef = new UsersModel({
      firstName,
      lastName,
      email,
      password,
    });

    userRef.save((err, doc) => {
      if (!err) {
        res.status(200).send({
          message: "doc saved ",
          data: doc,
        });
      } else {
        console.log("database err");
       
        res.send({
          message: "database error doc not saved",
          error: err,
          errMsg: err.message,
          status: 500
        });
        res.status(500);
      }
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: "something went wrong",
      errorMsg: error.message,
    });
  }
  // For checking of data
  // res.status(200).send({
  //   message: "data recieved",
  //   data: req.body,
  // });
};

module.exports.userLogIn = async (req, res) => {
  const { email, password } = req.body;
  console.log("userLogIn req.body", req.body);
  try {
    const MongoUser = await UsersModel.findOne({ email });
    if (!MongoUser) {
      return res.status(404).send({
        message: "email is not registered Please first register Your self ",
      });
    }
    const checkPassword = MongoUser.comparePassword(password);
    if (!checkPassword) {
      return res.status(404).send({
        message: "email or password is incorrect",
      });
    }
    const Token = MongoUser.generateToken();
    MongoUser.tokens.push(Token);

    UsersModel.findByIdAndUpdate(
      MongoUser._id,
      {
        tokens: MongoUser.tokens,
      },{new: true},
      (err, doc) => {
        if (!err) {
          res.status(200).send({
            message: "doc updated",
            updatedDoc: doc,
          });
        } else {
          res.status(500).send({
            message: err.message,
            error: err,
          });
        }
      }
    );
    // if (updateMongoUser) {
    //   res.status(200).send({
    //     message: "doc updated",
    //     updatedDoc: updateMongoUser,
    //   });
    // } else {
    //   res.status(500).send({
    //     message: "doc is not updated",
    //     error: updateMongoUser,
    //   });
    // }
  } catch (error) {
    res.status(500).send({
      message: "server error",
      error: error,
    });
  }
};

module.exports.userLogOut = async (req, res) => {
  let token = req.headers.authorization;
  token = token.split(' ')[1];
  const result = jwt.verify(token, process.env.JWT_SECRET)
  // console.log("result in logout", result)
  if(result._id){
    const id = result._id;
    console.log("id of result ", id)
    const findUser = await UsersModel.findOne({_id : id})
    // console.log("finduser", findUser)
    findUser.tokens.splice(findUser.tokens.indexOf(id,1))
    UsersModel.findByIdAndUpdate(id, {tokens : findUser.tokens},(err, doc)=>{
      if(!err){
        res.send({
          anme : 'askje',
          data : doc
        })
      }else{
        res.status(500).send({
          error : err.message
        })
      }
    })
  }
}


module.exports.profileUpdate = async (req, res) => {
  const updatedData = req.body;
  const id = req.params.id;
  console.log("req.body>>>>", updatedData, "id>>>>", id);
  try {
    const updatedProfile = await UsersModel.findByIdAndUpdate(id, updatedData, {new: true});
    res.status(200).send({
      message: "success",
      updatedData : updatedProfile
    });
  } catch (error) {
    console.log("error in edit Todo>>>", error.message);
    res.status(500).send({
      message: error.message,
      error: error,
    });
  }

};