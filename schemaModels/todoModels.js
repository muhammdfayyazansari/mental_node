const mongoose = require("mongoose");
const schema = mongoose.Schema;




const TodoSchema = new schema({
  todo : {
    type : String, 
    required : true,
    createdOn : {type: Date, default: Date.now }
  },
  status: Boolean
})

const TodoModel = mongoose.model('Todos', TodoSchema);

module.exports = TodoModel;