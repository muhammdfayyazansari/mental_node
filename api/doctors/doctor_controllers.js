const pool = require("../../config/db.js");
const moment = require("moment");
const formidable = require("formidable");
const TodoModel = require("../../schemaModels/todoModels");
require("dotenv").config();
const {deleteFile} = require("./../glob_functions/index.js")
// const DoctorModel = [];
const DoctorList = [];
// const {getUserInformation} = require("../../service/doctor_service");
const {
  getUserInformation,
  createDoctorProfile,
  createDoctorAvailability,
  createDoctorProfessionExperience,
  getAllUsers,
  getAllDoctorsService,
  deleteAllRecordsService,
  getDoctorsForAppointmentService,
  getAppointmentsUsers,
  getAllAppointmentsUsers,
  getDoctorIfRegistered,
  createPrescriptionService,
  getPrescriptionsService,
  upatedPrescriptionService,
  updateDoctorProfileService,
  updateDoctorProfessionaExperience,
  updateDoctorDetails,
  doctorCompleteProfileService,
  deleteDoctorAvailability,
  getDoctorCertificates
} = require("./doctor_service");

// module.exports.createTodo = (req, res) => {
module.exports.createDoctorProfile = async (req, res, next) => {
  const myData = req?.body;
  const myFiles = req?.files;
  console.log("reqdatamyData 123", myData);
  console.log("reqdatamyData myFiles 123", myFiles);
  let certificates = [];
  const sendCertificatesToFrontend = [];

  if (myFiles) {
    for (let i = 0; i < myFiles.length; i++) {
      certificates.push(myFiles[i].filename);
      sendCertificatesToFrontend.push(myFiles[i].filename);
      // certificates.push(req.files[i].originalname);
    }
    console.log("files data ", myFiles);
    console.log("files data stringOfFileNames", certificates);
  }

  try {
    const data = req.body;
    console.log("reqdata", data);
    let {
      clinic_schedule,
      professional_experience,
      user,
      year,
      college_name,
      course,
    } = data;
    clinic_schedule = JSON.parse(clinic_schedule);
    professional_experience = JSON.parse(professional_experience);
    user = JSON.parse(user);
    let {
      clinic_name,
      clinic_experience,
      specialities,
      clinic_address,
      state,
      zip_code,
      city,
      country,
      professional_bio,
    } = professional_experience;
    console.log("clinic_schedule", clinic_schedule);
    let { uid, name, age } = user;
    let get_user = await getUserInformation(uid, name);
    console.log("get_user", get_user);
    let doctor_id = get_user?.rows[0]?.id;

    if (!college_name || !course || !year || !uid) {
      return res.status(400).send({
        message: "required parameter missing",
        status: 400,
        reqData: { college_name, course, year, uid },
      });
    }
    let updated_date = moment();
    let created_date = moment();

    for (let index = 0; index < clinic_schedule.length; index++) {
      let element = clinic_schedule[index];
      // let start_time = moment(element.start_time, "hh:mm A ZZ").format("HH:mm:ss Z");
      // let end_time = moment(element.end_time, "hh:mm A ZZ").format("HH:mm:ss Z");
      // console.log("element", element);
      // console.log("element", start_time);
      // console.log("element", end_time);
      //  start_time = moment.utc(start_time, "HH:mm:ss Z").format("HH:mm:ss ZZ");
      //  end_time = moment.utc(end_time, "HH:mm:ss Z").format("HH:mm:ss ZZ");
      let resOfDoctorAvailability = await createDoctorAvailability(
        doctor_id,
        element.day,
        element.start_time,
        element.end_time,
        created_date
      );
      console.log("resOfDoctorAvailability", resOfDoctorAvailability);
    }

    let resCreateDoctorProfessionExperience =
      await createDoctorProfessionExperience(
        doctor_id,
        clinic_name,
        clinic_experience,
        specialities,
        clinic_address,
        state,
        city,
        zip_code,
        country,
        professional_bio,
        updated_date
      );
    console.log(
      "resCreateDoctorProfessionExperience",
      resCreateDoctorProfessionExperience
    );
    certificates = JSON.stringify(certificates);
    professional_experience = JSON.stringify(professional_experience);
    clinic_schedule = JSON.stringify(clinic_schedule);
    const response = await createDoctorProfile(
      college_name,
      course,
      year,
      uid,
      certificates,
      professional_experience,
      clinic_schedule
    );

    console.log("responsecreateDoctorProfile", response);
    return res.status(200).send({
      message: "Doctor Profile has been created successfully",
      // data: { doctor_id, uid, name, age },
      data: {sendCertificatesToFrontend}
    });
  } catch (error) {
    console.log("error in createDoctorProfile >>", error.message);
    res.status(500).send({
      message: error.message,
    });
  }

  // console.log("data>>>>", data)
  // try {
  //   const Todo_Body = new TodoModel(req.body);
  //   Todo_Body.save(async (err, doc) => {
  //     if (!err) {
  //       const todos = await TodoModel.find({});
  //       // console.log("doc>>>", doc);
  //       return res.status(200).send({
  //         message: "success",
  //         todos: todos,
  //       });
  //     }
  //   });
  // } catch (error) {
  //   res.status(500).send({
  //     message: "server error",
  //   });
  // }

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
module.exports.getDoctorInformation = async (req, res) => {
  let response = await getUserInformation();
  // const data = req.body;
  // console.log("data", data)
  console.log("data", response);

  // DoctorList.push(data);
  return res.status(200).send({
    message: "success",
    data: "DoctorList",
    pool: response,
  });
};
module.exports.getAllUsersData = async (req, res) => {
  try {
    let response = await getAllUsers();
    // const data = req.body;
    // console.log("data", data)
    console.log("data", response.rows);

    // DoctorList.push(data);
    return res.status(200).send({
      message: "success",
      data: response.rows,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      // data: response,
    });
  }
};
module.exports.getAllDoctorsData = async (req, res) => {
  try {
    let response = await getAllDoctorsService();
    const data = [...response.rows];
    // console.log("data", data)

    let updatedData = [];

    let obj = {};
    for (let i = 0; i < data.length; i++) {
      let doctor_id = data[i].doctor_id;
      if (!obj[doctor_id]) {
        // if the doctor object not in obj
        let { day, start_time, end_time, ...res } = data[i];
        let myObj = {
          ...res,
          clinic_schedule: [{ day, start_time, end_time }],
        };
        obj[doctor_id] = myObj;
      } else {
        let { day, start_time, end_time, ...res } = data[i];
        let flag = true;
        for (let i = 0; i < obj[doctor_id]?.clinic_schedule?.length; i++) {
          let element = obj[doctor_id]?.clinic_schedule[i];
          if(element.day == day && element.start_time == start_time){
           flag = false; 
          }
        }
        let myObj = {
          ...res,
          clinic_schedule: { day, start_time, end_time },
        };
        if(flag){
          obj[doctor_id].clinic_schedule.push(myObj.clinic_schedule);
        }
      }
    }
    console.log("updatedData obj", obj);
    // Push nested object to Array
    Object.values(obj).forEach((item) => {
      updatedData.push(item);
    });
    console.log("updatedData", updatedData);

    console.log("getAllDoctorsService data", response.rows);

    // DoctorList.push(data);
    return res.status(200).send({
      message: "success",
      data: updatedData,
      // data: response.rows,
    });
  } catch (error) {
    console.log("error", error.message);
    return res.status(500).send({
      message: "server error",
      // data: response,
    });
  }
};
module.exports.getDoctorsForAppointment = async (req, res) => {
  try {
    const data = req.body;
    console.log("getDoctorsForAppointmentdata", data);
    let { day, start_time, end_time, selectDate } = req.body.data;
    // const formatted_start_time = moment(start_time).format(
    //   "YYYY-MM-DDTHH:mm:ss.SSSZ"
    // );
    // const formatted_end_time = moment(end_time).format(
    //   "YYYY-MM-DDTHH:mm:ss.SSSZ"
    // );

    let response = await getDoctorsForAppointmentService(
      start_time,
      end_time,
      day
    );
    console.log("appointmentData", response);
    // let doctors_filtes_ids = [];
    // let doctors_filtes_uids = [];

    // const filteredData = response?.rows?.filter((entry) => {
    //   const entryStartTime = moment(entry.start_time);
    //   const entryEndTime = moment(entry.end_time);
    //   if (
    //     entryStartTime.isSameOrBefore(formatted_start_time) &&
    //     entryEndTime.isSameOrAfter(formatted_end_time)
    //   ) {
    //     doctors_filtes_ids.push(entry.doctor_id)
    //   }
    //   return (
    //     entryStartTime.isSameOrBefore(formatted_start_time) &&
    //     entryEndTime.isSameOrAfter(formatted_end_time)
    //   );
    // });
    // console.log("filteredData", doctors_filtes_ids)

    return res.status(200).send({
      message: "success",
      data: response?.rows,
    });
  } catch (error) {
    console.log("error in getDoctorsForAppointment", error.message);
    return res.status(500).send({
      message: "server error",
    });
  }
};
module.exports.getUpcommingAppointments = async (req, res) => {
  try {
    const data = req.params;
    console.log("data", data);
    const { uid, name, appointment_status } = data;
    // GET USER ID FROM UID AND NAME OF PATIENT
    let get_user = await getUserInformation(uid, name);
    const doctor_id = get_user?.rows[0]?.id;
    console.log("get_user_id", get_user);
    console.log("get_user_id", doctor_id);

    // GET USER ID FROM UID AND NAME OF PATIENT
    let resOfPatientsList = await getAppointmentsUsers(
      doctor_id,
      appointment_status
    );
    console.log("resOfPatientsList", resOfPatientsList);

    res.status(200).send({
      message: "success",
      data: resOfPatientsList?.rows,
    });
  } catch (error) {
    console.log("error in getAppointments controller", error.message);
    res.status(500).send({
      message: "error",
      data: false,
    });
  }
};
module.exports.doctorsAllAppointments = async (req, res) => {
  try {
    const data = req.params;
    console.log("data", data);
    const { uid, name } = data;
    // GET USER ID FROM UID AND NAME OF PATIENT
    let get_user = await getUserInformation(uid, name);
    const doctor_id = get_user?.rows[0]?.id;
    console.log("get_user_id", get_user);
    console.log("get_user_id", doctor_id);

    // GET USER ID FROM UID AND NAME OF PATIENT
    let resOfPatientsList = await getAllAppointmentsUsers(doctor_id);
    console.log("resOfPatientsList", resOfPatientsList);

    res.status(200).send({
      message: "success",
      data: resOfPatientsList?.rows,
    });
  } catch (error) {
    console.log("error in getAppointments controller", error.message);
    res.status(500).send({
      message: "error",
      data: false,
    });
  }
};

module.exports.deleteAllRecords = async (req, res) => {
  try {
    let response = await deleteAllRecordsService();
    // const data = req.body;
    // console.log("data", data)
    // console.log("data", response.rows)

    // DoctorList.push(data);
    return res.status(200).send({
      message: "data successfully delete",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      data: error,
    });
  }
};
// createPrescription
module.exports.createPrescription = async (req, res, next) => {
  try {
    const data = req.body.data;
    console.log("reqdata", data);
    let {
      patient_id,
      doctor_id,
      appointment_id,
      description,
      attachments,
      updated_date,
    } = data;

    // if (!college_name || !course || !year || !uid) {
    //   return res.status(400).send({
    //     message: "required parameter missing",
    //     status: 400,
    //     reqData: { college_name, course, year, uid },
    //   });
    // }

    const response = await createPrescriptionService(
      patient_id,
      doctor_id,
      appointment_id,
      description,
      updated_date
    );

    console.log("response", response);
    return res.status(200).send({
      message: "Prescription has been created successfully",
    });
  } catch (error) {
    console.log("error in createPrescriptionService >>", error.message);
    res.status(500).send({
      message: error.message,
    });
  }
};
module.exports.getPrescriptions = async (req, res) => {
  try {
    const data = req.params;
    console.log("data", data);
    const { doctor_id, patient_id, appointment_id } = data;

    // GET ALL PRESCRIPTIONS OF PATIENTS
    let resOfPrescriptions = await getPrescriptionsService(
      doctor_id,
      patient_id,
      appointment_id
    );
    console.log("resOfPrescriptions", resOfPrescriptions);

    res.status(200).send({
      message: "success",
      data: resOfPrescriptions?.rows,
    });
  } catch (error) {
    console.log("error in getPrescriptions controller", error.message);
    res.status(500).send({
      message: error.message,
      data: false,
    });
  }
};
// updatePrescription
module.exports.updatePrescription = async (req, res, next) => {
  try {
    const data = req.body.data;
    console.log("updateprescription reqdata", data);
    let {
      patient_id,
      doctor_id,
      appointment_id,
      description,
      attachments,
      updated_date,
      id,
    } = data;

    // if (!college_name || !course || !year || !uid) {
    //   return res.status(400).send({
    //     message: "required parameter missing",
    //     status: 400,
    //     reqData: { college_name, course, year, uid },
    //   });
    // }

    const response = await upatedPrescriptionService(
      patient_id,
      doctor_id,
      appointment_id,
      description,
      updated_date,
      id
    );

    console.log(" upatedPrescriptionServiceresponse", response);
    return res.status(200).send({
      message: "Prescription has been Updated successfully",
    });
  } catch (error) {
    console.log("error in upatedPrescriptionService >>", error.message);
    res.status(500).send({
      message: error.message,
    });
  }
};
// isDoctorRegistered
module.exports.isDoctorRegistered = async (req, res) => {
  try {
    const data = req.params;
    console.log("data", data);
    const { uid, name } = data;

    // // GET [USER ID] FROM [UID AND NAME] OF DOCTOR
    let get_user = await getUserInformation(uid, "abcd");
    const doctor_id = get_user?.rows[0]?.id;
    // console.log("get_user_id", get_user);
    // console.log("get_user_id", doctor_id);

    // CHECK DOCTOR EXIST REGISTERED OR NOT
    let res_get_doctor = await getDoctorIfRegistered(uid, name, 11);
    console.log("res_get_doctor", res_get_doctor);
    // rowCount
    let dataToSend =
      res_get_doctor?.rowCount == 0 ? false : res_get_doctor?.rows[0];

    res.status(200).send({
      message: "success",
      data: dataToSend,
      id: doctor_id,
      uid,
      name,
    });
  } catch (error) {
    console.log("error in getDoctorIfRegistered controller", error);
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports.updateDoctorProfile = async (req, res) => {
  const myData = req?.body;
  const myFiles = req?.files;
  console.log("reqdatamyData 123", myData);
  console.log("reqdatamyData myFiles 123", myFiles);
  let certificates = [];
  if (myFiles) {
    for (let i = 0; i < myFiles.length; i++) {
      certificates.push(myFiles[i].filename);
      // certificates.push(req.files[i].originalname);
    }
    console.log("files data ", myFiles);
    console.log("files data stringOfFileNames", certificates);
  }
  try {
    //     doctor_id,name,phone,email,dob,gender,collage_name,course,year,certificates,clinic_name,clinic_experience,specialities,
    // clinic_address,state,zip_code,city,country,clinic_schedule, description

    let {
      id,
      uid,
      name,
      phone,
      email,
      dob,
      gender,
      doctor_details,
      professional_experience,
      clinic_schedule,
    } = req.body;
    console.log("doctor_details1234", doctor_details);
    console.log("professional_experience", professional_experience);
    console.log("clinic_schedule", clinic_schedule);
    // console.log("doctor_details", doctor_details)
    // certificates = JSON.parse(certificates);
    // doctor_details = JSON.parse(doctor_details);
    professional_experience = JSON.parse(professional_experience);
    clinic_schedule = JSON.parse(clinic_schedule);

    // console.log("doctor_details", doctor_details)
    // console.log("professional_experience", professional_experience)
    // console.log("clinic_schedule", clinic_schedule)
    let {
      clinic_name,
      clinic_experience,
      specialities,
      clinic_address,
      state,
      zip_code,
      city,
      country,
      description,
    } = professional_experience;
    // let { college_name, course, year } = doctor_details;
    let { college_name, course, year } = JSON.parse(doctor_details);
    // let {collage_name,course,year,certificates}  = clinic_schedule
    // console.log("doctor_id", id);
    let response = await updateDoctorProfileService(
      id,
      name,
      phone,
      email,
      dob,
      gender,
      clinic_address,
      state,
      zip_code,
      city,
      country
    );
    console.log("updatePatientProfileService", response);

    let resupdateDoctorProfessionaExperience =
      await updateDoctorProfessionaExperience(
        id,
        clinic_name,
        clinic_experience,
        specialities,
        clinic_address,
        state,
        zip_code,
        city,
        country,
        description
      );
    console.log(
      "resupdateDoctorProfessionaExperience",
      resupdateDoctorProfessionaExperience
    );

    let updatedCertificates = JSON.stringify(certificates);

    let updatedprofessional_experience = JSON.stringify(
      professional_experience
    );
    let updatedclinic_schedule = JSON.stringify(clinic_schedule);
    
    const resOfDoctorCertificates = await getDoctorCertificates(uid);

    // let formattedDbCertificates = JSON.parse(resOfDoctorCertificates);
    for(let i=0; i<resOfDoctorCertificates?.rows[0]?.certificates?.length; i++){
      await deleteFile(resOfDoctorCertificates?.rows[0]?.certificates[i]);
      // console.log("fileDeleted", resOfDoctorCertificates[i])
    }
   
    let responseupdateDoctorDetails = await updateDoctorDetails(
      uid,
      college_name,
      course,
      year,
      updatedCertificates,
      updatedprofessional_experience,
      updatedclinic_schedule
    );
    console.log("responseupdateDoctorDetails", responseupdateDoctorDetails);

    let responsedeleteDoctorAvailability = await deleteDoctorAvailability(id);
    console.log(
      "responsedeleteDoctorAvailability",
      responsedeleteDoctorAvailability
    );
    for (let index = 0; index < clinic_schedule.length; index++) {
      let element = clinic_schedule[index];
      let created_date = moment().format("YYYY-MM-DD");
      // let start_time = moment(element.start_time, "hh:mm A ZZ").format("HH:mm:ss Z");
      // let end_time = moment(element.end_time, "hh:mm A ZZ").format("HH:mm:ss Z");
      // console.log("element", element);
      // console.log("element", start_time);
      // console.log("element", end_time);
      //  start_time = moment.utc(start_time, "HH:mm:ss Z").format("HH:mm:ss ZZ");
      //  end_time = moment.utc(end_time, "HH:mm:ss Z").format("HH:mm:ss ZZ");
      let resOfDoctorAvailability = await createDoctorAvailability(
        id,
        element.day,
        element.start_time,
        element.end_time,
        created_date
      );
      console.log("resOfDoctorAvailability", resOfDoctorAvailability);
    }
    // console.log("fileDeleted resOfDoctorCertificates", resOfDoctorCertificates?.rows[0].certificates)
    console.log("updateDoctorDetails DAta",
    uid,
    college_name,
    course,
    year,
    updatedCertificates,
    updatedprofessional_experience,
    updatedclinic_schedule)
    res.status(200).send({
      message: "success",
      // data: response?.rows,
      // data: updatedData,
    });
  } catch (error) {
    console.log(
      "error in updateDoctorProfileService controller",
      error.message
    );
    res.status(500).send({
      message: "error",
    });
  }
};
module.exports.getDoctorCompleteProfile = async (req, res) => {
  try {
    //     doctor_id,name,phone,email,dob,gender,collage_name,course,year,certificates,clinic_name,clinic_experience,specialities,
    // clinic_address,state,zip_code,city,country,clinic_schedule, description

    const { doctor_id, doctor_uid } = req.params;
    console.log("doctor_id", doctor_id, doctor_uid);
    let response = await doctorCompleteProfileService(doctor_id, doctor_uid);
    console.log("doctorCompleteProfileService", response?.rows[0]);
    console.log(
      "doctorCompleteProfileService doctor_details",
      response?.rows[0]?.doctor_details
    );
    console.log(
      "doctorCompleteProfileService types",
      typeof response?.rows[0]?.doctor_details
    );

    if (response?.rows?.length > 0) {
      const results = response?.rows[0]?.doctor_details?.certificates;
      if (results) {
        // Map the fetched results to include the image paths
        let certificatesURL = [];
        if (results?.length > 0) {
          for (let i = 0; i < results.length; i++) {
            const imageName = results[i];
            // Change 'image_name' to the column name in your table that stores the image names
            // const imageUrl = `http://your-domain/certificates/${imageName}`;
            const imageUrl = `http://${process.env.DOMAIN}/certificates/${imageName}`;
            certificatesURL.push(imageUrl);
          }
          res.status(200).send({
            message: "success",
            data: [
              {
                ...response?.rows[0],
                doctor_details: {
                  ...response?.rows[0]?.doctor_details,
                  certificates: certificatesURL,
                },
              },
            ],
          });
        } else {
          res.status(200).send({
            message: "success",
            // data: {...response?.rows[0], certificates: certificatesURL},
            data: response?.rows,
          });
        }
      } else {
        res.status(200).send({
          message: "success",
          data: response?.rows,
          // data: updatedData,
        });
      }
    } else {
      res.status(200).send({
        message: "success",
        data: response?.rows,
        // data: updatedData,
      });
    }

    // res.status(200).send({
    //   message: "success",
    //   data: response?.rows,
    //   // data: updatedData,
    // });
  } catch (error) {
    console.log(
      "error in doctorCompleteProfileService controller",
      error.message
    );
    res.status(500).send({
      message: "error",
    });
  }
};

//////////////////////////////////////////////////////////////////////////////// crud work
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
  try {
    const deleteAllTodo = await TodoModel.deleteMany({});
    const emptyTodos = await TodoModel.find({});
    console.log("emptyTodos", emptyTodos);
    res.status(200).send({
      todos: emptyTodos,
      message: "success",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      error: error,
    });
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

// SELECT
//     dd.doctor_uid,
//     au.id,
//     au.name,
// 	au.level
// FROM
//     d02_doctor_details dd
//     INNER JOIN action_users au ON dd.doctor_uid = au.uid
// WHERE
//     au.uid = 'c26fbc47-fb8e-4255-91a2-32d5eee81470'
//     AND au.name = 'pathan'
// 	AND au.level = 11
//     AND EXISTS (
//         SELECT 1
//         FROM d02_doctor_availability da
//         WHERE da.doctor_id = au.id
//     )
//     AND EXISTS (
//         SELECT 1
//         FROM doctor_professional_experience dpe
//         WHERE dpe.doctor_id = au.id
//     );
