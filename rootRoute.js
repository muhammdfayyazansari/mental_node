const express = require("express");
const router = express.Router();
const path = require("path");
// const verifyToken = require()

// const data = "21-09-2023 04:31:51";
// const date = "23-09-2023 02:03:09";
// const date = "26-09-2023 11:21:50";
// const date = "26-09-2023 04:14:59";
// const date = "28-09-2023 04:21:17";
// const date = "29-09-2023 01:21:17";
// const date = "29-09-2023 07:24:50";
const date = "30-09-2023 09:09:54";

router.use("/check_connection", (req, res) => {
  res.status(200).send({
    date,
  });
});

// router.use('/trackBuddy', require('./trackBuddy'));
// router.use('/todo', require('./todoRoutes'));
// router.use("/user", require('./userRoutes'))

router.use("/user", require("./api/users/user_routes"));
router.use("/doctor", require("./api/doctors/doctor_routes"));
router.use("/patient", require("./api/patients/patient_routes"));
// Define a route to serve the images
router.get('/certificates/:filename', (req, res) => {
  const{filename}= req.params;
  console.log("filename",filename);
  const filepath = path.join(__dirname, 'api', 'certificates', filename);
  console.log("path",filepath);
  return res.sendFile(filepath);
});

module.exports = router;
