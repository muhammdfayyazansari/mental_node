const express = require("express");
const router = express.Router();

const { 
  createAppointment,
   pscTestCheck,
   patientUpcomingAppointment,
   doctorPrescriptionsForPatient,
   updatePatientProfile,createPatientTest
  
  } = require("./patient_controller");
const verifyToken = require("../../middlewares/verifyToken");

router.post("/psc_test_check", verifyToken,pscTestCheck);
router.post("/create_appointment", verifyToken,createAppointment);
router.post("/create_psc_test", verifyToken,createPatientTest);


router.get("/get_patient_upcoming_appointment/:patient_id", verifyToken,patientUpcomingAppointment);
router.get("/get_patient_prescription/:patient_id", verifyToken,doctorPrescriptionsForPatient);
router.put("/update_patient_profile",verifyToken,updatePatientProfile);


module.exports = router;




