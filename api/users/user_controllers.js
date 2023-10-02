const pool = require("../../config/db.js");
const moment = require("moment");
const {
  check_user_already_register_service,
  patient_register_service,
  doctor_register_service,
  get_user_information,
  updateUserPasswordService,
  getUserByEmail,
} = require("./user_service.js");
// const {
//   pscTestCheck,
//   createDoctorAppointmentService,
// } = require("./patient_services.js");
const {
  hashPassword,
  passwordMatcher,
  generateToken,
} = require("./../glob_functions/index.js");

const bcrypt = require("bcrypt");

module.exports.isUserAlreadyRegister = async (req, res) => {
  try {
    const data = req.params;
    const { email, phone } = data;
    console.log("email, phone data", data);

    // CHECK USER EXIST REGISTERED OR NOT
    let reOfCheckUserRegistered = await check_user_already_register_service(
      email,
      phone
    );
    console.log("check_user_already_register_service", reOfCheckUserRegistered);

    // const doctor_details = res_get_doctor?.rows[0];
    // console.log("res_get_doctor", doctor_details);

    res.status(200).send({
      message: "isUserAlreadyRegister success",
      data: reOfCheckUserRegistered?.rows[0],
      isRegistered: reOfCheckUserRegistered?.rows[0] ? true : false,
    });
  } catch (error) {
    console.log("error in isUserAlreadyRegister controller", error.message);
    res.status(500).send({
      message: "internal server error",
    });
  }
};
module.exports.patientRegister = async (req, res) => {
  try {
    const { phone, email, level } = req.body.data;

    // Check if the email or phone already exists in the database
    let existingUser = await check_user_already_register_service(email, phone);
    console.log("check_user_already_register_service", existingUser);

    if (existingUser?.rowCount > 0) {
      return res.status(400).send({ message: "Email Or Phone already exists" });
    }

    const encryptPassword = await hashPassword(password);
    const salt = "saltOrRound";
    const status = 1;

    if (level == 13) {
      const {
        name,
        dob,
        gender,
        address,
        state,
        zip_code,
        city,
        country,
        level,
      } = req.body.data;

      // Save the Patient details in the database
      let patientRegister = await patient_register_service(
        name,
        phone,
        email,
        dob,
        gender,
        address,
        state,
        zip_code,
        city,
        country,
        encryptPassword,
        level,
        salt,
        status
      );
      console.log("patient_register_service", patientRegister);

      res.status(201).send({ message: "User Registered Successfully" });
    } else if (level == 11) {
      const { name, dob, gender, level } = req.body.data;

      // Save the Doctor details in the database
      let doctorRegister = await doctor_register_service(
        name,
        phone,
        email,
        dob,
        gender,
        encryptPassword,
        level,
        salt,
        status
      );
      console.log("doctor_register_service", doctorRegister);

      res.status(201).send({ message: "User Registered Successfully" });
    }
  } catch (error) {
    console.log("error in user Signup controller", error.message);
    res.status(500).send({
      message: "internal server error",
    });
  }
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body.data;

    // get the user exists in the database
    // const getUserQuery = "SELECT * FROM action_users WHERE email = $1";
    // const user = await pool.query(getUserQuery, [email]);
    const user = await getUserByEmail(email);
    console.log("check_user_register", user);

    if (user.rowCount === 0) {
      return res
        .status(201)
        .send({ error: { message: "Invalid email or password" } });
    }

    // Verify the password
    // const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    const isPasswordValid = await passwordMatcher(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res
        .status(200)
        .send({ error: { message: "Invalid email or password" } });
    }

    // Function to calculate age
    function calculateAge(dateOfBirth) {
      const today = moment();
      const dob = moment(dateOfBirth);
      const age = today.diff(dob, "years");
      return age;
    }

    // // Example usage
    // const dateOfBirth = '1990-05-15'; // Format: YYYY-MM-DD

    const age = calculateAge(user.rows[0].dob);
    console.log("Age:", age);

    // Generate a JWT token
    const token = await generateToken({
      id: user.rows[0].id,
      uid: user.rows[0].uid,
    });
    res.status(201).send({
      message: "User Login Successfully",
      login: { data: { ...user.rows[0], age, token } },
    });
  } catch (error) {
    console.log("error in user Login controller", error.message);
    res.status(500).send({
      message: "internal server error",
    });
  }
};
module.exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, email, phone, id } = req.body.data;
    console.log("changePassowrd data", req?.body?.data);

    // Check if the email or phone already exists in the database
    let existingUser = await check_user_already_register_service(email, phone);
    console.log("check_user_already_register_service", existingUser);

    // Retrieve the user's existing password from the database (replace this with your own logic)
    if (existingUser?.rowCount === 0) {
      return res.status(200).send({ message: "User not found" });
    }
    // Compare the current password with the password stored in the database
    const isPasswordCorrect = await passwordMatcher(
      currentPassword,
      existingUser?.rows[0].password
    );
    // console.log("isPasswordCorrect ", isPasswordCorrect);

    // // const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(200).send({
        success: false,
        message: "Current password is incorrect",
      });
    }
    // Hash the new password
    // const encryptPassword = hashPassword(password);
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    const hashedPassword = await hashPassword(newPassword);
    console.log("hashedPassword ", hashedPassword);

    // // Update the user's password in the database (replace this with your own logic)
    // // const updatePasswordRes =  await updateUserPasswordService(req.user.email, hashedPassword);
    const updatePasswordRes = await updateUserPasswordService(
      hashedPassword,
      id
    );
    console.log("updatePasswordRes ", updatePasswordRes);

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in change password controller", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
};
module.exports.getUserInformation = async (req, res) => {
  try {
    const data = req.params;
    const { email } = data;
    console.log("email data", data);

    // GET USER INFORMATION
    let resGet_user_information = await get_user_information(email);
    console.log("get_user_information", resGet_user_information);

    // const doctor_details = res_get_doctor?.rows[0];
    // console.log("res_get_doctor", doctor_details);

    res.status(200).send({
      message: "get_user_information success",
      data: resGet_user_information?.rows[0],
      isRegistered: resGet_user_information?.rows[0] ? true : false,
    });
  } catch (error) {
    console.log("error in isUserAlreadyRegister controller", error);
    res.status(500).send({
      message: error.message,
    });
  }
};
module.exports.uploadPicture = async (req, res) => {
  try {
    const files = req.files;
    const arrayOfFileNames = [];
    for (let i = 0; i < files.length; i++) {
      arrayOfFileNames.push(req.files[i].filename);
      // arrayOfFileNames.push(req.files[i].originalname);
    }
    // const stringOfFileNames = arrayOfFileNames.implode(",");
    console.log("files data ", files);
    console.log("files data stringOfFileNames", arrayOfFileNames);
    // console.log("files data stringOfFileNames", stringOfFileNames)

    // GET USER INFORMATION
    // let resGet_user_information = await get_user_information(email);
    // console.log("get_user_information", resGet_user_information);

    // const doctor_details = res_get_doctor?.rows[0];
    // console.log("res_get_doctor", doctor_details);

    res.status(200).send({
      message: "success",
      // data: resGet_user_information?.rows[0],
      // isRegistered: resGet_user_information?.rows[0] ? true : false,
    });
  } catch (error) {
    console.log("error in isUserAlreadyRegister controller", error);
    res.status(500).send({
      message: error.message,
    });
  }
};

// (req, res) => {
//   // Access form fields via req.body
//   const data = req.body;
//   // const { email } = data;
//   console.log("bpody data", data);
//   console.log("bpody data",   req.file);
//   // Handle the file upload if applicable
//   res.status(200).send({
//     message: "success",
//     // data: resGet_user_information?.rows[0],
//     // isRegistered: resGet_user_information?.rows[0] ? true : false,
//   });
// }
