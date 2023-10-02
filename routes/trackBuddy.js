const express = require('express');
const router = express.Router();
const {createCircle, joinCircle, getCircles} = require('./../controllers/trackBuddy')

router.post("/createCircle", createCircle);
router.post("/joinCircle", joinCircle);
router.get("/getCircles/:id", getCircles)


module.exports = router;