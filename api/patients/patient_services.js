const pool = require("../../config/db");
const moment = require("moment");
// SELECT field_name FROM your_table_name WHERE condition;
module.exports = {
  createDoctorAppointmentService: (
    patient_id,
    doctor_id,
    date,
    time,
    slot_duration,
    appointment_status,
    updated_date,
    start_time,
    end_time
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO patient_appointments (patient_id, doctor_id, date, time, slot_duration, appointment_status, updated_date, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9)`,
        [
          patient_id,
          doctor_id,
          date,
          time,
          slot_duration,
          appointment_status,
          updated_date,
          start_time,
          end_time,
        ],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  pscTestCheck: (patient_uid) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT uid, condition, score, name FROM p02_program_data WHERE patient_uid = $1`,
        [patient_uid],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  upcomingAppoinmentService: (patient_id) => {
    return new Promise((resolve, reject) => {
      //       `SELECT
      //     pa.patient_id,
      //     pa.doctor_id,
      //     au.name,
      //     json_agg(json_build_object(
      //         'date', pa.date,
      //         'time', pa.time,
      //         'slot_duration', pa.slot_duration,
      //         'appointment_status', pa.appointment_status,
      //         'created_date', pa.created_date,
      //         'updated_date', pa.updated_date,
      //         'id', pa.id,
      //         'start_time', pa.start_time,
      //         'end_time', pa.end_time,
      //         'name', au.name
      //     )) AS schedule
      // FROM
      //     patient_appointments AS pa
      // JOIN
      //     action_users AS au ON pa.doctor_id = au.id
      // WHERE
      //     pa.patient_id = $1
      // GROUP BY
      //     pa.patient_id,
      //     pa.doctor_id,
      //     au.name;`,
      pool.query(
        `SELECT
        pa.patient_id,
        pa.doctor_id,
        au.name,
        json_agg(json_build_object(
            'date', pa.date,
            'time', pa.time,
            'slot_duration', pa.slot_duration,
            'appointment_status', pa.appointment_status,
            'created_date', pa.created_date,
            'updated_date', pa.updated_date,
            'id', pa.id,
            'start_time', pa.start_time,
            'end_time', pa.end_time,
            'name', au.name,
            'specialities', dpe.specialities
        )) AS schedule
    FROM
        patient_appointments AS pa
    JOIN
        action_users AS au ON pa.doctor_id = au.id
    JOIN
        doctor_professional_experience AS dpe ON au.id = dpe.doctor_id
    WHERE
        pa.patient_id = $1
    GROUP BY
        pa.patient_id,
        pa.doctor_id,
        au.name;`,
        [patient_id],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  patientPrescriptionsService: (patient_id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT pmr.patient_id, pmr.doctor_id, pmr.appointment_id, array_agg(json_build_object('prescription_id', pmr.id, 'description', pmr.description, 'created_date', pmr.created_date, 'updated_date', pmr.updated_date)) AS prescription, au.name
        FROM patient_medical_records AS pmr
        JOIN action_users AS au ON pmr.doctor_id = au.id
        WHERE pmr.patient_id = $1
        GROUP BY pmr.patient_id, pmr.doctor_id, pmr.appointment_id, au.name`,
        [patient_id],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  updatePatientProfileService: (
    patient_id,
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
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE action_users
        SET name = $1, phone = $2, email = $3, dob = $4, gender = $5, address = $6, state = $7, zip_code = $8, city = $9, country = $10
        WHERE id = $11`,
        [
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
          patient_id,
        ],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  createPatientTestService: (
    patient_uid,
    name,
    condition,
    metadata,
    score,
    status,
    consultancy_status,
    created_by,
    created_at
  ) => {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO p02_program_data (patient_uid,name,condition,metadata,score,status,consultancy_status,created_by,created_at) VALUES ($1, $2, $3, $4, $5, $6, $7,$8, $9)`,
        [
          patient_uid,
          name,
          condition,
          metadata,
          score,
          status,
          consultancy_status,
          created_by,
          created_at
        ],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
};

// upcomingAppoinmentService: (patient_id) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       `SELECT pa.*, au.name
//       FROM patient_appointments AS pa
//       JOIN action_users AS au ON pa.doctor_id = au.id
//       WHERE pa.patient_id = $1`,
//       [patient_id],
//       (error, results, fields) => {
//         if (error) {
//           console.log(error);
//           return reject(error);
//         }
//         return resolve(results);
//       }
//     );
//   });
// },

// patientPrescriptionsService: (patient_id) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       `SELECT
//       pmr.patient_id,
//       pmr.doctor_id,
//       pmr.appointment_id,
//       array_agg(
//           json_build_object(
//               'prescription_id', pmr.id,
//               'description', pmr.description,
//               'created_date', pmr.created_date,
//               'updated_date', pmr.updated_date
//           )
//       ) AS prescription,
//       array_agg(
//           json_build_object(
//               'day', d02_doctor_availability.day,
//               'start_time', d02_doctor_availability.start_time,
//               'end_time', d02_doctor_availability.end_time,
//               'created_date', d02_doctor_availability.created_date
//           )
//       ) AS schedule,
//       au.name
//   FROM
//       patient_medical_records AS pmr
//       JOIN action_users AS au ON pmr.doctor_id = au.id
//       JOIN d02_doctor_availability ON pmr.doctor_id = d02_doctor_availability.doctor_id
//   WHERE
//       pmr.patient_id = $1
//   GROUP BY
//       pmr.patient_id,
//       pmr.doctor_id,
//       pmr.appointment_id,
//       au.name;`,
//       [patient_id],
//       (error, results, fields) => {
//         if (error) {
//           console.log(error);
//           return reject(error);
//         }
//         return resolve(results);
//       }
//     );
//   });
// },

//

// upcomingAppoinmentService: (patient_id) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       `SELECT au.name FROM action_users AS au WHERE au.id IN (SELECT doctor_id FROM patient_appointments WHERE patient_id = $1)`,
//       [patient_id],
//       (error, results, fields) => {
//         if (error) {
//           console.log(error);
//           return reject(error);
//         }
//         return resolve(results);
//       }
//     );
//   });
// },
// pool.query(
//   `SELECT uid FROM p02_program_data WHERE patient_uid = $1`,
//   [patient_uid],
//   (error, results, fields) => {
//     if (error) {
//       console.log(error);
//       return reject(error);
//     }
//     return resolve(results);
//   }
// );

// pool.query(
//   `SELECT pd.uid, au.* FROM p02_program_data AS pd JOIN action_users AS au ON pd.patient_uid = au.uid WHERE pd.patient_uid = $1`,
//   [patient_uid],
//   (error, results, fields) => {
//     if (error) {
//       console.log(error);
//       return reject(error);
//     }
//     return resolve(results);
//   }
// );
