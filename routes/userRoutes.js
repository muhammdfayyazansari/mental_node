const express = require('express');
const router = express.Router();
const verifyToken = require('./../middlewares/verifyToken');
const {register, userLogIn, userLogOut,profileUpdate} = require('./../controllers/userControllers')


router.post("/register", register);
router.post("/login", userLogIn);
router.get("/logout", verifyToken, userLogOut)
router.post("/profileUpdate/:id", profileUpdate);






module.exports = router;