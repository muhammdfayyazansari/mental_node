let todoList = [];
let copyDataTodoList = [];
const TodoModel = require("./../schemaModels/todoModels");

module.exports.createTodo = (req, res) => {
  const data = req.body.todo;
  // console.log("data>>>>", data)
  try {
    const Todo_Body = new TodoModel(req.body);
    Todo_Body.save(async (err, doc) => {
      if (!err) {
        const todos = await TodoModel.find({});
        // console.log("doc>>>", doc);
        return res.status(200).send({
          message: "success",
          todos: todos,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }

  // let data = req.body.todo;
  // // console.log("data>>>>", data)
  // let dummyArray = ['fayyaz', "ansari", "uncle", "maaz"]
  // let firstRandom = Math.floor(Math.random()*4);
  // let secondRandom = Math.random()*8;
  // const finalId = dummyArray[firstRandom] + secondRandom.toString().slice(2);
  // // const finalId = dummyArray[Number(firstRandom.toString().slice(0,1))] + secondRandom.toString().secondRandom.slice(2);
  // // console.log("client data >> ", data)
  // console.log("final id", finalId)
  // todoList.push({
  //   todo : data,
  //   _id : finalId
  //   // _id : todoList.length
  // });
  // res.status(200).send({
  //   message : "success",
  //   todos: todoList
  // });
};

module.exports.readTodo = async (req, res) => {
  try {
    const todoList = await TodoModel.find({});
    res.status(200).send({
      message: "success",
      todos: todoList,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "500",
      message: "Something went wrong",
    });
  }
};

module.exports.deleteAll = async (req, res) => {
  try{
    const deleteAllTodo = await TodoModel.deleteMany({});
    const emptyTodos= await TodoModel.find({});
    console.log("emptyTodos", emptyTodos)
    res.status(200).send({
      todos : emptyTodos,
      message : "success"
    })
  }catch(error){
    res.status(500).send({
      message: error.message,
      error : error
    })
  }




  // const data = req.body.data;
  // copyDataTodoList = [...todoList];
  // todoList = [];
  // res.status(200).send({
  //   message: "success",
  //   todos: todoList,
  // });
};

module.exports.editTodo = async (req, res) => {
  // console.log("data", req.body)
  const { data } = req.body;
  const id = req.params.id;

  console.log("req.body>>>>", data, "id>>>>", id);
  // for(let i=0; i < todoList.length; i++){
  //   if(todoList[i]._id === id){
  //     // todoList.splice(i,1,{todo: `${data}`, _id: id})
  //     todoList[i] = {...todoList[i], todo: data}
  //     break;
  //   }
  // }
  try {
    const updateTodo = await TodoModel.findByIdAndUpdate(id, { todo: data });
    const Todos = await TodoModel.find({});
    res.status(200).send({
      message: "success",
      todos: Todos,
      ok: true,
      statusText: true,
      isConfirmed: true,
    });
  } catch (error) {
    console.log("error in edit Todo>>>", error.message);
    res.status(500).send({
      message: error.message,
      error: error,
    });
  }

  // res.status(200).send({
  //   todos : todoList,
  //   ok: true,
  //   statusText: true,
  //   isConfirmed : true
  // })
};

module.exports.deleteTodo = async (req, res) => {
  const id = req.params.id;
  // for(let i=0; i < todoList.length; i++){
  //   if(todoList[i]._id === id){
  //     todoList.splice(i, 1);
  //     break;
  //   }
  // }
  // console.log("deleteTodo req.body>>>", id)
  // const {indexTodo} = req.body;
  // todoList.splice(indexTodo, 1)
  try {
    const deleteResponse = await TodoModel.deleteOne({ _id: id });
    const todoList = await TodoModel.find({});
    console.log("delete Success>>", deleteResponse);
    res.status(200).send({
      message: "success",
      todos: todoList,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};
