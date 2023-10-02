const express = require("express");
const router = express.Router();
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
// const upload = multer();

//files must be same as u pass from frontend
//10 is file limit

const {
  isUserAlreadyRegister,
  patientRegister,
  getUserInformation,
  uploadPicture,
  login,
  changePassword
} = require("./user_controllers");
router.post('/patient_register', patientRegister);
router.post('/login',login);
router.post('/change_password',changePassword);
router.post('/upload_picture',upload.array('files', 10),uploadPicture);
//
router.get("/isAlreadyRegister/:email/:phone", isUserAlreadyRegister);

router.get("/get_user_information/:email/", getUserInformation);
// router.post("/upload_picture", uploadPicture);
// router.post('/upload_picture',upload.single('file'),uploadPicture);
// router.post('/upload_picture',upload.array('files', 10),uploadPicture);


// router.get("/get_doctor_information",getDoctorInformation)

module.exports = router;

// isAlreadyRegister/:email/:phone
