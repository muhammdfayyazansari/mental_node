const express = require("express");
const router = express.Router();

const {createTodo, readTodo, deleteTodo, deleteAll, editTodo} = require('./../controllers/todoControllers');
// router.post("/createTodo", (req, res) => {
//   res.status(200).send({
//     data: "muhammad fayyaz ansari",
//   });
// });
router.post("/createTodo", createTodo);
router.get("/readTodo", readTodo);
router.delete("/deleteTodo/:id", deleteTodo);
router.delete("/deleteAll", deleteAll)
router.put("/editTodo/:id", editTodo)
module.exports = router;


