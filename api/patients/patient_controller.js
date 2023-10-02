const express = require("express");
const pool = require("../../config/db.js");
const moment = require("moment");
const { getUserInformation } = require("./../doctors/doctor_service.js");
const {
  pscTestCheck,
  createDoctorAppointmentService,
  upcomingAppoinmentService,
  patientPrescriptionsService,
  updatePatientProfileService,
  createPatientTestService,
} = require("./patient_services.js");
const {
  ProgramFormEnum,
  getFormName,
  pscQuizResult,
} = require("./../glob_functions/index.js");


// module.exports.createAppointment = async (req, res) => {
//   const data = req.body;
//   console.log("data", data);

//   res.status(200).send({
//     message: "success",
//   });
// };
module.exports.pscTestCheck = async (req, res) => {
  const data = req.body;
  const { uid, name } = data;
  console.log("data", data);

  let get_user = await getUserInformation(uid, name);
  console.log("get_user_information", get_user);

  // pscTestCheck
  let resOfpscTestCheck = await pscTestCheck(uid);
  console.log("resOfpscTestCheck", resOfpscTestCheck);
  if (resOfpscTestCheck?.rows[0]?.uid) {
    res.status(200).send({
      message: "success",
      program_data_uid: resOfpscTestCheck?.rows[0]?.uid,
      data: {...get_user?.rows[0], psc_test_result: resOfpscTestCheck?.rows[0]},
    });
  } else {
    res.status(200).send({
      message: "success",
      program_data_uid: false,
      data: get_user.rows[0],
    });
  }

  // try {
  //   // get current userData from user actions table
  //   // let get_user = await getUserInformation(uid, name);
  //   // console.log("get_user", get_user);

  //   // pscTestCheck
  //   let resOfpscTestCheck = await pscTestCheck(uid);
  //   console.log("resOfpscTestCheck", resOfpscTestCheck);

  //   res.status(200).send({
  //     message: "success",
  //     program_data_uid: resOfpscTestCheck.rows[0].uid,
  //   });

  // } catch (error) {
  //   console.log("error in pscTestCheck controller")
  //   res.status(500).send({
  //     message: "error",
  //     data: false
  //   });
  // }
};

module.exports.createAppointment = async (req, res, next) => {
  try {
    const data = req?.body?.data;
    console.log("reqdata", data);
    let { appointment_date, patient, doctor_details } = data;
    let { uid, name } = patient;

    // if (!college_name || !course || !year || !uid) {
    //   return res.status(400).send({
    //     message: "required parameter missing",
    //     status: 400,
    //     reqData: { college_name, course, year, uid },
    //   });
    // }

    // GET USER ID FROM UID AND NAME OF PATIENT
    let get_user = await getUserInformation(uid, name);
    const patient_id = get_user?.rows[0]?.id;
    console.log("get_user_id", get_user);
    console.log("get_user_id", patient_id);
    let appointment = {
      // patient_id: get_user?.rows[0]?.id,
      doctor_id: doctor_details?.doctor_id,
      date: appointment_date?.selectDate,
      time: appointment_date?.start_time,
      slot_duration: 1,
      appointment_status: "booked",
      updated_date: moment(),
      start_time: appointment_date?.start_time,
      end_time: appointment_date?.end_time,
    };
    console.log("appointment structure", appointment);
    let {
      // patient_id,
      doctor_id,
      date,
      time,
      slot_duration,
      appointment_status,
      updated_date,
      start_time,
      end_time,
    } = appointment;

    const response = await createDoctorAppointmentService(
      patient_id,
      doctor_id,
      date,
      time,
      slot_duration,
      appointment_status,
      updated_date,
      start_time,
      end_time
    );

    console.log("response", response);

    // const response = {rows: {data : "success"}}
    return res.status(200).send({
      message: "Appointment has been created successfully",
      data: response?.rows[0],
      success: true,
    });
  } catch (error) {
    console.log("error in createDoctorProfile >>", error);
    res.status(500).send({
      message: "server error",
    });
  }
};

module.exports.patientUpcomingAppointment = async (req, res) => {
  try {
    const { patient_id } = req.params;
    console.log("patient_id", patient_id);
    let updatedData = [];

    let response = await upcomingAppoinmentService(patient_id);
    console.log("upcomingAppoinmentService", response);
    response = response.rows;
    if (response?.length != 0) {
      let data = response;
      for (let i = 0; i < data.length; i++) {
        let element = data[i];
        let { name, patient_id, doctor_id, ...rest } = element;
        let nextElement = data[i + 1];
        if (
          data[i].doctor_id == data[i + 1]?.doctor_id &&
          i != data.length - 1
        ) {
          let { name, patient_id, doctor_id, ...remaining } = nextElement;
          let myObj = {
            name,
            patient_id,
            doctor_id,
            schedule: [{ ...rest }, { ...remaining }],
          };
          updatedData.push(myObj);
          i = i + 1;
        } else {
          let myObj = {
            name,
            patient_id,
            doctor_id,
            schedule: [{ ...rest }],
          };
          updatedData.push(myObj);
        }
      }
      console.log("upcomingAppoinmentService updatedData", updatedData);
    }
    res.status(200).send({
      message: "success",
      data: response,
      // data: updatedData,
    });
  } catch (error) {
    console.log(
      "error in patientUpcomingAppointment controller",
      error.message
    );
    res.status(500).send({
      message: "error",
      data: false,
    });
  }
};
module.exports.doctorPrescriptionsForPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    console.log("patient_id", patient_id);

    let response = await patientPrescriptionsService(patient_id);
    console.log("patientPrescriptionsService", response);
    res.status(200).send({
      message: "success",
      data: response?.rows,
      // data: updatedData,
    });
  } catch (error) {
    console.log(
      "error in doctorPrescriptionsForPatient controller",
      error.message
    );
    res.status(500).send({
      message: "error",
    });
  }
};
module.exports.updatePatientProfile = async (req, res) => {
  try {
    console.log("req.body.data", req.body.data);
    const {
      id,
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
    } = req.body.data;
    console.log("patient_id", req.body.data);
    let response = await updatePatientProfileService(
      id,
      name,
      phone,
      email,
      dob,
      gender,
      address,
      state,
      zip_code,
      city,
      country
    );
    console.log("updatePatientProfileService", response);
    res.status(200).send({
      message: "success",
      data: response?.rows,
      // data: updatedData,
    });
  } catch (error) {
    console.log(
      "error in updatePatientProfileService controller",
      error.message
    );
    res.status(500).send({
      message: "error",
    });
  }
};

module.exports.createPatientTest = async (req, res) => {
  try {
    const data = req?.body?.data;
    const { formId, answers , patient_uid} = req.body.data;
    console.log("reqdata", data);
    // formId)
    // console.log("formId answers", answers)
    let name = getFormName(formId);
    name = name?.name?.toLowerCase()
    const pscScore = await pscQuizResult(name, answers);
    console.log("pscScore", pscScore);
    // let [condition,metadata,score,consultancy_status] = [pscScore?.result, answers, pscScore?.score,null]
    let [condition,metadata,score,consultancy_status, created_at] = [pscScore?.result, answers, pscScore?.score,null, Math.floor(new Date().getTime() / 1000)]

    // patient_uid,
    // name,
    // condition,
    // metadata,
    // score,
    // status,
    // updated_at,
    // updated_by,
    // consultancy_status,
    // created_by, == patient_uid
    console.log("psceData", { patient_uid,
    name,
    condition,
    metadata,
    score,
    status: 1,
    consultancy_status,
    createdBy: patient_uid})
    const response = await createPatientTestService(
      patient_uid,
      name,
      condition,
      metadata,
      score,
      1,
      consultancy_status,
      patient_uid,
      created_at
    );
    // let abcd = ProgramFormEnum

    console.log("createPatientTestService response", response);

    return res.status(200).send({
      message: "createPatientTestService has been created successfully",
      success: true,
      data : pscScore
    });
  } catch (error) {
    console.log("error in createPatientTest >>", error);
    res.status(500).send({
      message: "server error",
    });
  }
};

// module.exports.patientUpcomingAppointment = async (req, res) => {
//   try {
//     const {patient_id} = req.params;
//     console.log("patient_id", patient_id);

//     let get_user = await getUserInformation(uid, name);
//     console.log("get_user_information", get_user);

//     res.status(200).send({
//       message: "success",
//     });
//   } catch (error) {
//     console.log("error in pscTestCheck controller");
//     res.status(500).send({
//       message: "error",
//       data: false,
//     });
//   }
// };

// pscTestCheck
// let resOfpscTestCheck = await pscTestCheck(uid);
// console.log("resOfpscTestCheck", resOfpscTestCheck);
// if (resOfpscTestCheck?.rows[0]?.uid) {
//   res.status(200).send({
//     message: "success",
//     program_data_uid: resOfpscTestCheck.rows[0].uid,
//   });
// } else {
//   res.status(200).send({
//     message: "success",
//     program_data_uid: false,
//   });
// }
