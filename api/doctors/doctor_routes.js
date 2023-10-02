const express = require("express");
const router = express.Router();
// const multer  = require('multer')
// // const upload = multer({ dest: 'uploads/' });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null,  __dirname + '/certificates/');
//   },
//   filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// const {createTodo, readTodo, deleteTodo, deleteAll, editTodo, } = require('../../controllers/todoControllers');
// const {createDoctorProfile, getDoctorInformation} = require('../../controllers/doctor_controllers');


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  __dirname + '/../certificates/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });
const {
  createDoctorProfile,
  getDoctorInformation,
  getAllUsersData,
  getAllDoctorsData,
  deleteAllRecords,
  getDoctorsForAppointment,
  getUpcommingAppointments,
  doctorsAllAppointments,
  isDoctorRegistered,
  createPrescription,
  getPrescriptions,
  updatePrescription,
  updateDoctorProfile,
  getDoctorCompleteProfile
} = require("./doctor_controllers");
const verifyToken = require("../../middlewares/verifyToken");

// router.post("/createTodo", (req, res) => {
//   res.status(200).send({
//     data: "muhammad fayyaz ansari",
//   });
// });
// router.post("/create_profile", createTodo);
// router.post("/create_profile",upload.array('files', 10), createDoctorProfile);
router.post("/create_profile", [verifyToken,upload.array('files', 10)],createDoctorProfile);
// router.post("/create_profile", verifyToken,createDoctorProfile);
router.post("/get_doctors_for_appointment",verifyToken,getDoctorsForAppointment)
router.post("/create_prescription",verifyToken,createPrescription)
router.get("/get_doctor_information", verifyToken,getDoctorInformation);

router.get("/get_doctor_complete_profile/:doctor_id/:doctor_uid", verifyToken,getDoctorCompleteProfile);


// router.post('/upload_picture',upload.array('files', 10),uploadPicture);




router.put("/update_prescription",verifyToken,updatePrescription)
router.put("/updateDoctorProfile", [verifyToken,upload.array('files', 10)],updateDoctorProfile);

// UPDATE patient_medical_records
// SET description = $1
// WHERE id = $2


router.get("/get_prescriptions/:doctor_id/:patient_id/:appointment_id",verifyToken,getPrescriptions);
router.get("/get_upcomming_appointments/:name/:uid/:appointment_status", verifyToken,getUpcommingAppointments);
router.get("/doctors_all_appointments/:name/:uid", verifyToken,doctorsAllAppointments);
router.get("/is_doctor_registered/:name/:uid", verifyToken,isDoctorRegistered);
router.get("/get_all_users", verifyToken,getAllUsersData);
router.get("/get_all_doctors", verifyToken,getAllDoctorsData);
router.get("/delete_all_record", verifyToken,deleteAllRecords);


module.exports = router;
