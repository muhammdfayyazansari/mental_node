const express = require("express");
const router = express.Router();

// router.use("/", (req, res) => {
//   res.status(200).send({
//     data: "fayyaz ansaseri",
//   });
// });

 

// router.use('/trackBuddy', require('./trackBuddy'));
// router.use('/todo', require('./todoRoutes'));
// router.use("/user", require('./userRoutes'))

router.use("/doctor", require('./doctor_profile'))

module.exports = router;
