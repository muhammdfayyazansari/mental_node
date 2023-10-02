const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');


const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String,  required: true, unique: true },
  password: { type: String, required: true },
  tokens: { type: Array },
  createdOn: { type: Date, default: Date.now },
});

UserSchema.pre("save", function(){
  const user = this;
  // console.log("user of this ", this);
  const salt = bcryptjs.genSaltSync(6);
  const hash = bcryptjs.hashSync(user.password, salt);
  user.password = hash;
  // console.log("user of this After encryption ", this);
})

UserSchema.methods.comparePassword = function (frontEndPassword){
  const MongoUser = this; // database user 
  const result = bcryptjs.compareSync(frontEndPassword, MongoUser.password);
  // console.log("compare Result >>", result)
  return result
}

UserSchema.methods.generateToken = function(){
  const MongoUser = this;
  const {_id} = MongoUser;
  const Token = jwt.sign({_id}, process.env.JWT_SECRET);
  return Token;  
}
const UsersModel = mongoose.model("Users", UserSchema);

module.exports = UsersModel;