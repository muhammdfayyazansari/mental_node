const mongoose = require("mongoose");






const CirclSchema = mongoose.Schema({
  circleName : {type: String, required: true},
  members : {type : Array, required : true},
  circleCode : {type: String, required : true},
  author  : {type: String, required: true},
  createdOn : {type: Date, default: Date.now }
})
const CircleModel = mongoose.model('circles', CirclSchema);



module.exports = CircleModel;